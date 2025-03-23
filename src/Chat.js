import React, { useEffect, useState, useRef} from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import EmojiPicker from "emoji-picker-react";
import "./App.css"; 


function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  const emojiPickerRef = useRef(null);



    // Send message
    const sendMessage = async () => {
      if (currentMessage.trim() !== "") {
        const messageData = {
          room,
          author: username,
          message: currentMessage,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          replyTo: replyingTo, // Store reply reference
        };
  
        await socket.emit("send_message", messageData);
        setCurrentMessage("");
        setReplyingTo(null); // Clear reply after sending
      }
    };

 
  // Receive messages
  useEffect(() => {
    const receiveMessageHandler = (data) => {
      setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", receiveMessageHandler);
    return () => socket.off("receive_message", receiveMessageHandler);
  }, [socket]);


   //Close emoji picker
   useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-header">
        <p>Quick Chat</p>
      </div>

      {/* Chat Body */}
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((msg, index) => (
            <div key={index} className={`message ${username === msg.author ? "you" : "other"}`}
            style={{
              marginLeft: username === msg.author ? "auto" : "0px",
            }}>
              
              {/* Reply Bubble */}
              {msg.replyTo && (
                <div className="reply-bubble">
                  <strong>{msg.replyTo.author}:</strong> {msg.replyTo.message}
                </div>
              )}

              {/* Message Content */}
              <div className="message-content">
                <p>{msg.message}</p>
              </div>

              {/* Message Meta (Time & Name) */}
              <div className="message-meta">
                <span>{msg.time}</span>
                <span className="author-name">{msg.author}</span>
                <button onClick={() => setReplyingTo(msg)} className="reply-btn">↩</button>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>

      {/* Chat Footer */}
      <div className="chat-footer">
        <button className="emoji-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😀</button>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="emoji-picker" ref={emojiPickerRef}>
            <EmojiPicker showCategories={true} onEmojiClick={(e) => setCurrentMessage((prev) => prev + e.emoji)} />
          </div>
        )}

        {/* Reply Preview */}
        {replyingTo && (
          <div className="reply-preview">
            Replying to: <b>{replyingTo.message}</b>
            <button onClick={() => setReplyingTo(null)}>X</button>
          </div>
        )}

        {/* Message Input */}
        <input
          type="text"
          value={currentMessage}
          placeholder="Type a message..."
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;

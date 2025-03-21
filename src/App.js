import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  const appStyle = {
    width: "100vw",
    height: "100vh",
    background: "url('/background1.jpg')",
    backgroundSize: "cover",
    display: "grid",
    placeItems: "center",
  };

  return (
    <div style={appStyle}>
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Chat Now</h3>
          <input 
            type="text"
            placeholder="Enter your name..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}

  <p className="footer-text">
    © {new Date().getFullYear()} LiveChatApp by Prinda| Privacy Policy | 
      Contact: prindam2002@gmail.com</p>

    </div>
  );
}
  

export default App;

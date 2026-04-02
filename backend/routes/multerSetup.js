const multer = require("multer");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

module.exports = upload;





import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import "./App.css";

const socket = io("http://localhost:5000");

// TEMP USERS
const users = [
  { id: "user1", name: "Hiranmai" },
  { id: "user2", name: "Friend" },
  { id: "user3", name: "Teammate" },
];
const groups = [
  { id: "group1", name: "Friends Group" },
  { id: "group2", name: "Project Team" },
];
function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [file, setFile] = useState(null);

  const [currentUser] = useState(users[0]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatId, setChatId] = useState("");

  // CREATE UNIQUE CHAT ID
  const createChatId = (u1, u2) => {
    return [u1, u2].sort().join("_");
  };

  const handleUserClick = (user) => {
  const id = createChatId(currentUser.id, user.id);

  // ✅ LEAVE OLD ROOM
  if (chatId) {
    socket.emit("leaveChat", chatId);
  }

  setSelectedUser(user);
  setChatId(id);
  setChat([]);

  // ✅ JOIN NEW ROOM
  socket.emit("joinChat", id);

  axios
    .get(`http://localhost:5000/messages/${id}`)
    .then((res) => setChat(res.data))
    .catch((err) => console.log(err));
};

  // SOCKET LISTENER 
 useEffect(() => {
  socket.off("receiveMessage"); 

  socket.on("receiveMessage", (msg) => {
    setChat((prev) => [...prev, msg]);
  });

  return () => {
    socket.off("receiveMessage");
  };
}, []);

  // SEND MESSAGE
  const sendMessage = () => {
    if (!message.trim() || !chatId) return;

    socket.emit("sendMessage", {
      chatId,
      content: message,
      sender: currentUser.id,
    });

    setMessage("");
  };
 const handleSend = async () => {
 
  if (file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/upload",
        formData
      );

      socket.emit("sendMessage", {
        chatId,
        media: res.data.fileUrl,
        sender: currentUser.id,
      });

      setFile(null);
    } catch (err) {
      console.log(err);
    }

    return;
  }
  if (message.trim()) {
    socket.emit("sendMessage", {
      chatId,
      content: message,
      sender: currentUser.id,
    });

    setMessage("");
  }
};
  

  // AUTO SCROLL
  useEffect(() => {
    const chatBox = document.querySelector(".chat-body");
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [chat]);
const handleGroupClick = (group) => {
  setSelectedUser(null);

  const id = group.id; // groupId itself is chatId
  setChatId(id);

  setChat([]);

  socket.emit("joinChat", id);

  axios
    .get(`http://localhost:5000/messages/${id}`)
    .then((res) => setChat(res.data));
};
  return (
    <div className="app">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>Users</h2>

        {users.map((user) => (
          <div
            key={user.id}
            className="chat-item"
            onClick={() => handleUserClick(user)}
          >
            {user.name}
          </div>
        ))}
         <h3>Groups</h3>

{groups.map((group) => (
  <div
    key={group.id}
    className="chat-item"
    onClick={() => handleGroupClick(group)}
  >
    {group.name}
  </div>
))}
      </div>

      {/* CHAT AREA */}
      <div className="chat-area">

        {/* HEADER */}
        <div className="chat-header">
  {selectedUser
    ? selectedUser.name
    : chatId
    ? chatId
    : "Select chat"}
</div>

        {/* MESSAGES */}
        <div className="chat-body">
          {chat.map((msg) => (
            <div
              key={msg._id || Math.random()}
              className={`message ${
                msg.sender === currentUser.id ? "sent" : "received"
              }`}
            >
              {msg.content}

              {msg.media && (
                <img src={msg.media} alt="media" />
              )}
            </div>
          ))}
         
        </div>

        {/* INPUT */}
        <div className="chat-footer">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button className="send-btn" onClick={handleSend}>
  ➤
</button>
        </div>

      </div>
    </div>
  );
}

export default App;
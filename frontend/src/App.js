import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import Auth from "./pages/Auth";
import "./App.css";

const socket = io("http://localhost:5000");

function App() {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [file, setFile] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatId, setChatId] = useState("");

  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [showMenu, setShowMenu] = useState(false);
  const [showGroupUI, setShowGroupUI] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    axios
      .get(`http://localhost:5000/chats/${currentUser._id}`)
      .then((res) => setChats(res.data));
  }, [currentUser]);

  useEffect(() => {
    socket.off("receiveMessage");

    socket.on("receiveMessage", (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  useEffect(() => {
    const chatBox = document.querySelector(".chat-body");
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  }, [chatMessages]);

  const handleSearch = async () => {
    if (!search) return;

    const res = await axios.get(
      `http://localhost:5000/search?q=${search}`
    );

    setSearchResults(res.data);
  };

  const startChat = async (user) => {
    const res = await axios.post("http://localhost:5000/chat", {
      userId: currentUser._id,
      friendId: user._id,
    });

    const chat = res.data;

    setSelectedChat(chat);
    setChatId(chat._id);

    socket.emit("joinChat", chat._id);

    const messages = await axios.get(
      `http://localhost:5000/messages/${chat._id}`
    );

    setChatMessages(messages.data);
  };

  const openChat = async (chat) => {
    if (chatId) socket.emit("leaveChat", chatId);

    setSelectedChat(chat);
    setChatId(chat._id);

    socket.emit("joinChat", chat._id);

    const res = await axios.get(
      `http://localhost:5000/messages/${chat._id}`
    );

    setChatMessages(res.data);
  };

  const toggleUser = (user) => {
    if (selectedUsers.find((u) => u._id === user._id)) {
      setSelectedUsers((prev) =>
        prev.filter((u) => u._id !== user._id)
      );
    } else {
      setSelectedUsers((prev) => [...prev, user]);
    }
  };

  const createGroup = async () => {
    if (!groupName || selectedUsers.length < 2) {
      alert("Enter group name & select users");
      return;
    }

    const res = await axios.post("http://localhost:5000/group", {
      name: groupName,
      users: [
        currentUser._id,
        ...selectedUsers.map((u) => u._id),
      ],
    });

    setChats((prev) => [...prev, res.data]);

    setShowGroupUI(false);
    setSelectedUsers([]);
    setGroupName("");
  };

  const handleSend = async () => {
    if (!chatId) return;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        "http://localhost:5000/upload",
        formData
      );

      socket.emit("sendMessage", {
        chatId,
        media: res.data.fileUrl,
        sender: currentUser._id,
      });

      setFile(null);
      return;
    }

    if (message.trim()) {
      socket.emit("sendMessage", {
        chatId,
        content: message,
        sender: currentUser._id,
      });

      setMessage("");
    }
  };

  if (!currentUser) {
    return <Auth setUser={setCurrentUser} />;
  }

  return (
    <div className="app">

      <div className="sidebar">

        <h2 className="user-title">👤 {currentUser?.name}</h2>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("user");
            setCurrentUser(null);
          }}
        >
          Logout
        </button>

        <div className="search-box">

          <input
            placeholder="Search user"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="add-btn" onClick={handleSearch}>
            Add
          </button>

          <div className="menu-wrapper">
            <button
              className="menu-btn"
              onClick={() => setShowMenu(!showMenu)}
            >
              ⋮
            </button>

            {showMenu && (
              <div className="menu-dropdown">
                <div
                  onClick={() => {
                    setShowGroupUI(true);
                    setShowMenu(false);
                  }}
                >
                  New Group
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ✅ UPDATED GROUP UI */}
        {showGroupUI && (
          <div className="group-box">

            <h4>Select Members</h4>

            {chats
              .flatMap((c) => c.users)
              .filter((u) => u._id !== currentUser._id)
              .filter(
                (v, i, a) =>
                  a.findIndex(t => t._id === v._id) === i
              )
              .map((user) => {
                const isSelected = selectedUsers.find(
                  (u) => u._id === user._id
                );

                return (
                  <div key={user._id} className="chat-item user-row">
                    <span>{user.name}</span>

                    <button
                      className={`add-btn ${isSelected ? "added" : ""}`}
                      onClick={() => toggleUser(user)}
                    >
                      {isSelected ? "Added" : "Add"}
                    </button>
                  </div>
                );
              })}

            <input
              placeholder="Search more users"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button className="add-btn" onClick={handleSearch}>
              Search
            </button>

            {searchResults.map((user) => {
              const isSelected = selectedUsers.find(
                (u) => u._id === user._id
              );

              return (
                <div key={user._id} className="chat-item user-row">
                  <span>{user.name}</span>

                  <button
                    className={`add-btn ${isSelected ? "added" : ""}`}
                    onClick={() => toggleUser(user)}
                  >
                    {isSelected ? "Added" : "Add"}
                  </button>
                </div>
              );
            })}

            <input
              placeholder="Group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />

            <button className="add-btn" onClick={createGroup}>
              Create Group
            </button>

          </div>
        )}

        <h3>Chats</h3>

        {chats.map((chat) => {
          const otherUser = chat.users.find(
            (u) => u._id !== currentUser._id
          );

          return (
            <div
              key={chat._id}
              className="chat-item"
              onClick={() => openChat(chat)}
            >
              {chat.isGroup
                ? "👥 " + chat.chatName
                : "👤 " + otherUser?.name}
            </div>
          );
        })}
      </div>

      <div className="chat-area">

        <div className="chat-header">
          {selectedChat
            ? selectedChat.isGroup
              ? selectedChat.chatName
              : selectedChat.users.find(
                  (u) => u._id !== currentUser._id
                )?.name
            : "Select chat"}
        </div>

        <div className="chat-body">
          {chatMessages.map((msg) => (
            <div
              key={msg._id || Math.random()}
              className={`message ${
                msg.sender === currentUser._id
                  ? "sent"
                  : "received"
              }`}
            >
              {msg.content}
              {msg.media && <img src={msg.media} alt="" />}
            </div>
          ))}
        </div>

        <div className="chat-footer">
          <input
            className="message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button onClick={handleSend}>Send</button>
        </div>

      </div>
    </div>
  );
}

export default App;
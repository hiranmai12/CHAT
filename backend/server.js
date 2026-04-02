const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const multer = require("multer");

const Message = require("./models/messageModel");
const User = require("./models/User");
const Chat = require("./models/Chat"); // ✅ FIXED

const authRoutes = require("./routes/auth");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);

// ✅ MONGODB
mongoose.connect("mongodb://localhost:27017/shop")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* ================= FILE UPLOAD ================= */

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  res.json({
    fileUrl: `http://localhost:5000/uploads/${req.file.filename}`,
  });
});

/* ================= USERS ================= */

app.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json("Error fetching users");
  }
});

/* ================= SEARCH ================= */

app.get("/search", async (req, res) => {
  try {
    const query = req.query.q;

    const users = await User.find({
      $or: [
        { email: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
      ],
    }).select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json("Search error");
  }
});

/* ================= CHAT ================= */

// 🔥 PRIVATE CHAT (CREATE OR GET)
app.post("/chat", async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    let chat = await Chat.findOne({
      isGroup: false,
      users: { $all: [userId, friendId] },
    });

    if (!chat) {
      chat = await Chat.create({
        users: [userId, friendId],
        isGroup: false,
      });
    }

    res.json(chat);
  } catch (err) {
    res.status(500).json("Chat error");
  }
});

// 🔥 CREATE GROUP
app.post("/group", async (req, res) => {
  try {
    const { name, users } = req.body;

    if (!name || !users.length) {
      return res.status(400).json("Invalid group data");
    }

    const group = await Chat.create({
      chatName: name,
      users,
      isGroup: true,
    });

    res.json(group);
  } catch (err) {
    res.status(500).json("Group error");
  }
});

// 🔥 GET USER CHATS
app.get("/chats/:userId", async (req, res) => {
  try {
    const chats = await Chat.find({
      users: req.params.userId,
    })
      .populate("users", "-password")
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (err) {
    res.status(500).json("Fetch chats error");
  }
});

/* ================= MESSAGES ================= */

app.get("/messages/:chatId", async (req, res) => {
  try {
    const messages = await Message.find({
      chatId: req.params.chatId,
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json("Message fetch error");
  }
});

/* ================= SOCKET ================= */

const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("leaveChat", (chatId) => {
    socket.leave(chatId);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const savedMsg = await Message.create(data);

      // 🔥 IMPORTANT
      io.to(data.chatId).emit("receiveMessage", savedMsg);
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

/* ================= START ================= */

server.listen(5000, () =>
  console.log("Server running on port 5000")
);
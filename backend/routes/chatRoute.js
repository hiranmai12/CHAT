const express = require("express");
const Chat = require("../models/Chat");
const router = express.Router();

// Create Private Chat
router.post("/private", async (req, res) => {
  const { userId1, userId2 } = req.body;

  const chat = await Chat.create({
    users: [userId1, userId2],
    isGroup: false,
  });

  res.json(chat);
});

// Create Group Chat
router.post("/group", async (req, res) => {
  const { users, chatName } = req.body;

  const chat = await Chat.create({
    users,
    isGroup: true,
    chatName,
  });

  res.json(chat);
});
router.get("/messages/:chatId", async (req, res) => {
  const messages = await Message.find({
    chatId: req.params.chatId,
  }).populate("sender");

  res.json(messages);
});
module.exports = router;
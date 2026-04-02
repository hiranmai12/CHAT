const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: String,
  content: String,
  media: String,
  chatId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Chat",
},
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
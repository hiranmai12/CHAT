const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  isGroup: { type: Boolean, default: false },

  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  chatName: String,
}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);
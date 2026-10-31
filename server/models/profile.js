const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Profile", ProfileSchema);

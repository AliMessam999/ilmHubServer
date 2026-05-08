const mongoose = require("mongoose");

const speakerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    bio: String,
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Speaker", speakerSchema);
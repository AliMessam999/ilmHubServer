const mongoose = require('mongoose');

const speakerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    bio: {
      type: String,
      default: '',
    },

    image: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Speaker', speakerSchema);
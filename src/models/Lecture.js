const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: '',
    },

    videoUrl: {
      type: String,
      default: '',
    },

    language: {
      type: String,
      default: 'en',
    },

    date: {
      type: Date,
      default: Date.now,
    },

    // 🔗 relation: Speaker
    speakerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Speaker',
      required: true,
    },

    // 🔗 relation: Topics (many-to-many)
    topics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lecture', lectureSchema);
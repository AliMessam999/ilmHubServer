const Speaker = require('../models/Speaker');
const Lecture = require('../models/Lecture');

exports.getSpeakers = async (req, res) => {
  try {
    const { sort, limit } = req.query;

    let speakers = await Speaker.find();

    // attach lecture count manually
    const speakersWithCount = await Promise.all(
      speakers.map(async (speaker) => {
        const count = await Lecture.countDocuments({ speakerId: speaker._id });
        return {
          ...speaker.toObject(),
          lecturesCount: count,
        };
      })
    );

    // sorting
    if (sort === 'popular') {
      speakersWithCount.sort((a, b) => b.lecturesCount - a.lecturesCount);
    } else {
      speakersWithCount.sort((a, b) => a.name.localeCompare(b.name));
    }

    const result = limit
      ? speakersWithCount.slice(0, parseInt(limit))
      : speakersWithCount;

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching speakers',
      error: error.message,
    });
  }
};

exports.getSpeaker = async (req, res) => {
  try {
    const speaker = await Speaker.findById(req.params.id);

    if (!speaker)
      return res.status(404).json({ message: 'Speaker not found' });

    const lectures = await Lecture.find({ speakerId: speaker._id });

    res.status(200).json({ ...speaker.toObject(), lectures });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching speaker',
      error: error.message,
    });
  }
};

exports.createSpeaker = async (req, res) => {
  const { name, bio } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const speaker = await Speaker.create({ name, bio, image });
    res.status(201).json(speaker);
  } catch (error) {
    res.status(500).json({
      message: 'Error creating speaker',
      error: error.message,
    });
  }
};

exports.updateSpeaker = async (req, res) => {
  const { name, bio } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    const updateData = { name, bio };
    if (image !== undefined) updateData.image = image;

    const speaker = await Speaker.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json(speaker);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating speaker',
      error: error.message,
    });
  }
};

exports.deleteSpeaker = async (req, res) => {
  try {
    await Speaker.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Speaker deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting speaker',
      error: error.message,
    });
  }
};
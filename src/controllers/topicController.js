const Topic = require('../models/Topic');
const Lecture = require('../models/Lecture');

exports.getTopics = async (req, res) => {
  try {
    const topics = await Topic.find();

    const topicsWithCount = await Promise.all(
      topics.map(async (topic) => {
        const count = await Lecture.countDocuments({
          topics: topic._id,
        });

        return {
          ...topic.toObject(),
          lecturesCount: count,
        };
      })
    );

    if (req.query.sort === 'popular') {
      topicsWithCount.sort((a, b) => b.lecturesCount - a.lecturesCount);
    } else {
      topicsWithCount.sort((a, b) => a.name.localeCompare(b.name));
    }

    res.status(200).json(topicsWithCount);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching topics',
      error: error.message,
    });
  }
};

exports.createTopic = async (req, res) => {
  try {
    const topic = await Topic.create({ name: req.body.name });
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({
      message: 'Error creating topic',
      error: error.message,
    });
  }
};

exports.updateTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );

    res.status(200).json(topic);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating topic',
      error: error.message,
    });
  }
};

exports.deleteTopic = async (req, res) => {
  try {
    await Topic.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Topic deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting topic',
      error: error.message,
    });
  }
};
const Lecture = require('../models/Lecture');

exports.getLectures = async (req, res) => {
  const { topicId, startDate, endDate, speakerId, search, language, sort, limit } = req.query;

  try {
    let filter = {};

    // Topic filter (many-to-many)
    if (topicId) {
      const ids = Array.isArray(topicId) ? topicId : [topicId];
      filter.topics = { $in: ids };
    }

    if (speakerId) {
      filter.speakerId = speakerId;
    }

    // Date range
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Language filter
    if (language) {
      filter.language = language;
    }

    // Search
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let query = Lecture.find(filter)
      .populate('speakerId')
      .populate('topics');

    // Sorting
    query = query.sort({ date: sort === 'oldest' ? 1 : -1 });

    // Limit
    if (limit) query = query.limit(parseInt(limit));

    const lectures = await query;

    res.status(200).json(lectures);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching lectures',
      error: error.message,
    });
  }
};

exports.getLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id)
      .populate('speakerId')
      .populate('topics');

    if (!lecture)
      return res.status(404).json({ message: 'Lecture not found' });

    res.status(200).json(lecture);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching lecture',
      error: error.message,
    });
  }
};

exports.createLecture = async (req, res) => {
  const { title, description, videoUrl, language, date, speakerId, topicIds } =
    req.body;

  try {
    const lecture = await Lecture.create({
      title,
      description,
      videoUrl,
      language,
      date: date ? new Date(date) : null,
      speakerId,
      topics: topicIds || [],
    });

    res.status(201).json(lecture);
  } catch (error) {
    res.status(500).json({
      message: 'Error creating lecture',
      error: error.message,
    });
  }
};

exports.updateLecture = async (req, res) => {
  const { title, description, videoUrl, language, date, speakerId, topicIds } =
    req.body;

  try {
    const lecture = await Lecture.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        videoUrl,
        language,
        date: date ? new Date(date) : undefined,
        speakerId,
        topics: topicIds,
      },
      { new: true }
    );

    res.status(200).json(lecture);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating lecture',
      error: error.message,
    });
  }
};

exports.deleteLecture = async (req, res) => {
  try {
    await Lecture.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Lecture deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting lecture',
      error: error.message,
    });
  }
};
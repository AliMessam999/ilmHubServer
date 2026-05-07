const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getLectures = async (req, res) => {
  const { topicId, startDate, endDate, speakerId, search, language, sort, limit } = req.query;
  
  let where = {};
  
  if (topicId) {
    const ids = Array.isArray(topicId) ? topicId.map(id => parseInt(id)) : [parseInt(topicId)];
    where.topics = { some: { id: { in: ids } } };
  }
  
  if (speakerId) {
    where.speakerId = parseInt(speakerId);
  }
  
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }
  
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { speaker: { name: { contains: search } } }
    ];
  }
  
  if (language) {
    where.language = language;
  }

  try {
    const lectures = await prisma.lecture.findMany({
      where,
      include: { speaker: true, topics: true },
      orderBy: { date: sort === 'oldest' ? 'asc' : 'desc' },
      take: limit ? parseInt(limit) : undefined
    });
    res.status(200).json(lectures);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lectures', error: error.message });
  }
};

exports.getLecture = async (req, res) => {
  const { id } = req.params;
  try {
    const lecture = await prisma.lecture.findUnique({
      where: { id: parseInt(id) },
      include: { speaker: true, topics: true }
    });
    if (!lecture) return res.status(404).json({ message: 'Lecture not found' });
    res.status(200).json(lecture);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lecture', error: error.message });
  }
};

exports.createLecture = async (req, res) => {
  const { title, description, videoUrl, language, date, speakerId, topicIds } = req.body;
  try {
    const lecture = await prisma.lecture.create({
      data: {
        title,
        description,
        videoUrl,
        language,
        date: date ? new Date(date) : null,
        speakerId: parseInt(speakerId),
        topics: {
          connect: topicIds ? topicIds.map(id => ({ id: parseInt(id) })) : []
        }
      }
    });
    res.status(201).json(lecture);
  } catch (error) {
    res.status(500).json({ message: 'Error creating lecture', error: error.message });
  }
};

exports.updateLecture = async (req, res) => {
  const { id } = req.params;
  const { title, description, videoUrl, language, date, speakerId, topicIds } = req.body;
  try {
    const lecture = await prisma.lecture.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        videoUrl,
        language,
        date: date ? new Date(date) : undefined,
        speakerId: speakerId ? parseInt(speakerId) : undefined,
        topics: topicIds ? {
          set: topicIds.map(id => ({ id: parseInt(id) }))
        } : undefined
      }
    });
    res.status(200).json(lecture);
  } catch (error) {
    res.status(500).json({ message: 'Error updating lecture', error: error.message });
  }
};

exports.deleteLecture = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.lecture.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: 'Lecture deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lecture', error: error.message });
  }
};

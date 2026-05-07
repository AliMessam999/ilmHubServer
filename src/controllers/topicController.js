const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getTopics = async (req, res) => {
  const { sort } = req.query;
  try {
    const topics = await prisma.topic.findMany({
      include: {
        _count: {
          select: { lectures: true }
        }
      },
      orderBy: sort === 'popular' ? { lectures: { _count: 'desc' } } : { name: 'asc' }
    });
    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching topics', error: error.message });
  }
};

exports.createTopic = async (req, res) => {
  const { name } = req.body;
  try {
    const topic = await prisma.topic.create({ data: { name } });
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Error creating topic', error: error.message });
  }
};

exports.updateTopic = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const topic = await prisma.topic.update({
      where: { id: parseInt(id) },
      data: { name }
    });
    res.status(200).json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Error updating topic', error: error.message });
  }
};

exports.deleteTopic = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.topic.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: 'Topic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting topic', error: error.message });
  }
};

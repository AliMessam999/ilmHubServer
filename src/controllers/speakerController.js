const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getSpeakers = async (req, res) => {
  const { sort, limit } = req.query;
  try {
    const speakers = await prisma.speaker.findMany({
      include: {
        _count: {
          select: { lectures: true }
        }
      },
      orderBy: sort === 'popular' ? { lectures: { _count: 'desc' } } : { name: 'asc' },
      take: limit ? parseInt(limit) : undefined
    });
    res.status(200).json(speakers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching speakers', error: error.message });
  }
};

exports.getSpeaker = async (req, res) => {
  const { id } = req.params;
  try {
    const speaker = await prisma.speaker.findUnique({
      where: { id: parseInt(id) },
      include: { lectures: true }
    });
    if (!speaker) return res.status(404).json({ message: 'Speaker not found' });
    res.status(200).json(speaker);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching speaker', error: error.message });
  }
};

exports.createSpeaker = async (req, res) => {
  const { name, bio } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    const speaker = await prisma.speaker.create({
      data: { name, bio, image }
    });
    res.status(201).json(speaker);
  } catch (error) {
    res.status(500).json({ message: 'Error creating speaker', error: error.message });
  }
};

exports.updateSpeaker = async (req, res) => {
  const { id } = req.params;
  const { name, bio } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : undefined;
  try {
    const data = { name, bio };
    if (image !== undefined) data.image = image;

    const speaker = await prisma.speaker.update({
      where: { id: parseInt(id) },
      data
    });
    res.status(200).json(speaker);
  } catch (error) {
    res.status(500).json({ message: 'Error updating speaker', error: error.message });
  }
};

exports.deleteSpeaker = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.speaker.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: 'Speaker deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting speaker', error: error.message });
  }
};

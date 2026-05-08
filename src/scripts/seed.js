const mongoose = require('mongoose');
const dotenv = require('dotenv');

const User = require('../models/User');
const Speaker = require('../models/Speaker');
const Topic = require('../models/Topic');
const Lecture = require('../models/Lecture');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('🌱 Seeding database...');

    // clear old data
    await User.deleteMany();
    await Speaker.deleteMany();
    await Topic.deleteMany();
    await Lecture.deleteMany();

    // users
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@ilmhub.com',
      password: '$2a$12$testhashedpassword', // replace if needed
      role: 'admin',
    });

    const user = await User.create({
      name: 'User',
      email: 'user@ilmhub.com',
      password: '$2a$12$testhashedpassword',
      role: 'user',
    });

    // speakers
    const speaker1 = await Speaker.create({
      name: 'Dr. Speaker One',
      bio: 'Islamic scholar',
    });

    const speaker2 = await Speaker.create({
      name: 'Dr. Speaker Two',
      bio: 'Quran expert',
    });

    // topics
    const topic1 = await Topic.create({ name: 'Tafseer' });
    const topic2 = await Topic.create({ name: 'Hadith' });

    // lectures
    await Lecture.create([
      {
        title: 'Introduction to Tafseer',
        description: 'Basic Tafseer lecture',
        speakerId: speaker1._id,
        topics: [topic1._id],
        language: 'en',
      },
      {
        title: 'Hadith Fundamentals',
        description: 'Basic Hadith concepts',
        speakerId: speaker2._id,
        topics: [topic2._id],
        language: 'en',
      },
    ]);

    console.log('✅ Seeding completed successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seed();
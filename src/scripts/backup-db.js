const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const User = require('../models/User');
const Speaker = require('../models/Speaker');
const Topic = require('../models/Topic');
const Lecture = require('../models/Lecture');

dotenv.config();

const backupDir = path.join(__dirname, '../backups');

const backupDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // ensure backup folder exists
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    console.log('📦 Starting backup...');

    const users = await User.find();
    const speakers = await Speaker.find();
    const topics = await Topic.find();
    const lectures = await Lecture.find();

    const backup = {
      users,
      speakers,
      topics,
      lectures,
      createdAt: new Date(),
    };

    const filePath = path.join(
      backupDir,
      `backup-${Date.now()}.json`
    );

    fs.writeFileSync(filePath, JSON.stringify(backup, null, 2));

    console.log('✅ Backup created at:', filePath);

    process.exit();
  } catch (error) {
    console.error('❌ Backup error:', error.message);
    process.exit(1);
  }
};

backupDB();
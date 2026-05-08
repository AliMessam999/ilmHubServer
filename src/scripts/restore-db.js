const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const User = require('../models/User');
const Speaker = require('../models/Speaker');
const Topic = require('../models/Topic');
const Lecture = require('../models/Lecture');

dotenv.config();

const restoreDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const filePath = process.argv[2];

    if (!filePath) {
      console.log('❌ Please provide backup file path');
      console.log('Example: node scripts/restore-db.js backups/backup-123.json');
      process.exit(1);
    }

    const fullPath = path.resolve(filePath);

    if (!fs.existsSync(fullPath)) {
      console.log('❌ Backup file not found');
      process.exit(1);
    }

    console.log('♻️ Restoring database...');

    const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));

    // clear existing data
    await User.deleteMany();
    await Speaker.deleteMany();
    await Topic.deleteMany();
    await Lecture.deleteMany();

    // restore data
    await User.insertMany(data.users);
    await Speaker.insertMany(data.speakers);
    await Topic.insertMany(data.topics);
    await Lecture.insertMany(data.lectures);

    console.log('✅ Database restored successfully');

    process.exit();
  } catch (error) {
    console.error('❌ Restore error:', error.message);
    process.exit(1);
  }
};

restoreDB();
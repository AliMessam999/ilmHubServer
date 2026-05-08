const mongoose = require('mongoose');
const dotenv = require('dotenv');

const User = require('../models/User');
const Speaker = require('../models/Speaker');
const Topic = require('../models/Topic');
const Lecture = require('../models/Lecture');

dotenv.config();

const resetDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany();
    await Speaker.deleteMany();
    await Topic.deleteMany();
    await Lecture.deleteMany();

    console.log('🧹 Database cleared successfully');

    process.exit();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

resetDB();
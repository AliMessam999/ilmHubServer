const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = process.argv[2];

    if (!email) {
      console.log('❌ Please provide an email');
      process.exit(1);
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log(`✅ ${email} is now an admin`);

    process.exit();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

makeAdmin();
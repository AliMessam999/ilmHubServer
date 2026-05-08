const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const connectDB = require('./config/db'); // 👈 ADD THIS

dotenv.config();

// connect MongoDB FIRST
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// static uploads
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// routes
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/speakers', require('./routes/speakers.js'));
app.use('/api/topics', require('./routes/topics.js'));
app.use('/api/lectures', require('./routes/lectures.js'));

// health check
app.get('/', (req, res) => {
  res.send('IlmHub API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
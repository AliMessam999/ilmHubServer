const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/speakers', require('./routes/speakers'));
app.use('/api/topics', require('./routes/topics'));
app.use('/api/lectures', require('./routes/lectures'));

app.get('/', (req, res) => {
  res.send('IlmHub API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

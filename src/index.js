// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const path = require('path');

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// // Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/speakers', require('./routes/speakers'));
// app.use('/api/topics', require('./routes/topics'));
// app.use('/api/lectures', require('./routes/lectures'));

// app.get('/', (req, res) => {
//   res.send('IlmHub API is running...');
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });




const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const serverless = require('serverless-http');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Static files (works in Vercel too, but better move uploads to cloud later)
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/speakers', require('./routes/speakers'));
app.use('/topics', require('./routes/topics'));
app.use('/lectures', require('./routes/lectures'));

app.get('/', (req, res) => {
  res.send('IlmHub API is running...');
});

// ❌ REMOVE app.listen()

module.exports = serverless(app);
const express = require('express');
const { getTopics, createTopic, updateTopic, deleteTopic } = require('../controllers/topicController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', getTopics);
router.post('/', auth, adminOnly, createTopic);
router.put('/:id', auth, adminOnly, updateTopic);
router.delete('/:id', auth, adminOnly, deleteTopic);

module.exports = router;

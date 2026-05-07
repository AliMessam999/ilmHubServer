const express = require('express');
const { getLectures, getLecture, createLecture, updateLecture, deleteLecture } = require('../controllers/lectureController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', getLectures);
router.get('/:id', getLecture);
router.post('/', auth, adminOnly, createLecture);
router.put('/:id', auth, adminOnly, updateLecture);
router.delete('/:id', auth, adminOnly, deleteLecture);

module.exports = router;

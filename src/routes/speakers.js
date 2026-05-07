const express = require('express');
const multer = require('multer');
const path = require('path');
const { getSpeakers, getSpeaker, createSpeaker, updateSpeaker, deleteSpeaker } = require('../controllers/speakerController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/', getSpeakers);
router.get('/:id', getSpeaker);
router.post('/', auth, adminOnly, upload.single('image'), createSpeaker);
router.put('/:id', auth, adminOnly, upload.single('image'), updateSpeaker);
router.delete('/:id', auth, adminOnly, deleteSpeaker);

module.exports = router;

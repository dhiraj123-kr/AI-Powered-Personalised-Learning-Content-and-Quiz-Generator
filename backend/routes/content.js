const express = require('express');
const router = express.Router();
const {
  generateLearningContent,
  getStudentContent,
  getContentById,
  deleteContent,
} = require('../controllers/contentController');
const { protect } = require('../middleware/auth');

router.post('/generate', protect, generateLearningContent);
router.get('/', protect, getStudentContent);
router.get('/:id', protect, getContentById);
router.delete('/:id', protect, deleteContent);

module.exports = router;

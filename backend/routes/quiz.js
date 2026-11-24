const express = require('express');
const router = express.Router();
const {
  generateQuiz,
  getStudentQuizzes,
  getQuizById,
} = require('../controllers/quizController');
const { protect } = require('../middleware/auth');

router.post('/generate', protect, generateQuiz);
router.get('/', protect, getStudentQuizzes);
router.get('/:id', protect, getQuizById);

module.exports = router;

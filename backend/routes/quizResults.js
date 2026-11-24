const express = require('express');
const router = express.Router();
const {
  submitQuizResult,
  getStudentResults,
  getResultById,
} = require('../controllers/quizResultController');
const { protect } = require('../middleware/auth');

router.post('/submit', protect, submitQuizResult);
router.get('/', protect, getStudentResults);
router.get('/:id', protect, getResultById);

module.exports = router;

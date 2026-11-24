const express = require('express');
const router = express.Router();
const {
  getRecommendations,
  generateRecommendations,
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getRecommendations);
router.post('/generate', protect, generateRecommendations);

module.exports = router;

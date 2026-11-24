const express = require('express');
const router = express.Router();
const { getStudentAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getStudentAnalytics);

module.exports = router;

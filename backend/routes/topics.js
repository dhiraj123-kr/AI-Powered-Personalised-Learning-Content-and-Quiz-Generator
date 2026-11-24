const express = require('express');
const router = express.Router();
const {
  getTopicsBySubject,
  getTopic,
  createTopic,
  updateTopic,
  deleteTopic,
} = require('../controllers/topicController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminAuth');

router.get('/subject/:subjectId', getTopicsBySubject);
router.get('/:id', getTopic);
router.post('/', protect, adminOnly, createTopic);
router.put('/:id', protect, adminOnly, updateTopic);
router.delete('/:id', protect, adminOnly, deleteTopic);

module.exports = router;

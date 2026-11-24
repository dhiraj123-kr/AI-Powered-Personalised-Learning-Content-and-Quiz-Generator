const express = require('express');
const router = express.Router();
const {
  getAllSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
  seedDefaults,
} = require('../controllers/subjectController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminAuth');

router.get('/', getAllSubjects);
router.post('/seed-defaults', seedDefaults);
router.get('/:id', getSubject);
router.post('/', protect, adminOnly, createSubject);
router.put('/:id', protect, adminOnly, updateSubject);
router.delete('/:id', protect, adminOnly, deleteSubject);

module.exports = router;

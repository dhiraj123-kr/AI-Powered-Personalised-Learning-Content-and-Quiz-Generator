const express = require('express');
const router = express.Router();
const {
  getPlatformStats,
  getAllStudents,
  updateStudent,
  deleteStudent,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminAuth');

router.use(protect, adminOnly);

router.get('/stats', getPlatformStats);
router.get('/students', getAllStudents);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

module.exports = router;

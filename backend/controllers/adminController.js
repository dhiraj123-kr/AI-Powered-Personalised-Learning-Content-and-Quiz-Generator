const User = require('../models/User');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const LearningContent = require('../models/LearningContent');

// @desc    Get platform-wide statistics for Admin
// @route   GET /api/admin/stats
// @access  Private/Admin
const getPlatformStats = async (req, res) => {
  try {
    const [
      totalStudents,
      totalSubjects,
      totalTopics,
      totalQuizzesGenerated,
      totalQuizAttempts,
      totalNotesGenerated,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Subject.countDocuments(),
      Topic.countDocuments(),
      Quiz.countDocuments(),
      QuizResult.countDocuments(),
      LearningContent.countDocuments(),
      User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 }).limit(5),
    ]);

    const results = await QuizResult.find();
    const avgPlatformScore =
      results.length > 0 ? Math.round(results.reduce((acc, c) => acc + c.score, 0) / results.length) : 0;

    res.json({
      success: true,
      data: {
        totalStudents,
        totalSubjects,
        totalTopics,
        totalQuizzesGenerated,
        totalQuizAttempts,
        totalNotesGenerated,
        avgPlatformScore,
        recentUsers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private/Admin
const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });

    // Fetch quiz count for each student
    const studentData = await Promise.all(
      students.map(async (student) => {
        const attempts = await QuizResult.countDocuments({ student: student._id });
        const notes = await LearningContent.countDocuments({ student: student._id });
        return {
          ...student.toObject(),
          quizAttempts: attempts,
          notesCount: notes,
        };
      })
    );

    res.json({ success: true, count: studentData.length, data: studentData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update student (Admin)
// @route   PUT /api/admin/students/:id
// @access  Private/Admin
const updateStudent = async (req, res) => {
  try {
    const { name, email, learningLevel, role } = req.body;
    const student = await User.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    if (name) student.name = name;
    if (email) student.email = email;
    if (learningLevel) student.learningLevel = learningLevel;
    if (role) student.role = role;

    await student.save();

    res.json({ success: true, message: 'Student updated successfully', data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete student account (Admin)
// @route   DELETE /api/admin/students/:id
// @access  Private/Admin
const deleteStudent = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete admin account.' });
    }

    // Delete associated data
    await Promise.all([
      QuizResult.deleteMany({ student: user._id }),
      Quiz.deleteMany({ student: user._id }),
      LearningContent.deleteMany({ student: user._id }),
      user.deleteOne(),
    ]);

    res.json({ success: true, message: 'Student and related records deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPlatformStats,
  getAllStudents,
  updateStudent,
  deleteStudent,
};

const QuizResult = require('../models/QuizResult');
const LearningContent = require('../models/LearningContent');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');

// @desc    Get student performance analytics
// @route   GET /api/analytics
// @access  Private
const getStudentAnalytics = async (req, res) => {
  try {
    const studentId = req.user.id;

    const [quizResults, savedNotesCount] = await Promise.all([
      QuizResult.find({ student: studentId }).populate('subject').populate('topic').sort({ completedAt: 1 }),
      LearningContent.countDocuments({ student: studentId }),
    ]);

    const totalQuizzes = quizResults.length;
    let avgScore = 0;
    let totalQuestionsAttempted = 0;
    let totalCorrectAnswers = 0;
    let totalTimeSpent = 0;

    const subjectStats = {};
    const topicStats = {};

    quizResults.forEach((result) => {
      totalQuestionsAttempted += result.totalQuestions;
      totalTimeSpent += result.timeTaken || 0;

      const correctCount = result.answers ? result.answers.filter((a) => a.isCorrect).length : Math.round((result.score / 100) * result.totalQuestions);
      totalCorrectAnswers += correctCount;

      // Subject breakdown
      const subName = result.subject ? result.subject.name : 'General';
      if (!subjectStats[subName]) {
        subjectStats[subName] = { name: subName, totalScore: 0, count: 0, color: result.subject ? result.subject.color : '#7C3AED' };
      }
      subjectStats[subName].totalScore += result.score;
      subjectStats[subName].count += 1;

      // Topic breakdown
      const topName = result.topic ? result.topic.name : 'Unknown';
      if (!topicStats[topName]) {
        topicStats[topName] = { name: topName, subject: subName, totalScore: 0, count: 0 };
      }
      topicStats[topName].totalScore += result.score;
      topicStats[topName].count += 1;
    });

    if (totalQuizzes > 0) {
      const sum = quizResults.reduce((acc, curr) => acc + curr.score, 0);
      avgScore = Math.round(sum / totalQuizzes);
    }

    // Format subject performance
    const subjectWise = Object.values(subjectStats).map((s) => ({
      subject: s.name,
      averageScore: Math.round(s.totalScore / s.count),
      attempts: s.count,
      color: s.color,
    }));

    // Weak & strong topics
    const topicList = Object.values(topicStats).map((t) => ({
      topic: t.name,
      subject: t.subject,
      averageScore: Math.round(t.totalScore / t.count),
      attempts: t.count,
    }));

    const weakTopics = topicList.filter((t) => t.averageScore < 70).sort((a, b) => a.averageScore - b.averageScore);
    const strongTopics = topicList.filter((t) => t.averageScore >= 70).sort((a, b) => b.averageScore - a.averageScore);

    // Progress timeline (last 10 quizzes)
    const timeline = quizResults.slice(-10).map((r, idx) => ({
      attempt: idx + 1,
      date: new Date(r.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      score: r.score,
      topic: r.topic ? r.topic.name : 'Quiz',
      subject: r.subject ? r.subject.name : '',
    }));

    res.json({
      success: true,
      data: {
        overview: {
          totalQuizzes,
          avgScore,
          totalQuestionsAttempted,
          totalCorrectAnswers,
          totalIncorrectAnswers: totalQuestionsAttempted - totalCorrectAnswers,
          accuracyRate: totalQuestionsAttempted > 0 ? Math.round((totalCorrectAnswers / totalQuestionsAttempted) * 100) : 0,
          totalTimeSpentSeconds: totalTimeSpent,
          savedNotesCount,
        },
        subjectWise,
        timeline,
        weakTopics: weakTopics.slice(0, 5),
        strongTopics: strongTopics.slice(0, 5),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getStudentAnalytics,
};

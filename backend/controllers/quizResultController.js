const QuizResult = require('../models/QuizResult');
const Quiz = require('../models/Quiz');
const Recommendation = require('../models/Recommendation');
const { generateJSON } = require('../utils/gemini');
const { buildRecommendationPrompt } = require('../utils/helpers');

// @desc    Submit quiz answers and evaluate
// @route   POST /api/quiz-results/submit
// @access  Private
const submitQuizResult = async (req, res) => {
  try {
    const { quizId, answers, timeTaken } = req.body;

    if (!quizId || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Quiz ID and answers array are required.' });
    }

    const quiz = await Quiz.findById(quizId).populate('subject').populate('topic');
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Evaluate answers
    let correctCount = 0;
    const evaluatedAnswers = quiz.questions.map((q, idx) => {
      const studentAnswer = answers.find((a) => a.questionIndex === idx);
      const selected = studentAnswer ? studentAnswer.selectedAnswer : -1;
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) correctCount++;

      return {
        questionIndex: idx,
        selectedAnswer: selected,
        isCorrect,
      };
    });

    const scorePercentage = Math.round((correctCount / quiz.questions.length) * 100);

    const quizResult = await QuizResult.create({
      student: req.user.id,
      quiz: quiz._id,
      subject: quiz.subject._id,
      topic: quiz.topic._id,
      answers: evaluatedAnswers,
      score: scorePercentage,
      totalQuestions: quiz.questions.length,
      timeTaken: timeTaken || 0,
    });

    // Auto update recommendations in background
    triggerRecommendationUpdate(req.user, quiz, scorePercentage).catch((err) =>
      console.warn('Background recommendation update warning:', err.message)
    );

    res.status(201).json({
      success: true,
      message: 'Quiz evaluated successfully',
      data: {
        resultId: quizResult._id,
        score: scorePercentage,
        correctCount,
        totalQuestions: quiz.questions.length,
        answers: evaluatedAnswers,
        quiz,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Background helper to refresh recommendations after quiz
async function triggerRecommendationUpdate(user, quiz, score) {
  try {
    let recDoc = await Recommendation.findOne({ student: user._id });
    if (!recDoc) {
      recDoc = new Recommendation({ student: user._id, recommendations: [] });
    }

    let priority = 'low';
    let type = 'practice';
    let reason = `Great job scoring ${score}%! Practice next level topics to deepen mastery.`;

    if (score < 60) {
      priority = 'high';
      type = 'study';
      reason = `Scored ${score}% in ${quiz.topic.name}. Review foundational notes and key concepts before attempting again.`;
    } else if (score < 80) {
      priority = 'medium';
      type = 'review';
      reason = `Scored ${score}% in ${quiz.topic.name}. Focus on missed questions and revision flashcards.`;
    }

    // Upsert or prepend topic recommendation
    const existingIndex = recDoc.recommendations.findIndex(
      (r) => r.topic && r.topic.toString() === quiz.topic._id.toString()
    );

    const newRecItem = {
      subject: quiz.subject._id,
      topic: quiz.topic._id,
      reason,
      priority,
      type,
    };

    if (existingIndex >= 0) {
      recDoc.recommendations[existingIndex] = newRecItem;
    } else {
      recDoc.recommendations.unshift(newRecItem);
    }

    // Keep top 6 recommendations
    recDoc.recommendations = recDoc.recommendations.slice(0, 6);
    recDoc.updatedAt = Date.now();
    await recDoc.save();
  } catch (e) {
    console.warn('Recommendation trigger error:', e.message);
  }
}

// @desc    Get all quiz results for student
// @route   GET /api/quiz-results
// @access  Private
const getStudentResults = async (req, res) => {
  try {
    const results = await QuizResult.find({ student: req.user.id })
      .populate('subject', 'name icon color')
      .populate('topic', 'name difficulty')
      .populate('quiz')
      .sort({ completedAt: -1 });

    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single quiz result by ID
// @route   GET /api/quiz-results/:id
// @access  Private
const getResultById = async (req, res) => {
  try {
    const result = await QuizResult.findOne({ _id: req.params.id, student: req.user.id })
      .populate('subject')
      .populate('topic')
      .populate('quiz');

    if (!result) {
      return res.status(404).json({ success: false, message: 'Quiz result not found' });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  submitQuizResult,
  getStudentResults,
  getResultById,
};

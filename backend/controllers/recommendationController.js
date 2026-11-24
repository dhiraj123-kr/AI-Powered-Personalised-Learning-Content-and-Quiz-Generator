const Recommendation = require('../models/Recommendation');
const QuizResult = require('../models/QuizResult');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const { generateJSON } = require('../utils/gemini');
const { buildRecommendationPrompt } = require('../utils/helpers');

// @desc    Get recommendations for student
// @route   GET /api/recommendations
// @access  Private
const getRecommendations = async (req, res) => {
  try {
    let recDoc = await Recommendation.findOne({ student: req.user.id })
      .populate('recommendations.subject', 'name icon color')
      .populate('recommendations.topic', 'name difficulty');

    if (!recDoc || recDoc.recommendations.length === 0) {
      // Generate default intelligent recommendations
      const subjects = await Subject.find({ isActive: true }).populate('topics').limit(3);
      const defaultRecs = [];

      subjects.forEach((s) => {
        if (s.topics && s.topics.length > 0) {
          defaultRecs.push({
            subject: s._id,
            topic: s.topics[0]._id,
            reason: `Start exploring foundational concepts in ${s.name} to establish core mastery.`,
            priority: 'high',
            type: 'study',
          });
        }
      });

      if (!recDoc) {
        recDoc = await Recommendation.create({
          student: req.user.id,
          recommendations: defaultRecs,
        });
      } else {
        recDoc.recommendations = defaultRecs;
        await recDoc.save();
      }

      recDoc = await Recommendation.findById(recDoc._id)
        .populate('recommendations.subject', 'name icon color')
        .populate('recommendations.topic', 'name difficulty');
    }

    res.json({ success: true, data: recDoc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Regenerate recommendations using Gemini AI
// @route   POST /api/recommendations/generate
// @access  Private
const generateRecommendations = async (req, res) => {
  try {
    const student = req.user;
    const [recentResults, subjects] = await Promise.all([
      QuizResult.find({ student: student.id }).populate('subject').populate('topic').sort({ completedAt: -1 }).limit(10),
      Subject.find({ isActive: true }).populate('topics'),
    ]);

    const simplifiedResults = recentResults.map((r) => ({
      subject: r.subject ? r.subject.name : '',
      topic: r.topic ? r.topic.name : '',
      score: r.score,
    }));

    const simplifiedSubjects = subjects.map((s) => ({
      name: s.name,
      topics: s.topics ? s.topics.map((t) => t.name) : [],
    }));

    const prompt = buildRecommendationPrompt({
      studentName: student.name,
      learningLevel: student.learningLevel,
      quizHistory: simplifiedResults,
      subjects: simplifiedSubjects,
    });

    const aiResponse = await generateJSON(prompt);

    const mappedRecs = [];
    if (aiResponse && Array.isArray(aiResponse.recommendations)) {
      for (const item of aiResponse.recommendations) {
        // Try finding matching subject and topic
        let matchedSubject = subjects.find(
          (s) => s.name.toLowerCase() === (item.subjectName || '').toLowerCase()
        );
        if (!matchedSubject && subjects.length > 0) matchedSubject = subjects[0];

        let matchedTopic = null;
        if (matchedSubject && matchedSubject.topics) {
          matchedTopic = matchedSubject.topics.find(
            (t) => t.name.toLowerCase() === (item.topicName || '').toLowerCase()
          );
          if (!matchedTopic && matchedSubject.topics.length > 0) matchedTopic = matchedSubject.topics[0];
        }

        if (matchedSubject && matchedTopic) {
          mappedRecs.push({
            subject: matchedSubject._id,
            topic: matchedTopic._id,
            reason: item.reason || 'Recommended based on learning profile',
            priority: ['high', 'medium', 'low'].includes(item.priority) ? item.priority : 'medium',
            type: ['study', 'practice', 'review', 'challenge'].includes(item.type) ? item.type : 'study',
          });
        }
      }
    }

    let recDoc = await Recommendation.findOne({ student: student.id });
    if (!recDoc) {
      recDoc = new Recommendation({ student: student.id });
    }

    if (mappedRecs.length > 0) {
      recDoc.recommendations = mappedRecs;
    }
    recDoc.updatedAt = Date.now();
    await recDoc.save();

    const populatedDoc = await Recommendation.findById(recDoc._id)
      .populate('recommendations.subject', 'name icon color')
      .populate('recommendations.topic', 'name difficulty');

    res.json({
      success: true,
      message: 'Recommendations generated successfully',
      data: populatedDoc,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRecommendations,
  generateRecommendations,
};

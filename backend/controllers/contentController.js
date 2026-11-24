const LearningContent = require('../models/LearningContent');
const Topic = require('../models/Topic');
const Subject = require('../models/Subject');
const { generateContent } = require('../utils/gemini');
const { buildContentPrompt } = require('../utils/helpers');

// @desc    Generate personalized AI learning content
// @route   POST /api/content/generate
// @access  Private
const generateLearningContent = async (req, res) => {
  try {
    const { topicId, subjectId, contentType, difficulty, language } = req.body;

    if (!topicId || !subjectId) {
      return res.status(400).json({ success: false, message: 'Topic and Subject are required.' });
    }

    const [topic, subject] = await Promise.all([
      Topic.findById(topicId),
      Subject.findById(subjectId),
    ]);

    if (!topic || !subject) {
      return res.status(404).json({ success: false, message: 'Topic or Subject not found' });
    }

    const userDifficulty = difficulty || req.user.learningLevel || 'intermediate';
    const type = contentType || 'notes';

    const prompt = buildContentPrompt({
      topic: topic.name,
      subject: subject.name,
      contentType: type,
      difficulty: userDifficulty,
      language: language || 'English',
    });

    const aiContent = await generateContent(prompt);

    const savedContent = await LearningContent.create({
      student: req.user.id,
      topic: topicId,
      subject: subjectId,
      contentType: type,
      difficulty: userDifficulty,
      language: language || 'English',
      content: aiContent,
    });

    res.status(201).json({
      success: true,
      message: 'Learning content generated successfully',
      data: savedContent,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all saved content for the logged in student
// @route   GET /api/content
// @access  Private
const getStudentContent = async (req, res) => {
  try {
    const content = await LearningContent.find({ student: req.user.id })
      .populate('topic', 'name difficulty')
      .populate('subject', 'name icon color')
      .sort({ generatedAt: -1 });

    res.json({ success: true, count: content.length, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single learning content item
// @route   GET /api/content/:id
// @access  Private
const getContentById = async (req, res) => {
  try {
    const content = await LearningContent.findOne({ _id: req.params.id, student: req.user.id })
      .populate('topic')
      .populate('subject');

    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete saved content item
// @route   DELETE /api/content/:id
// @access  Private
const deleteContent = async (req, res) => {
  try {
    const content = await LearningContent.findOneAndDelete({ _id: req.params.id, student: req.user.id });
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }
    res.json({ success: true, message: 'Content deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  generateLearningContent,
  getStudentContent,
  getContentById,
  deleteContent,
};

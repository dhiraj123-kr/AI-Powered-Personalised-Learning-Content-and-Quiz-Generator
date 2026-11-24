const Topic = require('../models/Topic');
const Subject = require('../models/Subject');

// @desc    Get topics by subject ID
// @route   GET /api/topics/subject/:subjectId
// @access  Public / Private
const getTopicsBySubject = async (req, res) => {
  try {
    const topics = await Topic.find({ subject: req.params.subjectId, isActive: true });
    res.json({ success: true, count: topics.length, data: topics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single topic
// @route   GET /api/topics/:id
// @access  Public / Private
const getTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id).populate('subject');
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }
    res.json({ success: true, data: topic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create topic (Admin only)
// @route   POST /api/topics
// @access  Private/Admin
const createTopic = async (req, res) => {
  try {
    const { name, description, subject, difficulty, tags, estimatedTime } = req.body;

    const subjectDoc = await Subject.findById(subject);
    if (!subjectDoc) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    const topic = await Topic.create({
      name,
      description,
      subject,
      difficulty: difficulty || 'beginner',
      tags: tags || [],
      estimatedTime: estimatedTime || 30,
    });

    subjectDoc.topics.push(topic._id);
    await subjectDoc.save();

    res.status(201).json({ success: true, message: 'Topic created', data: topic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update topic (Admin only)
// @route   PUT /api/topics/:id
// @access  Private/Admin
const updateTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }
    res.json({ success: true, message: 'Topic updated', data: topic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete topic (Admin only)
// @route   DELETE /api/topics/:id
// @access  Private/Admin
const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    // Remove from subject's topics array
    await Subject.findByIdAndUpdate(topic.subject, { $pull: { topics: topic._id } });
    await topic.deleteOne();

    res.json({ success: true, message: 'Topic deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTopicsBySubject,
  getTopic,
  createTopic,
  updateTopic,
  deleteTopic,
};

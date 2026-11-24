const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const { defaultSubjects } = require('../utils/defaultData');

// Helper to auto-seed default subjects and topics if collection is empty
const seedDefaultCurriculum = async () => {
  console.log('🌱 Auto-seeding default subjects and topics...');
  for (const sub of defaultSubjects) {
    const existing = await Subject.findOne({ name: sub.name });
    if (existing) continue;

    const createdSubject = await Subject.create({
      name: sub.name,
      description: sub.description,
      icon: sub.icon,
      color: sub.color,
      difficulty: sub.difficulty,
    });

    const topicIds = [];
    for (const top of sub.topics) {
      const createdTopic = await Topic.create({
        ...top,
        subject: createdSubject._id,
      });
      topicIds.push(createdTopic._id);
    }

    createdSubject.topics = topicIds;
    await createdSubject.save();
  }
  console.log('✅ Default curriculum seeded successfully.');
};

// @desc    Get all subjects (auto-seeds if empty)
// @route   GET /api/subjects
// @access  Public / Private
const getAllSubjects = async (req, res) => {
  try {
    let subjects = await Subject.find({ isActive: true }).populate('topics');

    // Auto-seed if empty
    if (!subjects || subjects.length === 0) {
      await seedDefaultCurriculum();
      subjects = await Subject.find({ isActive: true }).populate('topics');
    }

    res.json({ success: true, count: subjects.length, data: subjects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Seed default subjects on demand
// @route   POST /api/subjects/seed-defaults
// @access  Public / Private
const seedDefaults = async (req, res) => {
  try {
    await seedDefaultCurriculum();
    const subjects = await Subject.find({ isActive: true }).populate('topics');
    res.json({ success: true, message: 'Default subjects and topics seeded successfully', data: subjects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single subject
// @route   GET /api/subjects/:id
// @access  Public / Private
const getSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate('topics');
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }
    res.json({ success: true, data: subject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create subject (Admin only)
// @route   POST /api/subjects
// @access  Private/Admin
const createSubject = async (req, res) => {
  try {
    const { name, description, icon, color, difficulty } = req.body;
    const subject = await Subject.create({
      name,
      description,
      icon: icon || 'BookOpen',
      color: color || '#7C3AED',
      difficulty: difficulty || 'all',
      createdBy: req.user?.id,
    });
    res.status(201).json({ success: true, message: 'Subject created', data: subject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update subject (Admin only)
// @route   PUT /api/subjects/:id
// @access  Private/Admin
const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }
    res.json({ success: true, message: 'Subject updated', data: subject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete subject (Admin only)
// @route   DELETE /api/subjects/:id
// @access  Private/Admin
const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    // Delete associated topics
    await Topic.deleteMany({ subject: req.params.id });
    await subject.deleteOne();

    res.json({ success: true, message: 'Subject and its topics deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
  seedDefaults,
  seedDefaultCurriculum,
};

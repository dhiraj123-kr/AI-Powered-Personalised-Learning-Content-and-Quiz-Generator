const mongoose = require('mongoose');

const learningContentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required'],
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: [true, 'Topic reference is required'],
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject reference is required'],
    },
    contentType: {
      type: String,
      enum: ['notes', 'summary', 'explanation', 'examples', 'exam_questions', 'revision'],
      required: [true, 'Content type is required'],
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    language: {
      type: String,
      default: 'English',
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

learningContentSchema.index({ student: 1, topic: 1, contentType: 1 });

module.exports = mongoose.model('LearningContent', learningContentSchema);

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: {
      type: [String],
      validate: {
        validator: (v) => v.length === 4,
        message: 'Each question must have exactly 4 options',
      },
      required: true,
    },
    correctAnswer: {
      type: Number,
      min: 0,
      max: 3,
      required: true,
    },
    explanation: { type: String, default: '' },
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required'],
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject reference is required'],
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: [true, 'Topic reference is required'],
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    numQuestions: {
      type: Number,
      default: 10,
    },
    questions: [questionSchema],
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

quizSchema.index({ student: 1, generatedAt: -1 });

module.exports = mongoose.model('Quiz', quizSchema);

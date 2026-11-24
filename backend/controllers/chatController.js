const ChatHistory = require('../models/ChatHistory');
const { generateContent } = require('../utils/gemini');

// @desc    Send message to AI Educational Study Assistant
// @route   POST /api/chat/send
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { message, chatId } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message content is required.' });
    }

    let chat;
    if (chatId) {
      chat = await ChatHistory.findOne({ _id: chatId, student: req.user.id });
    }

    if (!chat) {
      chat = new ChatHistory({
        student: req.user.id,
        title: message.substring(0, 30) + '...',
        messages: [],
      });
    }

    // Build conversation context
    const historySnippet = chat.messages
      .slice(-6)
      .map((m) => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`)
      .join('\n');

    const prompt = `You are an expert, encouraging, and pedagogically sound AI Educational Study Assistant for a university student.
Your role is to explain technical and academic concepts clearly, provide step-by-step guidance, offer analogies, and write clean code examples where appropriate.

Student's Learning Level: ${req.user.learningLevel || 'intermediate'}

Recent Conversation Context:
${historySnippet || 'None'}

Student's Latest Question:
${message}

Instructions:
- Provide clear, friendly, and structured explanations using Markdown.
- Break down complex points step by step.
- Include practical code or mathematical demonstrations if helpful.
- Suggest a follow-up practice question or concept at the end.`;

    const aiReply = await generateContent(prompt);

    // Save user message and AI response
    chat.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    chat.messages.push({
      role: 'model',
      content: aiReply,
      timestamp: new Date(),
    });

    await chat.save();

    res.json({
      success: true,
      data: {
        chatId: chat._id,
        title: chat.title,
        reply: aiReply,
        messages: chat.messages,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's chat conversations
// @route   GET /api/chat/history
// @access  Private
const getChatHistory = async (req, res) => {
  try {
    const chats = await ChatHistory.find({ student: req.user.id })
      .select('title createdAt updatedAt')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: chats.length, data: chats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single chat conversation messages
// @route   GET /api/chat/:id
// @access  Private
const getChatById = async (req, res) => {
  try {
    const chat = await ChatHistory.findOne({ _id: req.params.id, student: req.user.id });
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat conversation not found' });
    }
    res.json({ success: true, data: chat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete chat conversation
// @route   DELETE /api/chat/:id
// @access  Private
const deleteChat = async (req, res) => {
  try {
    const chat = await ChatHistory.findOneAndDelete({ _id: req.params.id, student: req.user.id });
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat conversation not found' });
    }
    res.json({ success: true, message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  getChatById,
  deleteChat,
};

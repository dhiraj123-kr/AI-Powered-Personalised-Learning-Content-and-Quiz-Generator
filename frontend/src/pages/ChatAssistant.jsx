import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Trash2, Sparkles, Loader2, MessageSquarePlus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import { chatAPI } from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'model',
      content: "Hello! I am your **AI Educational Study Assistant**. Ask me anything about Data Structures, Operating Systems, Computer Networks, DBMS, or any engineering topic. I can explain code, debug algorithms, or give you exam tips!",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [historyList, setHistoryList] = useState([]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await chatAPI.getHistory();
        if (res.data.success) {
          setHistoryList(res.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMsgText = inputMessage;
    setInputMessage('');

    // Append student message
    const updatedMsgs = [
      ...messages,
      { role: 'user', content: userMsgText, timestamp: new Date() },
    ];
    setMessages(updatedMsgs);
    setIsLoading(true);

    try {
      const res = await chatAPI.send({ message: userMsgText, chatId });
      if (res.data.success) {
        setChatId(res.data.data.chatId);
        setMessages(res.data.data.messages);
      }
    } catch (err) {
      toast.error('Failed to get answer. Please retry.');
      setMessages([
        ...updatedMsgs,
        {
          role: 'model',
          content: 'Sorry, I encountered a temporary connection issue. Please check your Gemini API key and try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistory = async (id) => {
    try {
      const res = await chatAPI.getOne(id);
      if (res.data.success) {
        setChatId(res.data.data._id);
        setMessages(res.data.data.messages);
      }
    } catch (err) {
      toast.error('Failed to load chat');
    }
  };

  const handleNewChat = () => {
    setChatId(null);
    setMessages([
      {
        role: 'model',
        content: "New chat started! What subject or topic would you like to explore today?",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Study Assistant</h1>
          <p className="text-xs text-gray-500 mt-1">
            24/7 Academic Tutor powered by Google Gemini 1.5 Flash.
          </p>
        </div>

        <Button variant="secondary" size="sm" onClick={handleNewChat} leftIcon={<MessageSquarePlus className="w-4 h-4" />}>
          New Session
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-230px)] min-h-[500px]">
        {/* Past Sessions Sidebar */}
        <Card className="hidden lg:flex flex-col p-4 overflow-hidden">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 px-1">
            Conversations ({historyList.length})
          </h3>
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {historyList.map((chat) => (
              <button
                key={chat._id}
                onClick={() => handleSelectHistory(chat._id)}
                className={`w-full text-left p-2.5 rounded-xl text-xs transition truncate ${
                  chatId === chat._id
                    ? 'bg-purple-50 text-purple-700 font-bold border border-purple-100'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {chat.title || 'Untitled Session'}
              </button>
            ))}
          </div>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-3 flex flex-col p-0 overflow-hidden shadow-sm">
          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-gray-50/30">
            {messages.map((m, idx) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={idx}
                  className={`flex gap-3.5 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isUser ? 'bg-purple-600 text-white' : 'bg-gradient-to-tr from-purple-700 to-indigo-700 text-white'
                  }`}>
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-purple-600 text-white rounded-tr-none'
                      : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none prose prose-purple max-w-none'
                  }`}>
                    {isUser ? m.content : <ReactMarkdown>{m.content}</ReactMarkdown>}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3.5 max-w-xl">
                <div className="w-8 h-8 rounded-xl bg-purple-700 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-100 text-gray-500 rounded-tl-none flex items-center gap-2 text-xs">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                  AI Tutor is typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-4 bg-white border-t border-gray-100">
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about an algorithm, syntax, concept, or exam tip..."
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
              <Button type="submit" isLoading={isLoading} disabled={!inputMessage.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

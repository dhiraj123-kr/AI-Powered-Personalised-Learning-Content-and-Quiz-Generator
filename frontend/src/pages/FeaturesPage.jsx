import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Check, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function FeaturesPage() {
  const modules = [
    {
      title: 'Authentication & Role Management',
      items: [
        'Secure registration with learning level selection (Beginner, Intermediate, Advanced)',
        'BCrypt password hashing with 12 salt rounds',
        'Stateless JWT authentication with protected routes',
        'Role-Based Access Control (Student vs. Administrator)',
      ],
    },
    {
      title: 'AI Personalized Notes Generator',
      items: [
        'Choice of 6 pedagogical formats: Full Notes, 5-Min Summary, Simple Explanation, Practical Examples, Exam Questions, Revision Cards',
        'Multi-language learning support with difficulty tuning',
        'Markdown rendering with instant Copy to Clipboard and Text Download options',
        'Saved notes history with MongoDB persistence',
      ],
    },
    {
      title: 'AI MCQ Quiz Engine',
      items: [
        'Dynamic question synthesis using Google Gemini',
        'Flexible question counts: 5, 10, 15, or 20 questions',
        'Integrated countdown timer per quiz session',
        'Comprehensive feedback detailing why each answer is correct',
      ],
    },
    {
      title: 'Performance Analytics & Remediation',
      items: [
        'Interactive Recharts visualizations: Subject scores, timeline progress, and accuracy rates',
        'Automatic identification of Weak Topics (< 70%) and Strong Topics (≥ 70%)',
        'Intelligent recommendation engine suggesting next steps based on quiz errors',
        'AI Study Assistant chatbot for answering follow-up queries',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-purple-600">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-bold text-gray-900 text-sm">LearnAI Studio</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Platform Features</h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
            A comprehensive breakdown of all modules implemented in the educational system.
          </p>
        </div>

        <div className="space-y-6">
          {modules.map((m, idx) => (
            <Card key={idx} className="p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">{m.title}</h2>
              <ul className="space-y-3">
                {m.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/register">
            <Button size="lg">Get Started Free</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

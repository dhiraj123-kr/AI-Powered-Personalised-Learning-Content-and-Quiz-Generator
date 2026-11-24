import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Code2, Sparkles, BookOpen, Layers } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
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
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">About This Project</h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
            A comprehensive B.Tech Computer Science capstone application designed to bridge the gap between static textbooks and active, personalized learning.
          </p>
        </div>

        <div className="space-y-6">
          <Card className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Project Objective
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Traditional education often follows a one-size-fits-all curriculum. Students learn at different speeds, struggle with distinct subtopics, and retain knowledge through varied pedagogical styles (practical examples, concise flashcards, or deep conceptual notes).
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              This system leverages <strong>Google Gemini API</strong> with strict prompt templates and structured JSON responses to evaluate student knowledge, dynamically generate tailored multiple-choice tests, and supply targeted remedial material.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Architecture & Technology Stack
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="font-bold text-gray-800 block mb-1">Frontend Layer</span>
                <span className="text-gray-500">React.js 18, Vite, Tailwind CSS, Recharts for analytics, Lucide React icons, and React Router DOM.</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="font-bold text-gray-800 block mb-1">Backend Layer</span>
                <span className="text-gray-500">Node.js, Express.js REST API, Helmet security headers, rate limiting, and JWT authentication with bcryptjs.</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="font-bold text-gray-800 block mb-1">Database Layer</span>
                <span className="text-gray-500">MongoDB with Mongoose ODM modeling users, subjects, topics, quiz attempts, and learning artifacts.</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="font-bold text-gray-800 block mb-1">AI Integration</span>
                <span className="text-gray-500">Google Generative AI SDK (Gemini 1.5 Flash) orchestrating structured JSON outputs and markdown guides.</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-10 text-center">
          <Link to="/register">
            <Button size="lg">Explore the Platform</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

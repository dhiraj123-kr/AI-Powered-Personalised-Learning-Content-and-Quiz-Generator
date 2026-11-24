import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Brain,
  BarChart3,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Target,
  Zap,
  Award,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function LandingPage() {
  const features = [
    {
      icon: Sparkles,
      title: 'AI Personalized Notes',
      desc: 'Generate comprehensive notes, simple analogies, high-yield summaries, and revision guides tailored to your exact academic level.',
      color: 'text-purple-600 bg-purple-50',
    },
    {
      icon: Brain,
      title: 'Adaptive MCQ Quizzes',
      desc: 'Automatic question generation with customizable count (5–20 questions), difficulty scaling, countdown timer, and in-depth explanations.',
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      icon: BarChart3,
      title: 'Deep Performance Analytics',
      desc: 'Identify weak areas and track mastery milestones with interactive charts, score breakdowns, and topic-wise progress tracking.',
      color: 'text-blue-600 bg-blue-50',
    },
    {
      icon: Target,
      title: 'Tailored Learning Paths',
      desc: 'AI recommends what to study next based on your real quiz errors, preventing knowledge gaps before upcoming exams.',
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      icon: MessageSquare,
      title: '24/7 AI Study Assistant',
      desc: 'Ask complex technical doubts and get step-by-step conceptual walkthroughs, code solutions, and viva questions instantly.',
      color: 'text-amber-600 bg-amber-50',
    },
    {
      icon: Award,
      title: 'Academic Grade Standards',
      desc: 'Curated curriculum covering DSA, DBMS, Operating Systems, Computer Networks, AI/ML, and Software Engineering.',
      color: 'text-rose-600 bg-rose-50',
    },
  ];

  const steps = [
    { num: '01', title: 'Choose Subject & Topic', desc: 'Select from comprehensive B.Tech CS subjects and set your desired difficulty level.' },
    { num: '02', title: 'Learn with AI Materials', desc: 'Read AI-generated notes, real-life examples, and high-frequency exam questions.' },
    { num: '03', title: 'Test, Track & Improve', desc: 'Take adaptive quizzes, evaluate mistakes with AI explanations, and follow your custom roadmap.' },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
              LearnAI Studio
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link to="/" className="text-purple-600 font-semibold">Home</Link>
            <Link to="/features" className="hover:text-purple-600 transition">Features</Link>
            <Link to="/about" className="hover:text-purple-600 transition">About</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-32 bg-gradient-to-b from-purple-50/50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100/70 border border-purple-200 text-purple-700 text-xs font-semibold uppercase tracking-wider mb-8">
            <Sparkles className="w-4 h-4 text-purple-600" />
            Powered by Google Gemini 1.5 Flash
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 max-w-4xl mx-auto leading-tight mb-6">
            Master Technical Subjects with <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Personalized AI Study & Quizzes
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Generate custom revision notes, interactive timed quizzes, and dynamic learning roadmaps that adapt strictly to your pace and exam goals.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Start Learning Now
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base">
                Explore Demo Account
              </Button>
            </Link>
          </div>

          {/* Highlights row */}
          <div className="mt-16 pt-12 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
            <div>
              <p className="text-3xl font-extrabold text-purple-600">6+</p>
              <p className="text-xs font-medium text-gray-500 mt-1">Core CS Subjects</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-indigo-600">100%</p>
              <p className="text-xs font-medium text-gray-500 mt-1">AI Generated Notes</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-blue-600">Dynamic</p>
              <p className="text-xs font-medium text-gray-500 mt-1">Adaptive Quizzes</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-emerald-600">Real-time</p>
              <p className="text-xs font-medium text-gray-500 mt-1">Performance Feedback</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-2">Features</h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Everything You Need for Academic Excellence
            </h3>
            <p className="text-gray-500 text-sm sm:text-base mt-3">
              Built specifically for university computer science and engineering coursework.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <Card key={i} hover className="p-8">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${f.color}`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-2">How It Works</h2>
            <h3 className="text-3xl font-bold text-gray-900">Three Simple Steps to Higher Scores</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative p-6 rounded-2xl bg-purple-50/40 border border-purple-100">
                <span className="text-4xl font-black text-purple-200 mb-4 block">{s.num}</span>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h4>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-16 bg-gradient-to-r from-purple-700 to-indigo-800 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to accelerate your learning?</h2>
          <p className="text-purple-100 max-w-xl mx-auto mb-8 text-sm sm:text-base">
            Join students using AI to generate high-yield notes and test their mastery today.
          </p>
          <Link to="/register">
            <Button size="lg" variant="white">
              Get Started Now — It's Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400 text-xs text-center border-t border-gray-800">
        <p>© 2024 AI-Powered Personalised Learning Platform. B.Tech Computer Science Project.</p>
      </footer>
    </div>
  );
}

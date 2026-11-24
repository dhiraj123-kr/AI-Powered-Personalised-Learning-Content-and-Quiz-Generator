import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  HelpCircle,
  BarChart3,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Award,
  Zap,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { analyticsAPI, recommendationAPI, subjectAPI } from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [analyticsRes, recsRes, subjectsRes] = await Promise.allSettled([
          analyticsAPI.get(),
          recommendationAPI.get(),
          subjectAPI.getAll(),
        ]);

        if (analyticsRes.status === 'fulfilled' && analyticsRes.value.data.success) {
          setStats(analyticsRes.value.data.data.overview);
        }
        if (recsRes.status === 'fulfilled' && recsRes.value.data.success) {
          setRecommendations(recsRes.value.data.data.recommendations || []);
        }
        if (subjectsRes.status === 'fulfilled' && subjectsRes.value.data.success) {
          setSubjects(subjectsRes.value.data.data.slice(0, 4));
        }
      } catch (e) {
        console.error('Error fetching dashboard data:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner text="Loading your dashboard..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 p-8 sm:p-10 text-white shadow-xl shadow-purple-200/40 mb-8">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Adaptive Learning Active
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold mb-3">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-purple-100 text-sm sm:text-base leading-relaxed mb-6">
            You're currently studying at the <strong className="capitalize underline">{user?.learningLevel || 'intermediate'}</strong> level. Continue your revision or test your knowledge with a targeted AI quiz.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/content">
              <Button size="md" variant="white">
                Generate Notes
              </Button>
            </Link>
            <Link to="/quiz">
              <Button size="md" variant="dark">
                Start a Quiz
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-80 h-80 rounded-full bg-white/5 pointer-events-none blur-2xl" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Quizzes Taken"
          value={stats?.totalQuizzes || 0}
          icon={HelpCircle}
          color="purple"
          subtext="Total completed"
        />
        <StatCard
          title="Average Score"
          value={`${stats?.avgScore || 0}%`}
          icon={Award}
          color="emerald"
          subtext="Across all subjects"
        />
        <StatCard
          title="Accuracy Rate"
          value={`${stats?.accuracyRate || 0}%`}
          icon={TrendingUp}
          color="blue"
          subtext="Overall accuracy"
        />
        <StatCard
          title="Notes Saved"
          value={stats?.savedNotesCount || 0}
          icon={BookOpen}
          color="amber"
          subtext="In your library"
        />
      </div>

      {/* Main Grid: Recommended Actions & Recent Subjects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Recommended Learning Path */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold text-gray-900">Recommended Next Steps</h2>
            </div>
            <Link to="/recommendations" className="text-xs font-semibold text-purple-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {recommendations.length > 0 ? (
              recommendations.slice(0, 3).map((rec, i) => (
                <Card key={i} hover className="p-5 flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-gray-900">{rec.topic?.name || 'Topic Review'}</span>
                        <Badge variant={rec.priority}>{rec.priority} priority</Badge>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-1">{rec.reason}</p>
                    </div>
                  </div>
                  <Link to="/content">
                    <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Study
                    </Button>
                  </Link>
                </Card>
              ))
            ) : (
              <Card className="p-6 text-center text-sm text-gray-500">
                Take your first quiz to generate personalized learning recommendations!
              </Card>
            )}
          </div>
        </div>

        {/* Quick Tools Panel */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-gray-900">AI Quick Tools</h2>
          <Card className="p-5 space-y-3">
            <Link
              to="/content"
              className="flex items-center justify-between p-3 rounded-xl hover:bg-purple-50/70 border border-transparent hover:border-purple-100 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">Generate Notes</h4>
                  <p className="text-xs text-gray-400">Notes, summaries, examples</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              to="/quiz"
              className="flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50/70 border border-transparent hover:border-indigo-100 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">Create AI Quiz</h4>
                  <p className="text-xs text-gray-400">Timed adaptive MCQs</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              to="/chat"
              className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50/70 border border-transparent hover:border-blue-100 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">AI Study Tutor</h4>
                  <p className="text-xs text-gray-400">Ask doubts 24/7</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

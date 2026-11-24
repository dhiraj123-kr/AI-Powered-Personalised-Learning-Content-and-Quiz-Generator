import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3, TrendingUp, CheckCircle, AlertTriangle, Clock, Award } from 'lucide-react';
import { analyticsAPI } from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await analyticsAPI.get();
        if (res.data.success) {
          setAnalytics(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner text="Crunching your performance statistics..." />
      </DashboardLayout>
    );
  }

  const { overview, subjectWise = [], timeline = [], weakTopics = [], strongTopics = [] } = analytics || {};

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
        <p className="text-xs text-gray-500 mt-1">
          Detailed metrics tracking your accuracy, retention, and topic-wise mastery.
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Overall Accuracy"
          value={`${overview?.accuracyRate || 0}%`}
          icon={TrendingUp}
          color="purple"
          subtext={`${overview?.totalCorrectAnswers || 0} correct of ${overview?.totalQuestionsAttempted || 0}`}
        />
        <StatCard
          title="Avg Quiz Score"
          value={`${overview?.avgScore || 0}%`}
          icon={Award}
          color="emerald"
          subtext="Mean across attempts"
        />
        <StatCard
          title="Questions Attempted"
          value={overview?.totalQuestionsAttempted || 0}
          icon={CheckCircle}
          color="blue"
          subtext="Across all subjects"
        />
        <StatCard
          title="Total Quizzes"
          value={overview?.totalQuizzes || 0}
          icon={BarChart3}
          color="amber"
          subtext="Completed sessions"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Subject Score Breakdown */}
        <Card className="p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-6">
            Subject-Wise Performance (%)
          </h2>
          {subjectWise.length > 0 ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectWise} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="subject" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="averageScore" fill="#7C3AED" radius={[6, 6, 0, 0]} name="Avg Score %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-xs text-gray-400">
              No quiz attempts logged for subjects yet.
            </div>
          )}
        </Card>

        {/* Score Progression Timeline */}
        <Card className="p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-6">
            Score Progression Over Time
          </h2>
          {timeline.length > 0 ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#2563EB"
                    strokeWidth={3}
                    dot={{ fill: '#2563EB', r: 4 }}
                    name="Score %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-xs text-gray-400">
              Take multiple quizzes to see your growth curve.
            </div>
          )}
        </Card>
      </div>

      {/* Weak & Strong Topics Identification */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Weak Topics */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Topics Needing Attention (Score &lt; 70%)
            </h3>
          </div>
          <div className="space-y-3">
            {weakTopics.length > 0 ? (
              weakTopics.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 border border-amber-100">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{t.topic}</h4>
                    <span className="text-[10px] text-gray-500">{t.subject}</span>
                  </div>
                  <Badge variant="warning">{t.averageScore}% Avg</Badge>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 py-4 text-center">No weak topics identified yet. Great job!</p>
            )}
          </div>
        </Card>

        {/* Strong Topics */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Mastered Topics (Score ≥ 70%)
            </h3>
          </div>
          <div className="space-y-3">
            {strongTopics.length > 0 ? (
              strongTopics.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{t.topic}</h4>
                    <span className="text-[10px] text-gray-500">{t.subject}</span>
                  </div>
                  <Badge variant="success">{t.averageScore}% Avg</Badge>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 py-4 text-center">Take quizzes to record your strong topics!</p>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, RefreshCw, BookOpen, HelpCircle, ArrowRight, Zap, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import { recommendationAPI } from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Recommendations() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRecs = async () => {
    try {
      const res = await recommendationAPI.get();
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecs();
  }, []);

  const handleRegenerate = async () => {
    setRefreshing(true);
    try {
      const res = await recommendationAPI.generate();
      if (res.data.success) {
        setData(res.data.data);
        toast.success('Recommendations updated with latest performance data!');
      }
    } catch (err) {
      toast.error('Failed to regenerate recommendations.');
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner text="Analyzing your quiz history and generating recommendations..." />
      </DashboardLayout>
    );
  }

  const recs = data?.recommendations || [];

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personalized Learning Path</h1>
          <p className="text-xs text-gray-500 mt-1">
            AI-driven recommendations derived from your quiz accuracy and knowledge gaps.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          isLoading={refreshing}
          onClick={handleRegenerate}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Refresh with AI
        </Button>
      </div>

      {recs.length === 0 ? (
        <Card className="p-12 text-center">
          <Target className="w-12 h-12 text-purple-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-900 mb-1">No Recommendations Yet</h3>
          <p className="text-xs text-gray-500 mb-6 max-w-sm mx-auto">
            Take a few topic quizzes to enable the AI to analyze your strengths and weaknesses.
          </p>
          <Link to="/quiz">
            <Button size="md">Start a Quiz</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {recs.map((rec, idx) => (
            <Card key={idx} hover className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mt-1 ${
                  rec.priority === 'high' ? 'bg-rose-50 text-rose-600' : 'bg-purple-50 text-purple-600'
                }`}>
                  <Zap className="w-6 h-6" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                      {rec.subject?.name || 'Curriculum Subject'}
                    </span>
                    <span className="text-gray-300">•</span>
                    <Badge variant={rec.priority}>{rec.priority} Priority</Badge>
                    <Badge variant="default">{rec.type}</Badge>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {rec.topic?.name || 'Topic Remediation'}
                  </h3>
                  <p className="text-xs text-gray-600 max-w-2xl leading-relaxed">
                    {rec.reason}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link to={`/content?subject=${rec.subject?._id}&topic=${rec.topic?._id}`}>
                  <Button variant="secondary" size="sm" leftIcon={<BookOpen className="w-3.5 h-3.5" />}>
                    Study Notes
                  </Button>
                </Link>
                <Link to={`/quiz?subject=${rec.subject?._id}&topic=${rec.topic?._id}`}>
                  <Button size="sm" leftIcon={<HelpCircle className="w-3.5 h-3.5" />}>
                    Take Quiz
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

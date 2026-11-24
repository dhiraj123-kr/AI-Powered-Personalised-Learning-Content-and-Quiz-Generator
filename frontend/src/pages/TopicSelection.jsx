import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, FileText, HelpCircle, Sparkles } from 'lucide-react';
import { topicAPI, subjectAPI } from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function TopicSelection() {
  const { subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const [subRes, topRes] = await Promise.all([
          subjectAPI.getOne(subjectId),
          topicAPI.getBySubject(subjectId),
        ]);

        if (subRes.data.success) setSubject(subRes.data.data);
        if (topRes.data.success) {
          setTopics(topRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching topics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [subjectId]);

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner text="Loading topics..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link to="/subjects" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-purple-600 mb-4 transition">
          <ArrowLeft className="w-4 h-4" /> All Subjects
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{subject?.name || 'Subject'}</h1>
            <p className="text-xs text-gray-500 mt-1">{subject?.description}</p>
          </div>
          <Link to={`/content?subject=${subjectId}`}>
            <Button size="sm" rightIcon={<Sparkles className="w-4 h-4" />}>
              Generate Notes for Subject
            </Button>
          </Link>
        </div>
      </div>

      {topics.length === 0 ? (
        <Card className="p-12 text-center max-w-lg mx-auto">
          <BookOpen className="w-12 h-12 text-purple-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-900 mb-1">No Topics Found For This Subject</h3>
          <p className="text-xs text-gray-500 mb-6">
            You can add topics from the Admin Panel or reload default curriculum.
          </p>
          <Link to="/subjects">
            <Button variant="secondary" size="md">Back to Subjects</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((topic) => (
            <Card key={topic._id} hover className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={topic.difficulty}>{topic.difficulty}</Badge>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    ~{topic.estimatedTime} mins
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">{topic.name}</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">{topic.description}</p>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <Link to={`/content?subject=${subjectId}&topic=${topic._id}`} className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full" leftIcon={<FileText className="w-3.5 h-3.5" />}>
                    Study Notes
                  </Button>
                </Link>
                <Link to={`/quiz?subject=${subjectId}&topic=${topic._id}`} className="flex-1">
                  <Button variant="primary" size="sm" className="w-full" leftIcon={<HelpCircle className="w-3.5 h-3.5" />}>
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

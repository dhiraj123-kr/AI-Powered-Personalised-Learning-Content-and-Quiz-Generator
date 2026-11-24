import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Layers, ArrowRight, Search, Sparkles, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { subjectAPI } from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function SubjectSelection() {
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const fetchSubjects = async () => {
    try {
      const res = await subjectAPI.getAll();
      if (res.data.success) {
        setSubjects(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleSeedDefaults = async () => {
    setSeeding(true);
    try {
      const res = await subjectAPI.seedDefaults();
      if (res.data.success) {
        setSubjects(res.data.data);
        toast.success('Curriculum loaded successfully with 6 subjects and 30 topics!');
      }
    } catch (err) {
      toast.error('Failed to seed curriculum. Make sure backend is running.');
    } finally {
      setSeeding(false);
    }
  };

  const filtered = subjects.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Subjects</h1>
          <p className="text-xs text-gray-500 mt-1">Select a subject to view chapters, topics, and AI study tools.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <Button
            variant="secondary"
            size="sm"
            isLoading={seeding}
            onClick={handleSeedDefaults}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Reload Curriculum
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading curriculum..." />
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No Subjects Loaded</h3>
          <p className="text-xs text-gray-500 mb-6">
            Load the default curriculum containing 6 core CS subjects and 30+ structured topics.
          </p>
          <Button
            variant="primary"
            size="md"
            isLoading={seeding}
            onClick={handleSeedDefaults}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Load Default Curriculum
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((subject) => (
            <Card key={subject._id} hover className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md font-bold text-lg"
                    style={{ backgroundColor: subject.color || '#7C3AED' }}
                  >
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <Badge variant={subject.difficulty}>{subject.difficulty}</Badge>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{subject.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 mb-6">
                  {subject.description}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  {subject.topics?.length || 0} Topics
                </span>
                <Link to={`/subjects/${subject._id}/topics`}>
                  <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Explore
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

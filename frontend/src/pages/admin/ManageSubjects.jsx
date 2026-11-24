import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Edit2, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import { subjectAPI, topicAPI } from '../../services/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function ManageSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Subject Modal
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [subName, setSubName] = useState('');
  const [subDesc, setSubDesc] = useState('');
  const [subColor, setSubColor] = useState('#7C3AED');
  const [subDifficulty, setSubDifficulty] = useState('all');

  // New Topic Modal
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [targetSubjectId, setTargetSubjectId] = useState('');
  const [topicName, setTopicName] = useState('');
  const [topicDesc, setTopicDesc] = useState('');
  const [topicDiff, setTopicDiff] = useState('beginner');

  const fetchSubjects = async () => {
    try {
      const res = await subjectAPI.getAll();
      if (res.data.success) {
        setSubjects(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    try {
      const res = await subjectAPI.create({
        name: subName,
        description: subDesc,
        color: subColor,
        difficulty: subDifficulty,
      });
      if (res.data.success) {
        toast.success('Subject added');
        setIsSubModalOpen(false);
        setSubName('');
        setSubDesc('');
        fetchSubjects();
      }
    } catch (err) {
      toast.error('Failed to create subject');
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm('Delete this subject and all its topics?')) return;
    try {
      await subjectAPI.delete(id);
      setSubjects(subjects.filter((s) => s._id !== id));
      toast.success('Subject deleted');
    } catch (err) {
      toast.error('Failed to delete subject');
    }
  };

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    try {
      const res = await topicAPI.create({
        name: topicName,
        description: topicDesc,
        subject: targetSubjectId,
        difficulty: topicDiff,
      });
      if (res.data.success) {
        toast.success('Topic added');
        setIsTopicModalOpen(false);
        setTopicName('');
        setTopicDesc('');
        fetchSubjects();
      }
    } catch (err) {
      toast.error('Failed to create topic');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Subjects & Topics</h1>
          <p className="text-xs text-gray-500 mt-1">Configure academic curriculum for AI-generated notes and quizzes.</p>
        </div>

        <Button onClick={() => setIsSubModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Add New Subject
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading curriculum..." />
      ) : (
        <div className="space-y-6">
          {subjects.map((sub) => (
            <Card key={sub._id} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: sub.color || '#7C3AED' }}
                  >
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{sub.name}</h3>
                    <p className="text-xs text-gray-500">{sub.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setTargetSubjectId(sub._id);
                      setIsTopicModalOpen(true);
                    }}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Add Topic
                  </Button>
                  <button
                    onClick={() => handleDeleteSubject(sub._id)}
                    className="p-2 text-gray-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Topics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {sub.topics?.map((topic) => (
                  <div key={topic._id} className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-800">{topic.name}</p>
                      <span className="text-[10px] text-gray-400 capitalize">{topic.difficulty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Subject Modal */}
      <Modal isOpen={isSubModalOpen} onClose={() => setIsSubModalOpen(false)} title="Add New Subject">
        <form onSubmit={handleCreateSubject} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Subject Name</label>
            <input
              type="text"
              required
              value={subName}
              onChange={(e) => setSubName(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Description</label>
            <textarea
              required
              value={subDesc}
              onChange={(e) => setSubDesc(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Color Theme (Hex)</label>
            <input
              type="text"
              value={subColor}
              onChange={(e) => setSubColor(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsSubModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Subject</Button>
          </div>
        </form>
      </Modal>

      {/* Add Topic Modal */}
      <Modal isOpen={isTopicModalOpen} onClose={() => setIsTopicModalOpen(false)} title="Add Topic">
        <form onSubmit={handleCreateTopic} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Topic Name</label>
            <input
              type="text"
              required
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Description</label>
            <textarea
              required
              value={topicDesc}
              onChange={(e) => setTopicDesc(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Difficulty</label>
            <select
              value={topicDiff}
              onChange={(e) => setTopicDiff(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsTopicModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Topic</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}

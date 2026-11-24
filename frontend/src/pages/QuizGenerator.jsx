import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HelpCircle, Sparkles, Clock, CheckCircle2, ArrowRight, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { subjectAPI, topicAPI, quizAPI } from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function QuizGenerator() {
  const [searchParams] = useSearchParams();
  const preSubject = searchParams.get('subject');
  const preTopic = searchParams.get('topic');

  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(preSubject || '');
  const [selectedTopic, setSelectedTopic] = useState(preTopic || '');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [numQuestions, setNumQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previousQuizzes, setPreviousQuizzes] = useState([]);
  const [isSeeding, setIsSeeding] = useState(false);

  const navigate = useNavigate();

  const fetchInit = async () => {
    try {
      const [subRes, quizRes] = await Promise.all([
        subjectAPI.getAll(),
        quizAPI.getAll(),
      ]);
      if (subRes.data.success) {
        setSubjects(subRes.data.data);
        if (!selectedSubject && subRes.data.data.length > 0) {
          setSelectedSubject(subRes.data.data[0]._id);
        }
      }
      if (quizRes.data.success) {
        setPreviousQuizzes(quizRes.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInit();
  }, []);

  const handleSeedDefaults = async () => {
    setIsSeeding(true);
    try {
      const res = await subjectAPI.seedDefaults();
      if (res.data.success && res.data.data.length > 0) {
        setSubjects(res.data.data);
        setSelectedSubject(res.data.data[0]._id);
        toast.success('Curriculum loaded!');
      }
    } catch (e) {
      toast.error('Failed to load curriculum');
    } finally {
      setIsSeeding(false);
    }
  };

  useEffect(() => {
    if (selectedSubject) {
      topicAPI.getBySubject(selectedSubject).then((res) => {
        if (res.data.success) {
          setTopics(res.data.data);
          if (res.data.data.length > 0 && !res.data.data.some((t) => t._id === selectedTopic)) {
            setSelectedTopic(res.data.data[0]._id);
          }
        }
      });
    }
  }, [selectedSubject]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!selectedSubject || !selectedTopic) {
      toast.error('Please select both a subject and a topic.');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await quizAPI.generate({
        subjectId: selectedSubject,
        topicId: selectedTopic,
        difficulty,
        numQuestions: parseInt(numQuestions, 10),
      });

      if (res.data.success) {
        toast.success('Quiz generated! Starting test now...');
        navigate(`/quiz/${res.data.data._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate quiz. Please retry.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">AI MCQ Quiz Generator</h1>
        <p className="text-xs text-gray-500 mt-1">
          Generate timed adaptive multiple-choice quizzes tailored to your topic and skill level.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quiz Setup Card */}
        <div className="lg:col-span-2">
          <Card className="p-8">
            <h2 className="text-base font-bold text-gray-900 mb-6 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Customize Quiz Parameters
              </span>
              {subjects.length === 0 && (
                <button
                  type="button"
                  onClick={handleSeedDefaults}
                  disabled={isSeeding}
                  className="text-xs font-semibold text-purple-600 hover:text-purple-800 underline"
                >
                  {isSeeding ? 'Loading...' : 'Load Curriculum'}
                </button>
              )}
            </h2>

            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1.5">Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {subjects.length === 0 ? (
                      <option value="">No subjects found - click "Load Curriculum"</option>
                    ) : (
                      subjects.map((s) => (
                        <option key={s._id} value={s._id}>{s.name}</option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1.5">Topic</label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {topics.length === 0 ? (
                      <option value="">Select subject first</option>
                    ) : (
                      topics.map((t) => (
                        <option key={t._id} value={t._id}>{t.name}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1.5">Difficulty Level</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="beginner">Beginner (Foundations)</option>
                    <option value="intermediate">Intermediate (Standard)</option>
                    <option value="advanced">Advanced (Deep Analysis)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1.5">Number of Questions</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[5, 10, 15, 20].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setNumQuestions(num)}
                        className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                          numQuestions === num
                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                            : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quiz Features Alert */}
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 text-xs text-purple-900 space-y-1">
                <p className="font-semibold flex items-center gap-1.5 text-purple-800">
                  <Clock className="w-4 h-4 text-purple-600" />
                  Estimated Time: {numQuestions * 1.5} minutes ({numQuestions} questions)
                </p>
                <p className="text-purple-700">
                  Includes automatic scoring, timer, and detailed Gemini AI explanations for every answer.
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={isGenerating}
                size="lg"
                className="w-full"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Generate & Start Quiz
              </Button>
            </form>
          </Card>
        </div>

        {/* Previous Quizzes Panel */}
        <div>
          <Card className="p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Previous Quizzes ({previousQuizzes.length})
            </h3>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {previousQuizzes.length > 0 ? (
                previousQuizzes.map((quiz) => (
                  <div
                    key={quiz._id}
                    onClick={() => navigate(`/quiz/${quiz._id}`)}
                    className="p-3 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 cursor-pointer transition group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-900 group-hover:text-purple-600 transition truncate">
                        {quiz.topic?.name || 'Topic Quiz'}
                      </span>
                      <Badge variant={quiz.difficulty} size="xs">{quiz.difficulty}</Badge>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      {quiz.questions?.length || quiz.numQuestions} Questions • {new Date(quiz.generatedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 text-center py-6">
                  No generated quizzes yet.
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, Copy, Download, Check, BookOpen, Trash2, Globe, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import { subjectAPI, topicAPI, contentAPI } from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function ContentGenerator() {
  const [searchParams] = useSearchParams();
  const preSubject = searchParams.get('subject');
  const preTopic = searchParams.get('topic');

  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(preSubject || '');
  const [selectedTopic, setSelectedTopic] = useState(preTopic || '');
  const [contentType, setContentType] = useState('notes');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [language, setLanguage] = useState('English');

  const [generatedContent, setGeneratedContent] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const fetchSubjects = async () => {
    try {
      const [subRes, histRes] = await Promise.all([
        subjectAPI.getAll(),
        contentAPI.getAll(),
      ]);
      if (subRes.data.success) {
        setSubjects(subRes.data.data);
        if (!selectedSubject && subRes.data.data.length > 0) {
          setSelectedSubject(subRes.data.data[0]._id);
        }
      }
      if (histRes.data.success) {
        setHistory(histRes.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSubjects();
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
      const res = await contentAPI.generate({
        subjectId: selectedSubject,
        topicId: selectedTopic,
        contentType,
        difficulty,
        language,
      });

      if (res.data.success) {
        setGeneratedContent(res.data.data);
        setHistory([res.data.data, ...history]);
        toast.success('Learning content generated successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate content. Please retry.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedContent?.content) return;
    navigator.clipboard.writeText(generatedContent.content);
    setIsCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!generatedContent?.content) return;
    const element = document.createElement('a');
    const file = new Blob([generatedContent.content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${contentType}_study_notes.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Downloaded notes');
  };

  const handleDeleteHistory = async (id) => {
    try {
      await contentAPI.delete(id);
      setHistory(history.filter((h) => h._id !== id));
      if (generatedContent?._id === id) setGeneratedContent(null);
      toast.success('Item deleted');
    } catch (err) {
      toast.error('Failed to delete history item');
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">AI Personalized Notes Generator</h1>
        <p className="text-xs text-gray-500 mt-1">
          Synthesize custom study materials using Google Gemini 1.5 Flash.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Column */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Configure Generation
              </span>
              {subjects.length === 0 && (
                <button
                  type="button"
                  onClick={handleSeedDefaults}
                  disabled={isSeeding}
                  className="text-[11px] font-semibold text-purple-600 hover:text-purple-800 underline"
                >
                  {isSeeding ? 'Loading...' : 'Load Curriculum'}
                </button>
              )}
            </h2>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Subject</label>
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
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Topic</label>
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

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Format Type</label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="notes">Comprehensive Study Notes</option>
                  <option value="summary">5-Minute High-Yield Summary</option>
                  <option value="explanation">Intuitive Concept Breakdown</option>
                  <option value="examples">Real-world Examples & Code</option>
                  <option value="exam_questions">High-Frequency Exam Questions</option>
                  <option value="revision">Quick Flash Revision Cards</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Target Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={isGenerating}
                className="w-full mt-4"
                rightIcon={<Sparkles className="w-4 h-4" />}
              >
                Generate Material
              </Button>
            </form>
          </Card>

          {/* Saved History */}
          <Card className="p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              Previously Generated ({history.length})
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {history.map((item) => (
                <div
                  key={item._id}
                  onClick={() => setGeneratedContent(item)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-50 cursor-pointer border border-transparent hover:border-purple-100 transition group text-xs"
                >
                  <div className="overflow-hidden">
                    <p className="font-semibold text-gray-800 truncate">{item.topic?.name || 'Topic'}</p>
                    <p className="text-[10px] text-gray-400 capitalize">{item.contentType} • {item.difficulty}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteHistory(item._id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Display Content Column */}
        <div className="lg:col-span-2">
          {isGenerating ? (
            <Card className="p-12 text-center">
              <LoadingSpinner text="Generating tailored study material with Gemini AI..." />
            </Card>
          ) : generatedContent ? (
            <Card className="p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={generatedContent.difficulty}>{generatedContent.difficulty}</Badge>
                    <Badge variant="primary">{generatedContent.contentType}</Badge>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {generatedContent.topic?.name || 'Generated Material'}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={handleCopy} leftIcon={isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}>
                    {isCopied ? 'Copied' : 'Copy'}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handleDownload} leftIcon={<Download className="w-4 h-4" />}>
                    Download
                  </Button>
                </div>
              </div>

              {/* Rendered Markdown */}
              <div className="prose prose-purple max-w-none text-sm text-gray-700 leading-relaxed space-y-4">
                <ReactMarkdown>{generatedContent.content}</ReactMarkdown>
              </div>
            </Card>
          ) : (
            <Card className="p-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">No Material Selected</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Configure your subject and click "Generate Material" to produce tailored revision notes.
              </p>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

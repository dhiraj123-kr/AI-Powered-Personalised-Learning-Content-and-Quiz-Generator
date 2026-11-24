import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, CheckCircle2, XCircle, ArrowRight, RotateCcw, BookOpen, Clock } from 'lucide-react';
import { quizResultAPI } from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function QuizResults() {
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await quizResultAPI.getOne(resultId);
        if (res.data.success) {
          setResult(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [resultId]);

  if (loading || !result) {
    return (
      <DashboardLayout>
        <LoadingSpinner text="Evaluating results..." />
      </DashboardLayout>
    );
  }

  const correctCount = result.answers?.filter((a) => a.isCorrect).length || 0;
  const passed = result.score >= 70;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Score Summary Card */}
        <Card className="p-8 sm:p-10 text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-4 shadow-lg ${
              passed ? 'bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50' : 'bg-rose-50 text-rose-600 ring-8 ring-rose-50'
            }`}>
              <Award className="w-10 h-10" />
            </div>

            <Badge variant={passed ? 'success' : 'danger'} size="md" className="mb-2">
              {passed ? 'Mastery Achieved 🎉' : 'Needs Review'}
            </Badge>

            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-2">
              {result.score}%
            </h1>

            <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
              You answered <strong>{correctCount}</strong> out of <strong>{result.totalQuestions}</strong> questions correctly in {Math.round(result.timeTaken || 0)} seconds.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to={`/quiz/${result.quiz?._id}`}>
                <Button variant="secondary" size="md" leftIcon={<RotateCcw className="w-4 h-4" />}>
                  Retake Quiz
                </Button>
              </Link>
              <Link to={`/content?subject=${result.subject?._id}&topic=${result.topic?._id}`}>
                <Button size="md" leftIcon={<BookOpen className="w-4 h-4" />}>
                  Review Topic Notes
                </Button>
              </Link>
              <Link to="/analytics">
                <Button variant="ghost" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  View Analytics
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Detailed Question Review */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Question-by-Question Breakdown</h2>

          {result.quiz?.questions?.map((q, idx) => {
            const studentAns = result.answers?.find((a) => a.questionIndex === idx);
            const isCorrect = studentAns?.isCorrect;
            const selectedIdx = studentAns?.selectedAnswer;

            return (
              <Card key={idx} className="p-6">
                <div className="flex items-start gap-3 mb-3">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="text-xs font-semibold text-gray-400 block mb-0.5">Question {idx + 1}</span>
                    <h3 className="text-sm font-bold text-gray-900">{q.question}</h3>
                  </div>
                </div>

                {/* Options Review */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-4">
                  {q.options.map((opt, optIdx) => {
                    const isStudentSelection = selectedIdx === optIdx;
                    const isRightAnswer = q.correctAnswer === optIdx;

                    let style = 'bg-gray-50 border-gray-100 text-gray-600';
                    if (isRightAnswer) style = 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold';
                    else if (isStudentSelection && !isRightAnswer) style = 'bg-rose-50 border-rose-300 text-rose-800 line-through';

                    return (
                      <div key={optIdx} className={`p-3 rounded-xl border text-xs flex items-center justify-between ${style}`}>
                        <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                        {isRightAnswer && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                    );
                  })}
                </div>

                {/* AI Explanation Box */}
                {q.explanation && (
                  <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900">
                    <strong className="block text-purple-700 mb-0.5">💡 AI Explanation:</strong>
                    {q.explanation}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}

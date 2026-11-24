import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, AlertCircle, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { quizAPI, quizResultAPI } from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function QuizInterface() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins default
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await quizAPI.getOne(quizId);
        if (res.data.success) {
          setQuiz(res.data.data);
          setTimeLeft(res.data.data.questions.length * 90); // 90 secs per question
        }
      } catch (err) {
        toast.error('Failed to load quiz');
        navigate('/quiz');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  // Countdown Timer
  useEffect(() => {
    if (loading || !quiz || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, quiz]);

  const handleSelectOption = (optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIndex]: optionIndex,
    });
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;
    setIsSubmitting(true);

    const answersPayload = quiz.questions.map((_, idx) => ({
      questionIndex: idx,
      selectedAnswer: selectedAnswers[idx] !== undefined ? selectedAnswers[idx] : -1,
    }));

    try {
      const res = await quizResultAPI.submit({
        quizId: quiz._id,
        answers: answersPayload,
        timeTaken: quiz.questions.length * 90 - timeLeft,
      });

      if (res.data.success) {
        toast.success('Quiz submitted successfully!');
        navigate(`/quiz/results/${res.data.data.resultId}`);
      }
    } catch (err) {
      toast.error('Failed to submit quiz. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (loading || !quiz) {
    return (
      <DashboardLayout>
        <LoadingSpinner text="Preparing quiz session..." />
      </DashboardLayout>
    );
  }

  const currentQ = quiz.questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / quiz.questions.length) * 100;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">{quiz.subject?.name}</span>
              <span className="text-gray-300">•</span>
              <Badge variant={quiz.difficulty}>{quiz.difficulty}</Badge>
            </div>
            <h1 className="text-xl font-bold text-gray-900">{quiz.topic?.name}</h1>
          </div>

          {/* Timer Pill */}
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-sm font-bold border ${
            timeLeft < 60 ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse' : 'bg-purple-50 text-purple-700 border-purple-200'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5 font-medium">
            <span>Question {currentIndex + 1} of {quiz.questions.length}</span>
            <span>{Math.round(progressPercent)}% Completed</span>
          </div>
          <ProgressBar progress={currentIndex + 1} max={quiz.questions.length} />
        </div>

        {/* Question Card */}
        <Card className="p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 leading-relaxed">
            {currentIndex + 1}. {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentIndex] === optIdx;
              return (
                <div
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50/60 shadow-sm'
                      : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    isSelected ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {String.fromCharCode(65 + optIdx)}
                  </div>
                  <span className={`text-sm ${isSelected ? 'font-semibold text-purple-950' : 'text-gray-700'}`}>
                    {opt}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Navigation & Submit Controls */}
        <div className="flex items-center justify-between">
          <Button
            variant="secondary"
            size="md"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(currentIndex - 1)}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          {currentIndex === quiz.questions.length - 1 ? (
            <Button
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              onClick={handleSubmitQuiz}
              rightIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={() => setCurrentIndex(currentIndex + 1)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Next Question
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

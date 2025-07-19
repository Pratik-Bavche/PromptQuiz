import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Zap, Clock, Hash, Copy, Share2, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quizData, setQuizData] = useState({
    topic: '',
    numQuestions: 5,
    timeLimit: 60
  });
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [timeMode, setTimeMode] = useState('perQuestion'); // 'perQuiz' or 'perQuestion'

  // Helper function to format time in minutes
  const formatTimeLimit = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (secs === 0) {
      return `${mins} min`;
    } else {
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Prepare data based on time mode
    const dataToSend = {
      ...quizData,
      timeMode,
      timeLimit: timeMode === 'perQuiz' ? quizData.timeLimitQuiz : quizData.timeLimit,
    };

    try {
      const response = await axios.post('/api/quiz/generate', dataToSend);
      navigate(`/review/${response.data.quiz.roomId}`);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleStartQuiz = () => {
    if (generatedQuiz) {
      navigate(`/quiz/${generatedQuiz.roomId}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {(!generatedQuiz) && (
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Quiz</h1>
          <p className="text-gray-600">
            Generate AI-powered questions on any topic and share with participants
          </p>
        </div>
      )}

      {!generatedQuiz ? (
        <div className="card max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Topic Input */}
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                Quiz Topic
              </label>
              <input
                id="topic"
                type="text"
                required
                value={quizData.topic}
                onChange={(e) => setQuizData({ ...quizData, topic: e.target.value })}
                className="input-field"
                placeholder="e.g., JavaScript fundamentals, World history, Science trivia"
              />
              <p className="text-sm text-gray-500 mt-1">
                Be specific for better AI-generated questions
              </p>
            </div>

            {/* Number of Questions */}
            <div>
              <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <input
                id="numQuestions"
                type="number"
                min={1}
                max={100}
                value={quizData.numQuestions}
                onChange={(e) => setQuizData({ ...quizData, numQuestions: parseInt(e.target.value) })}
                className="input-field"
                placeholder="Enter number of questions"
              />
            </div>

            {/* Time Limit Mode Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit Mode</label>
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="timeMode"
                    value="perQuestion"
                    checked={timeMode === 'perQuestion'}
                    onChange={() => setTimeMode('perQuestion')}
                  />
                  <span>Per Question</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="timeMode"
                    value="perQuiz"
                    checked={timeMode === 'perQuiz'}
                    onChange={() => setTimeMode('perQuiz')}
                  />
                  <span>Entire Quiz</span>
                </label>
              </div>
            </div>
            {/* Time Limit */}
            {timeMode === 'perQuestion' ? (
              <div>
                <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700 mb-2">
                  Time Limit per Question
                </label>
                <select
                  id="timeLimit"
                  value={quizData.timeLimit}
                  onChange={(e) => setQuizData({ ...quizData, timeLimit: parseInt(e.target.value) })}
                  className="input-field overflow-y-auto"
                  size={3}
                  style={{ minHeight: '3.5rem', maxHeight: '6.5rem' }}
                >
                  <option value={30}>30 seconds</option>
                  <option value={60}>1 minute</option>
                  <option value={90}>1.5 minutes</option>
                  <option value={120}>2 minutes</option>
                  <option value={180}>3 minutes</option>
                </select>
              </div>
            ) : (
              <div>
                <label htmlFor="timeLimitQuiz" className="block text-sm font-medium text-gray-700 mb-2">
                  Time Limit for Entire Quiz
                </label>
                <select
                  id="timeLimitQuiz"
                  value={quizData.timeLimitQuiz || 600}
                  onChange={(e) => setQuizData({ ...quizData, timeLimitQuiz: parseInt(e.target.value) })}
                  className="input-field overflow-y-auto"
                  size={3}
                  style={{ minHeight: '3.5rem', maxHeight: '6.5rem' }}
                >
                  <option value={300}>5 minutes</option>
                  <option value={600}>10 minutes</option>
                  <option value={900}>15 minutes</option>
                  <option value={1200}>20 minutes</option>
                  <option value={1800}>30 minutes</option>
                </select>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Generate Button */}
            <button
              type="submit"
              disabled={loading || !quizData.topic.trim()}
              className="btn-primary w-full flex items-center justify-center space-x-2 py-3"
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  <span>Generating Quiz...</span>
                </>
              ) : (
                <>
                  <Zap size={20} />
                  <span>Generate Quiz</span>
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="card max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="text-green-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Generated!</h2>
            <p className="text-gray-600">Your AI-powered quiz is ready to share</p>
          </div>

          {/* Quiz Details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Hash className="text-gray-500" size={20} />
                <span className="font-medium">Room Code</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-lg font-bold text-gray-900">
                  {generatedQuiz.roomId}
                </span>
                <button
                  onClick={() => copyToClipboard(generatedQuiz.roomId)}
                  className="text-gray-500 hover:text-gray-700"
                  title="Copy room code"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Hash className="text-blue-600" size={16} />
                  <span className="text-sm font-medium text-blue-900">Questions</span>
                </div>
                <span className="text-2xl font-bold text-blue-900">{generatedQuiz.numQuestions}</span>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="text-purple-600" size={16} />
                  <span className="text-sm font-medium text-purple-900">Time Limit</span>
                </div>
                <span className="text-2xl font-bold text-purple-900">{formatTimeLimit(generatedQuiz.timeLimit)}</span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Share2 className="text-gray-500" size={16} />
                <span className="font-medium text-gray-700">Share Link</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={generatedQuiz.shareLink}
                  readOnly
                  className="input-field flex-1"
                />
                <button
                  onClick={() => copyToClipboard(generatedQuiz.shareLink)}
                  className="btn-secondary px-4 py-2"
                  title="Copy share link"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <button
              onClick={handleStartQuiz}
              className="btn-primary flex items-center justify-center space-x-2 py-3"
            >
              <span>Start Quiz</span>
              <ArrowRight size={20} />
            </button>
            <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
              <button
                onClick={() => {
                  setGeneratedQuiz(null);
                  setQuizData({ topic: '', numQuestions: 5, timeLimit: 60 });
                }}
                className="btn-secondary py-3"
              >
                Create Another Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateQuiz; 
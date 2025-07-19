import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Hash, Clock, Users, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const JoinQuiz = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [joining, setJoining] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [waiting, setWaiting] = useState(false);

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

  useEffect(() => {
    fetchQuizDetails();
  }, [roomId]);

  useEffect(() => {
    // Auto-join after auth and quiz are loaded
    if (!authLoading && isAuthenticated && quiz && !waiting) {
      joinQuiz();
    }
    // eslint-disable-next-line
  }, [authLoading, isAuthenticated, quiz]);

  const fetchQuizDetails = async () => {
    try {
      const response = await axios.get(`/api/quiz/room/${roomId}`);
      setQuiz(response.data.quiz);
    } catch (error) {
      setError('Quiz not found or has expired');
    } finally {
      setLoading(false);
    }
  };

  const joinQuiz = async () => {
    if (!user?.username) return;
    setJoining(true);
    setError('');
    try {
      await axios.post(`/api/quiz/join/${roomId}`, { name: user.username });
      setWaiting(true);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to join quiz');
    } finally {
      setJoining(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz details...</p>
        </div>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (waiting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center">
          <div className="text-blue-600 text-2xl font-bold mb-2">Waiting Room</div>
          <div className="text-xl font-bold text-gray-900 mb-1">{quiz?.title}</div>
          <div className="text-gray-700 text-center mb-4">Waiting for the quiz to start...</div>
          <div className="spinner mb-2"></div>
        </div>
      </div>
    );
  }

  return null;
};

export default JoinQuiz; 
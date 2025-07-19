import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import axios from 'axios';
import { Users, Play, Copy, Share2, AlertCircle, ArrowRight } from 'lucide-react';

const QuizRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { joinQuiz, startQuiz, onQuizState, onParticipantJoined, onQuizStarted, offEvent } = useSocket();
  
  const [quiz, setQuiz] = useState(null);
  const [participantName, setParticipantName] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    if (quiz && participantName) {
      // Join socket room
      joinQuiz(roomId, participantName);

      // Set up socket listeners
      onQuizState((data) => {
        setQuiz(data.quiz);
      });

      onParticipantJoined((data) => {
        setQuiz(prev => ({
          ...prev,
          participants: data.participants
        }));
      });

      onQuizStarted((data) => {
        navigate(`/game/${roomId}`);
      });

      // Cleanup
      return () => {
        offEvent('quiz-state');
        offEvent('participant-joined');
        offEvent('quiz-started');
      };
    }
  }, [quiz, participantName, roomId]);

  useEffect(() => {
    // Automatically start demo quizzes as soon as the host joins
    if (quiz && isHost && quiz.hostId === 'demo' && quiz.status === 'waiting') {
      console.log('Auto-starting demo quiz...', { quiz, isHost, user });
      startQuiz(roomId);
    }
  }, [quiz, isHost, roomId, startQuiz]);

  const fetchQuizDetails = async () => {
    try {
      const response = await axios.get(`/api/quiz/room/${roomId}`);
      const quizData = response.data.quiz;
      setQuiz(quizData);
      
      // Check if current user is the host (treat all users as host for demo quizzes)
      setIsHost(quizData.hostId === 'demo' || user?.id === quizData.hostId?._id || user?.id === quizData.hostId);
      
      // If user is already a participant, set their name
      const existingParticipant = quizData.participants.find(p => 
        p.userId === user?.id || p.name === user?.username
      );
      if (existingParticipant) {
        setParticipantName(existingParticipant.name);
      }
    } catch (error) {
      setError('Failed to load quiz details');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!participantName.trim()) return;

    try {
      await axios.post(`/api/quiz/join/${roomId}`, { name: participantName.trim() });
      setParticipantName(participantName.trim());
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to join quiz');
    }
  };

  const handleStartQuiz = () => {
    if (isHost) {
      startQuiz(roomId);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz room...</p>
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

  if (!quiz) return null;

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
      <div className="card w-full max-w-2xl">
        {/* Quiz Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
          <p className="text-gray-600">Waiting for participants to join...</p>
        </div>

        {/* Quiz Info */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-900">{quiz.numQuestions}</div>
            <div className="text-sm text-blue-700">Questions</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-900">{formatTimeLimit(quiz.timeLimit)}</div>
            <div className="text-sm text-purple-700">Time Limit</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-900">{quiz.participants.length}</div>
            <div className="text-sm text-green-700">Participants</div>
          </div>
        </div>

        {/* Share Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Share2 className="text-gray-500" size={20} />
            <span className="font-medium text-gray-700">Share Quiz</span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Room Code</span>
                <button
                  onClick={() => copyToClipboard(roomId)}
                  className="text-gray-500 hover:text-gray-700"
                  title="Copy room code"
                >
                  <Copy size={16} />
                </button>
              </div>
              <div className="font-mono text-lg font-bold text-gray-900">{roomId}</div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Share Link</span>
                <button
                  onClick={() => copyToClipboard(window.location.href)}
                  className="text-gray-500 hover:text-gray-700"
                  title="Copy share link"
                >
                  <Copy size={16} />
                </button>
              </div>
              <div className="text-sm text-gray-600 truncate">{window.location.href}</div>
            </div>
          </div>
        </div>

        {/* Participants */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="text-gray-500" size={20} />
            <span className="font-medium text-gray-700">Participants</span>
          </div>
          
          {quiz.participants.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {quiz.participants.map((participant, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="font-medium text-gray-700">{participant.name}</div>
                  {participant.userId === quiz.hostId?._id && (
                    <div className="text-xs text-blue-600 font-medium">Host</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="mx-auto mb-2" size={24} />
              <p>No participants yet. Share the link to invite others!</p>
            </div>
          )}
        </div>

        {/* Join Form (if not already joined) */}
        {!participantName && (
          <form onSubmit={handleJoin} className="mb-8">
            <div className="max-w-md mx-auto">
              <label htmlFor="participantName" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <div className="flex space-x-2">
                <input
                  id="participantName"
                  type="text"
                  required
                  minLength={2}
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Enter your name"
                />
                <button
                  type="submit"
                  disabled={!participantName.trim()}
                  className="btn-primary px-6"
                >
                  Join
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Host Controls */}
        {isHost && participantName && (
          <div className="text-center">
            <button
              onClick={handleStartQuiz}
              disabled={quiz.participants.length < 1}
              className="btn-success text-lg px-8 py-3 flex items-center justify-center space-x-2 mx-auto"
            >
              <Play size={20} />
              <span>Start Quiz</span>
            </button>
            {quiz.participants.length < 1 && (
              <p className="text-sm text-gray-500 mt-2">
                Wait for at least one participant to join
              </p>
            )}
          </div>
        )}

        {/* Participant Waiting Message */}
        {!isHost && participantName && (
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Waiting for host to start the quiz...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizRoom; 
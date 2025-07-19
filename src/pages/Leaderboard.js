import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trophy, Medal, Award, ArrowLeft, Users, Clock } from 'lucide-react';

const Leaderboard = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetchResults();
  }, [roomId]);

  const fetchResults = async () => {
    try {
      const response = await axios.get(`/api/quiz/results/${roomId}`);
      setResults(response.data.quiz);
    } catch (error) {
      setError('Failed to load quiz results');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-500" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Award className="text-orange-500" size={24} />;
      default:
        return <span className="text-gray-400 font-bold">{rank}</span>;
    }
  };

  const getRankClass = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-50 border-yellow-200';
      case 2:
        return 'bg-gray-50 border-gray-200';
      case 3:
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
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

  if (!results) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="text-yellow-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Results</h1>
          <p className="text-gray-600">{results.title}</p>
        </div>

        {/* Quiz Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Users className="text-blue-600" size={20} />
              <span className="font-medium text-blue-900">Participants</span>
            </div>
            <span className="text-2xl font-bold text-blue-900">{results.participants.length}</span>
          </div>

          <div className="p-4 bg-green-50 rounded-lg text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Trophy className="text-green-600" size={20} />
              <span className="font-medium text-green-900">Winner</span>
            </div>
            <span className="text-lg font-bold text-green-900">
              {results.participants[0]?.name || 'N/A'}
            </span>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock className="text-purple-600" size={20} />
              <span className="font-medium text-purple-900">Duration</span>
            </div>
            <span className="text-lg font-bold text-purple-900">
              {results.startedAt && results.endedAt ? 
                formatTime(new Date(results.endedAt) - new Date(results.startedAt)) : 
                'N/A'
              }
            </span>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Final Rankings</h2>
          
          {results.participants.map((participant, index) => (
            <div 
              key={index}
              className={`p-6 rounded-lg border-2 ${getRankClass(index + 1)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8">
                    {getRankIcon(index + 1)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-lg">
                      {participant.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {participant.score} correct answers
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {participant.score}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatTime(participant.timeTaken)}
                  </div>
                </div>
              </div>

              {/* Score Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Score</span>
                  <span>{participant.score}/{results.participants[0]?.score || 1}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(participant.score / (results.participants[0]?.score || 1)) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/')}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>
          
          <button
            onClick={() => navigate('/create')}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <Trophy size={20} />
            <span>Create New Quiz</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard; 
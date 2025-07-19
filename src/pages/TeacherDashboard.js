import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trophy, Users, ArrowLeft } from 'lucide-react';

const TeacherDashboard = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    let interval = setInterval(fetchLiveResults, 2000);
    fetchLiveResults();
    return () => clearInterval(interval);
  }, [roomId]);

  const fetchLiveResults = async () => {
    try {
      const response = await axios.get(`/api/quiz/live/${roomId}`);
      setQuiz(response.data.quiz);
      setParticipants(response.data.quiz.participants || []);
    } catch (error) {
      setError('Failed to load live results');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="card">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="text-yellow-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Dashboard</h1>
          <p className="text-gray-600">Live Leaderboard for: {quiz?.title}</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Users className="text-blue-600" size={20} />
            <span className="font-medium text-blue-900">Students</span>
          </div>
          <span className="text-2xl font-bold text-blue-900">{participants.length}</span>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Live Scores</h2>
          {participants.length === 0 ? (
            <div className="text-gray-500">No students have joined yet.</div>
          ) : (
            participants.map((participant, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border-2 bg-white border-gray-200 flex items-center justify-between"
              >
                <div className="font-semibold text-gray-900 text-lg">
                  {participant.name}
                </div>
                <div className="text-2xl font-bold text-blue-700">
                  {participant.score || 0}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/')}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard; 
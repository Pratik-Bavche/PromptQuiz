import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Edit, Trash2, Check, X } from 'lucide-react';

const ReviewQuiz = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editOptions, setEditOptions] = useState([]);
  const [waitingCount, setWaitingCount] = useState(0);
  const [startMsg, setStartMsg] = useState(false);
  const [error, setError] = useState('');

  // Poll for quiz and waiting count
  useEffect(() => {
    let interval = setInterval(fetchQuiz, 3000);
    fetchQuiz();
    return () => clearInterval(interval);
  }, [roomId]);

  const fetchQuiz = async () => {
    try {
      const res = await axios.get(`/api/quiz/room/${roomId}`);
      setQuiz(res.data.quiz);
      setWaitingCount(res.data.quiz.participants?.length || 0);
    } catch (err) {
      setError('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (idx) => {
    setEditingIndex(idx);
    setEditQuestion(quiz.questions[idx].question);
    setEditOptions([...quiz.questions[idx].options]);
  };

  const handleSave = async (idx) => {
    const updatedQuestions = quiz.questions.map((q, i) =>
      i === idx ? { ...q, question: editQuestion, options: editOptions } : q
    );
    try {
      await axios.put(`/api/quiz/room/${roomId}/questions`, { questions: updatedQuestions });
      setQuiz({ ...quiz, questions: updatedQuestions });
      setEditingIndex(null);
    } catch {
      setError('Failed to save changes');
    }
  };

  const handleDelete = async (idx) => {
    if (!window.confirm('Delete this question?')) return;
    const updatedQuestions = quiz.questions.filter((_, i) => i !== idx);
    try {
      await axios.put(`/api/quiz/room/${roomId}/questions`, { questions: updatedQuestions });
      setQuiz({ ...quiz, questions: updatedQuestions });
    } catch {
      setError('Failed to delete question');
    }
  };

  const handleStartQuiz = async () => {
    try {
      await axios.post(`/api/quiz/start/${roomId}`);
      setStartMsg(true);
      setTimeout(() => navigate(`/dashboard/${roomId}`), 1500);
    } catch {
      setError('Failed to start quiz');
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center text-red-600 py-20">{error}</div>;
  if (!quiz) return null;

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4 text-center">Review Quiz</h1>
      <div className="text-center mb-6 text-lg text-gray-700">Students Waiting: {waitingCount}</div>
      <div className="space-y-6 mb-8">
        {quiz.questions.map((q, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 relative">
            {editingIndex === idx ? (
              <>
                <input
                  className="input-field mb-2"
                  value={editQuestion}
                  onChange={e => setEditQuestion(e.target.value)}
                />
                {editOptions.map((opt, oidx) => (
                  <input
                    key={oidx}
                    className="input-field mb-1"
                    value={editOptions[oidx]}
                    onChange={e => {
                      const newOpts = [...editOptions];
                      newOpts[oidx] = e.target.value;
                      setEditOptions(newOpts);
                    }}
                  />
                ))}
                <div className="flex gap-2 mt-2">
                  <button className="btn-primary" onClick={() => handleSave(idx)}><Check size={16} /></button>
                  <button className="btn-secondary" onClick={() => setEditingIndex(null)}><X size={16} /></button>
                </div>
              </>
            ) : (
              <>
                <div className="font-semibold text-lg mb-1">Q{idx + 1}: {q.question}</div>
                <ul className="list-disc pl-6 mb-1">
                  {q.options.map((opt, oidx) => (
                    <li key={oidx}>{opt}</li>
                  ))}
                </ul>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(idx)}><Edit size={18} /></button>
                  <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(idx)}><Trash2 size={18} /></button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="text-center">
        <button className="btn-primary text-xl px-8 py-3" onClick={handleStartQuiz} disabled={startMsg}>
          Start Quiz
        </button>
      </div>
      {startMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center">
            <div className="text-green-600 text-2xl font-bold mb-2">Quiz Started!</div>
            <div className="text-gray-700 text-center mb-4">Redirecting to dashboard...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewQuiz; 
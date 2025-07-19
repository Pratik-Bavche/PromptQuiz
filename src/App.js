import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CreateQuiz from './pages/CreateQuiz';
import JoinQuiz from './pages/JoinQuiz';
import QuizRoom from './pages/QuizRoom';
import QuizGame from './pages/QuizGame';
import Leaderboard from './pages/Leaderboard';
import LoadingSpinner from './components/LoadingSpinner';
import ReviewQuiz from './pages/ReviewQuiz';

function App() {
  const { loading, isAuthenticated, isGuest } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="fixed inset-0 -z-10 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50" />
      <div className="h-screen">
        <Navbar />
        <div className="h-full pt-16 pb-10 flex flex-col">
          <main className="flex-1 container mx-auto px-4 py-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/create" 
                element={isAuthenticated && !isGuest ? <CreateQuiz /> : <Navigate to="/" />} 
              />
              <Route path="/review/:roomId" element={<ReviewQuiz />} />
              <Route path="/join/:roomId" element={<JoinQuiz />} />
              <Route path="/quiz/:roomId" element={<QuizRoom />} />
              <Route path="/game/:roomId" element={<QuizGame />} />
              <Route path="/leaderboard/:roomId" element={<Leaderboard />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default App; 
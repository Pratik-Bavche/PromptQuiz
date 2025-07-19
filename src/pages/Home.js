import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Play, Users, Zap, Award, ArrowRight, Sparkles, AlertTriangle } from 'lucide-react';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';
import Navbar from '../components/Navbar';

// Animated background for Home page
const AnimatedHomeBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute top-0 left-1/2 w-[120vw] h-[120vw] -translate-x-1/2 bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 opacity-20 animate-spin-slow rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-300 via-blue-200 to-purple-200 opacity-30 rounded-full blur-2xl animate-pulse"></div>
  </div>
);

const Home = () => {
  const { isAuthenticated, isGuest } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  // Modal state and login logic
  const [activeTab, setActiveTab] = useState('welcome');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [signupPrompt, setSignupPrompt] = useState(false); // NEW STATE
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [guestData, setGuestData] = useState({ username: '' });
  const { login, register, guestLogin } = useAuth();
  const [showAccountCreatedDialog, setShowAccountCreatedDialog] = useState(false);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [showJoinQuizDialog, setShowJoinQuizDialog] = useState(false);
  const [joinQuizCode, setJoinQuizCode] = useState('');
  const [demoQuizInfo, setDemoQuizInfo] = useState(null); // New state for demo quiz info
  const [hideTabs, setHideTabs] = useState(false);
  
  // Show login modal automatically when component mounts if user is not authenticated
  useEffect(() => {
    if (!isAuthenticated && !showLoginModal) {
      setShowLoginModal(true);
      setActiveTab('welcome');
    }
  }, [isAuthenticated, showLoginModal]);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(loginData.email, loginData.password);
    if (result.success) {
      setShowLoginModal(false);
      setLoginData({ email: '', password: '' });
      setShowWelcomeDialog(true);
      setTimeout(() => setShowJoinQuizDialog(true), 500); // Show join quiz dialog after welcome
    } else {
      setError(result.error);
      setLoginData({ email: '', password: '' });
    }
    setLoading(false);
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    const result = await register(
      registerData.username,
      registerData.email,
      registerData.password
    );
    if (result.success) {
      setRegisterData({ username: '', email: '', password: '', confirmPassword: '' });
      setShowAccountCreatedDialog(true);
      setActiveTab('login');
    } else {
      setError(result.error);
      setRegisterData({ username: '', email: '', password: '', confirmPassword: '' });
    }
    setLoading(false);
  };
  const handleGuestLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await guestLogin(guestData.username);
    if (result.success) {
      setShowLoginModal(false);
      // Removed: setTimeout(() => setShowJoinQuizDialog(true), 500);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };
  const handleJoinQuizSubmit = (e) => {
    e.preventDefault();
    if (joinQuizCode.trim()) {
      navigate(`/join/${joinQuizCode.trim()}`);
      setShowJoinQuizDialog(false);
      setJoinQuizCode('');
    }
  };
  const navigate = useNavigate();
  const handleJoinDemoQuiz = async () => {
    try {
      // Create a demo quiz with topic 'C' and 10 questions, 60s time limit
      const response = await axios.post('/api/quiz/generate', {
        topic: 'C',
        numQuestions: 10,
        timeLimit: 60
      });
      setDemoQuizInfo(response.data.quiz); // Store quiz info for dialog
    } catch (err) {
      alert('Failed to create demo quiz.');
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-between overflow-auto p-4 md:p-8">
      <Navbar onLoginClick={() => setShowLoginModal(true)} />
      <AnimatedHomeBackground />
      <main className="flex-1 z-10 relative">
        {/* Features Section */}
        {/* Hero Section */}
        <div className="text-center py-16 animate-fade-in">
          <div className="flex justify-center mb-6 animate-bounce-slow">
            <span className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 shadow-lg animate-pop">
              <Sparkles size={56} className="text-white drop-shadow-lg" />
          </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight animate-gradient-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            Welcome to PromptQuiz
        </h1>
          <p className="text-2xl text-gray-700 mb-10 max-w-3xl mx-auto animate-fade-in delay-100">
            Create <span className="font-bold text-blue-600">AI-powered quizzes</span> in seconds and host <span className="font-bold text-purple-600">real-time competitions</span> with friends, colleagues, or students.
        </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-pop mb-12">
          {isAuthenticated && !isGuest ? (
            <Link to="/create" className="btn-primary text-xl px-10 py-4 flex items-center justify-center space-x-2 animate-pop">
              <Play size={24} />
              <span>Create Quiz</span>
            </Link>
          ) : (
            <button
              onClick={() => {
                if (isGuest) {
                  setError('You need to create an account to create a quiz.');
                  setSignupPrompt(true); // Show signup prompt dialog only
                } else {
                  setShowLoginModal(true);
                  setActiveTab('register');
                }
              }}
              className="btn-primary text-xl px-10 py-4 flex items-center justify-center space-x-2 animate-pop"
            >
              <Play size={24} />
              <span>Create Quiz</span>
            </button>
          )}
            <button onClick={handleJoinDemoQuiz} className="btn-secondary text-xl px-10 py-4 flex items-center justify-center space-x-2 animate-pop delay-100">
              <Users size={24} />
              <span>Join Demo Quiz</span>
            </button>
            <button onClick={() => setShowJoinQuizDialog(true)} className="btn-secondary text-xl px-10 py-4 flex items-center justify-center space-x-2 animate-pop delay-200">
              <ArrowRight size={24} />
              <span>Join Quiz</span>
            </button>
        </div>
      </div>

      {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 py-20 animate-fade-in delay-200" style={{ marginTop: '-2px' }}>
          <div className="card card-hover text-center animate-pop">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
              <Zap className="text-blue-600" size={28} />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">AI-Powered</h3>
            <p className="text-gray-600 text-lg">
              Generate engaging quizzes on any topic using advanced AI technology. Just enter a topic and let our AI create questions for you.
            </p>
          </div>
          <div className="card card-hover text-center animate-pop delay-100">
            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
              <Users className="text-green-600" size={28} />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Real-Time</h3>
            <p className="text-gray-600 text-lg">
              Host live quiz competitions with synchronized questions, timers, and instant leaderboards. Everyone sees the same questions at the same time.
            </p>
          </div>
          <div className="card card-hover text-center animate-pop delay-200">
            <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
              <Award className="text-purple-600" size={28} />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Registration</h3>
            <p className="text-gray-600 text-lg">
              Join quizzes instantly with just your name. No account required for participants. Perfect for quick classroom activities or casual competitions.
            </p>
          </div>
        </div>

      {/* How It Works */}
      <div className="relative flex-1 animate-fade-in delay-300 mt-0 mb-0">
        <div className="p-8 h-full flex flex-col justify-center bg-white rounded-xl">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-10 animate-pop">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              "Create Quiz", "Share Link", "Join & Play", "Live Results"
            ].map((step, idx) => (
              <div className="text-center animate-pop" style={{ animationDelay: `${idx * 100}ms` }} key={step}>
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
                  <span className="text-white font-bold text-3xl">{idx + 1}</span>
                </div>
                <h3 className="font-semibold text-2xl text-gray-900 mb-2">{step}</h3>
                <p className="text-gray-600 text-lg">
                  {[
                    'Enter a topic, set questions and time limit',
                    'Share the unique quiz link with participants',
                    'Participants join with their name and wait for start',
                    'Real-time leaderboard and final results',
                  ][idx]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      </main>
      {/* Footer Placeholder */}
      <Footer />
      {/* Login Modal */}
      {showLoginModal && !error && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in"
          onClick={isAuthenticated ? () => setShowLoginModal(false) : undefined}
        >
          <div 
            className="relative animate-modal-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <LoginModal
              onClose={() => setShowLoginModal(false)}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              loading={loading}
              error={error}
              setError={(err) => {
                setError(err);
                if (!err) setSignupPrompt(false);
              }}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              loginData={loginData}
              setLoginData={setLoginData}
              registerData={registerData}
              setRegisterData={setRegisterData}
              guestData={guestData}
              setGuestData={setGuestData}
              handleLogin={handleLogin}
              handleRegister={handleRegister}
              handleGuestLogin={handleGuestLogin}
              isAuthenticated={isAuthenticated}
              onSignupFromError={() => {
                setShowLoginModal(true);
                setActiveTab('register');
                setError('');
                setSignupPrompt(false);
                setHideTabs(true);
              }}
              signupPrompt={signupPrompt}
              hideTabs={hideTabs}
            />
            {showAccountCreatedDialog && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
                <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center">
                  <div className="text-green-600 text-2xl font-bold mb-2">Account Created</div>
                  <div className="text-gray-700 text-center mb-4">Account created successfully! Please log in.</div>
                  <button
                    className="btn-primary w-full"
                    onClick={() => setShowAccountCreatedDialog(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
          <style>{`
            .animate-modal-pop {
              animation: modalPop 0.4s cubic-bezier(.68,-0.55,.27,1.55);
            }
            @keyframes modalPop {
              0% { transform: scale(0.8); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      )}
      {showWelcomeDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center">
            <div className="text-blue-600 text-2xl font-bold mb-2">Welcome to PromptQuiz!</div>
            <div className="text-gray-700 text-center mb-4">You have successfully logged in.</div>
            <button
              className="btn-primary w-full"
              onClick={() => setShowWelcomeDialog(false)}
            >
              Continue
            </button>
          </div>
        </div>
      )}
      {showJoinQuizDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center">
            <div className="text-blue-600 text-2xl font-bold mb-2">Join Quiz</div>
            <form onSubmit={handleJoinQuizSubmit} className="w-full flex flex-col items-center">
              <input
                type="text"
                value={joinQuizCode}
                onChange={e => setJoinQuizCode(e.target.value)}
                className="input-field mb-4 w-full"
                placeholder="Enter Quiz Code"
                required
              />
              <button type="submit" className="btn-primary w-full mb-2">Join</button>
              <button type="button" className="btn-secondary w-full" onClick={() => setShowJoinQuizDialog(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
      {demoQuizInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center">
            <div className="text-blue-600 text-2xl font-bold mb-2">{demoQuizInfo.title}</div>
            <div className="text-gray-700 text-center mb-4">Time Limit: {demoQuizInfo.timeLimit} seconds</div>
            <button
              className="btn-primary w-full mb-2"
              onClick={() => {
                setDemoQuizInfo(null);
                navigate(`/join/${demoQuizInfo.roomId}`);
              }}
            >
              Start
            </button>
            <button
              className="btn-secondary w-full"
              onClick={() => setDemoQuizInfo(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {/* Error Dialog for Guest Create Quiz */}
      {error && signupPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
          <div className="relative w-full max-w-md mx-auto rounded-3xl shadow-2xl overflow-hidden animate-modal-pop-glass bg-white/60 backdrop-blur-2xl border border-white/30 flex flex-col items-center p-0">
            {/* Animated Gradient Border */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="absolute -top-8 -left-8 w-72 h-72 bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 opacity-30 rounded-full blur-3xl animate-glow" />
              <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-gradient-to-br from-pink-300 via-blue-200 to-purple-200 opacity-30 rounded-full blur-2xl animate-glow delay-200" />
            </div>
            <div className="w-full flex flex-col items-center px-8 pt-10 pb-8 z-10">
              <div className="flex items-center justify-center mb-2 animate-pop">
                <AlertTriangle size={36} className="text-yellow-500" />
              </div>
              <div className="text-gray-700 text-center mb-6 text-lg animate-fade-in delay-100">{error}</div>
              <button
                className="w-full mb-3 py-3 rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 font-bold text-lg shadow hover:from-gray-300 hover:to-gray-400 transition animate-pop"
                onClick={() => {
                  setError('');
                  setSignupPrompt(false);
                }}
              >
                Close
              </button>
              <button
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg shadow-xl hover:from-blue-600 hover:to-purple-600 transition animate-pop delay-100"
                onClick={() => {
                  setShowLoginModal(true);
                  setActiveTab('register');
                  setError('');
                  setSignupPrompt(false);
                  setHideTabs(true); // Hide tabs for this flow
                }}
              >
                Sign Up
              </button>
            </div>
            {/* Custom Animations */}
            <style>{`
              .animate-modal-pop-glass {
                animation: modalPopGlass 0.5s cubic-bezier(.68,-0.55,.27,1.55);
              }
              @keyframes modalPopGlass {
                0% { transform: scale(0.7) translateY(60px); opacity: 0; }
                100% { transform: scale(1) translateY(0); opacity: 1; }
              }
              .animate-glow {
                animation: glowPulse 2.5s infinite alternate;
              }
              @keyframes glowPulse {
                0% { opacity: 0.2; filter: blur(24px); }
                100% { opacity: 0.5; filter: blur(32px); }
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home; 

import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const LoginModal = ({ activeTab, setActiveTab, loading, error, setError, showPassword, setShowPassword, loginData, setLoginData, registerData, setRegisterData, guestData, setGuestData, handleLogin, handleRegister, handleGuestLogin, onClose, isAuthenticated, onSignupFromError, signupPrompt, hideTabs, setHideTabs = () => {} }) => {
  return (
    <div className="w-[95vw] max-w-2xl z-30 flex flex-col items-center justify-center bg-white/80 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-3xl p-0 relative overflow-hidden animate-modal-pop-lg">
      {/* Animated Gradient Glow */}
      <div className="absolute -inset-2 z-0 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 opacity-30 rounded-full blur-3xl animate-glow" />
        <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-gradient-to-br from-pink-300 via-blue-200 to-purple-200 opacity-30 rounded-full blur-2xl animate-glow delay-200" />
      </div>
      {/* Close Button */}
      <button onClick={onClose} className="absolute top-2 right-2 z-50 bg-white/80 rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all text-2xl font-bold text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center w-10 h-10">
        &times;
      </button>
      {/* Welcome Section */}
      {activeTab === 'welcome' && (
        <div className="text-center animate-fade-in m-0 p-0 z-10">
          <div className="flex justify-center mb-6 mt-10"> {/* Increased top margin for spacing */}
            <span className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 shadow-2xl animate-pop">
              <Sparkles size={60} className="text-white drop-shadow-lg animate-spin-slow" />
            </span>
          </div>
          <h2 className="text-5xl font-extrabold text-gray-900 mb-2 tracking-tight animate-gradient-text bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to PromptQuiz
          </h2>
          <p className="mt-2 text-2xl text-gray-700 mb-10 animate-fade-in delay-100">Create, play, and compete in AI-powered quizzes!</p>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => { setActiveTab('register'); setHideTabs(true); }}
              className="btn-primary w-full py-4 text-xl font-semibold shadow-lg transform transition hover:scale-105 hover:shadow-2xl animate-pop"
            >
              Register
            </button>
            <button
              onClick={() => setActiveTab('guest')}
              className="btn-secondary w-full py-4 text-xl font-semibold shadow-lg transform transition hover:scale-105 hover:shadow-2xl animate-pop delay-100"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      )}
      {/* Tab Navigation */}
      {!hideTabs && activeTab !== 'welcome' && activeTab !== 'register' && (
        <div className="flex rounded-2xl bg-white/60 backdrop-blur p-2 mb-6 mt-4 shadow-inner animate-fade-in z-10">
          {['guest', 'login', 'register'].map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-8 rounded-xl text-lg font-medium transition-all duration-300 mx-1
                ${activeTab === tab ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105 animate-tab-pop' : 'text-gray-700 hover:text-blue-600 bg-transparent'}`}
            >
              {tab === 'guest' ? 'Guest' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      )}
      {/* Animated Forms */}
      <div className="w-full flex-1 flex flex-col items-center justify-center px-8 py-6 z-10">
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-8 w-full max-w-lg mx-auto animate-slide-up shadow-xl bg-white/90 rounded-2xl p-8">
            <div>
              <label htmlFor="email" className="block text-lg font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                id="email"
                type="email"
                required
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="input-field py-3 text-lg animate-input-focus"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-lg font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="input-field pr-12 py-3 text-lg animate-input-focus"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center text-xl py-3 rounded-xl animate-pop shadow-lg"
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        )}
        {activeTab === 'register' && (
          <>
            {hideTabs && (
              <button
                onClick={() => { setActiveTab('login'); setHideTabs(false); }}
                className="mb-4 text-blue-600 hover:underline text-base font-medium"
                type="button"
              >
                Already have an account? Login
              </button>
            )}
            <form onSubmit={async (e) => { await handleRegister(e); setHideTabs && setHideTabs(false); setActiveTab('login'); }} className="space-y-6 w-full max-w-md mx-auto animate-slide-up shadow-xl bg-white/90 rounded-2xl p-6">
              <div>
                <label htmlFor="username" className="block text-base font-semibold text-gray-700 mb-1">Username</label>
                <input
                  id="username"
                  type="text"
                  required
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                  className="input-field py-2 text-base animate-input-focus"
                  placeholder="Choose a username"
                />
              </div>
              <div>
                <label htmlFor="reg-email" className="block text-base font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="input-field py-2 text-base animate-input-focus"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="reg-password" className="block text-base font-semibold text-gray-700 mb-1">Password</label>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="input-field py-2 text-base animate-input-focus"
                  placeholder="Create a password"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-base font-semibold text-gray-700 mb-1">Confirm Password</label>
                <input
                  id="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  className="input-field py-2 text-base animate-input-focus"
                  placeholder="Confirm your password"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center text-lg py-2 rounded-xl animate-pop shadow-lg"
              >
                {loading ? (
                  <div className="spinner"></div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          </>
        )}
        {activeTab === 'guest' && (
          <form onSubmit={handleGuestLogin} className="space-y-8 w-full max-w-lg mx-auto animate-slide-up shadow-xl bg-white/90 rounded-2xl p-8">
            <div>
              <label htmlFor="guest-username" className="block text-lg font-semibold text-gray-700 mb-2">Display Name</label>
              <input
                id="guest-username"
                type="text"
                required
                value={guestData.username}
                onChange={(e) => setGuestData({ ...guestData, username: e.target.value })}
                className="input-field py-3 text-lg animate-input-focus"
                placeholder="Enter your name"
                minLength={2}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center text-xl py-3 rounded-xl animate-pop shadow-lg"
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                'Continue as Guest'
              )}
            </button>
          </form>
        )}
      </div>
      {/* Custom Animations */}
      <style>{`
        .animate-modal-pop-lg {
          animation: modalPopLg 0.5s cubic-bezier(.68,-0.55,.27,1.55);
        }
        @keyframes modalPopLg {
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
        .animate-spin-slow {
          animation: spin 6s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoginModal; 
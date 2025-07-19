import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Sparkles } from 'lucide-react';

// Animated background using Tailwind and keyframes
const AnimatedBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute top-0 left-1/2 w-[120vw] h-[120vw] -translate-x-1/2 bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 opacity-30 animate-spin-slow rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-300 via-blue-200 to-purple-200 opacity-40 rounded-full blur-2xl animate-pulse"></div>
  </div>
);

const tabAnimations = {
  login: 'animate-fade-in',
  register: 'animate-fade-in',
  guest: 'animate-fade-in',
};

const LoginModal = ({ activeTab, setActiveTab, loading, error, setError, showPassword, setShowPassword, loginData, setLoginData, registerData, setRegisterData, guestData, setGuestData, handleLogin, handleRegister, handleGuestLogin }) => {
  return (
    <div className="max-w-md w-full z-20 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
      {/* Animated Welcome Section */}
      {activeTab === 'welcome' && (
        <div className="text-center animate-fade-in m-0 p-0">
          <div className="flex justify-center mb-4 m-0 p-0">
            <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 shadow-lg animate-bounce-slow">
              <Sparkles size={48} className="text-white drop-shadow-lg" />
            </span>
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">PromptQuiz</span>
          </h2>
          <p className="mt-2 text-lg text-gray-600 mb-8">Create, play, and compete in AI-powered quizzes!</p>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setActiveTab('login')}
              className="btn-primary w-full py-3 text-lg font-semibold shadow-md transform transition hover:scale-105 hover:shadow-xl animate-pop"
            >
              Login / Register
            </button>
            <button
              onClick={() => setActiveTab('guest')}
              className="btn-secondary w-full py-3 text-lg font-semibold shadow-md transform transition hover:scale-105 hover:shadow-xl animate-pop delay-100"
            >
              Continue as Guest
            </button>
          </div>
          <div className="mt-8">
            <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 transition">
              <ArrowLeft size={20} className="mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      )}

      {/* Tab Navigation (hidden on welcome) */}
      {activeTab !== 'welcome' && (
        <div className="flex rounded-lg bg-gray-100 p-1 mb-2 animate-fade-in">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'login'
                ? 'bg-white text-blue-600 shadow-sm animate-tab-pop'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'register'
                ? 'bg-white text-blue-600 shadow-sm animate-tab-pop'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Register
          </button>
          <button
            onClick={() => setActiveTab('guest')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'guest'
                ? 'bg-white text-blue-600 shadow-sm animate-tab-pop'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Guest
          </button>
          <button
            onClick={() => setActiveTab('welcome')}
            className="ml-2 px-3 py-2 text-xs text-gray-400 hover:text-gray-700 transition"
          >
            Back
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-shake">
          {error}
        </div>
      )}

      {/* Login Form */}
      {activeTab === 'login' && (
        <form onSubmit={handleLogin} className={`space-y-6 ${tabAnimations.login}`}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="email"
                type="email"
                required
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="input-field pl-10 animate-input-focus"
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="input-field pl-10 pr-10 animate-input-focus"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center animate-pop"
          >
            {loading ? (
              <div className="spinner"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      )}

      {/* Register Form */}
      {activeTab === 'register' && (
        <form onSubmit={handleRegister} className={`space-y-6 ${tabAnimations.register}`}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="username"
                type="text"
                required
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                className="input-field pl-10 animate-input-focus"
                placeholder="Choose a username"
              />
            </div>
          </div>
          <div>
            <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="reg-email"
                type="email"
                required
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                className="input-field pl-10 animate-input-focus"
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div>
            <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                className="input-field pl-10 pr-10 animate-input-focus"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="confirm-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                className="input-field pl-10 animate-input-focus"
                placeholder="Confirm your password"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center animate-pop"
          >
            {loading ? (
              <div className="spinner"></div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      )}

      {/* Guest Form */}
      {activeTab === 'guest' && (
        <form onSubmit={handleGuestLogin} className={`space-y-6 ${tabAnimations.guest}`}>
          <div className="text-center mb-6">
            <p className="text-gray-600 animate-fade-in">
              Join as a guest to create quizzes without creating an account. 
              Your quizzes will be available for 24 hours.
            </p>
          </div>
          <div>
            <label htmlFor="guest-username" className="block text-sm font-medium text-gray-700 mb-2">
              Display Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="guest-username"
                type="text"
                required
                value={guestData.username}
                onChange={(e) => setGuestData({ ...guestData, username: e.target.value })}
                className="input-field pl-10 animate-input-focus"
                placeholder="Enter your name"
                minLength={2}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center animate-pop"
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
  );
};

// This file is now deprecated. Login functionality is handled by the modal on the Home page.
 
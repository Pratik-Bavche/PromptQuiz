import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, User, LogOut, Plus, Home, Sparkles, Camera, Mail, Edit2 } from 'lucide-react';

const Navbar = (props) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [editableName, setEditableName] = useState(user?.username || '');
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  const handleLogout = () => {
    logout();
    setShowProfile(false);
    navigate('/');
  };

  // Modal close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('profile-modal-backdrop')) {
      setShowProfile(false);
    }
  };

  // Handle profile picture upload
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setProfilePic(ev.target.result);
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveProfilePic = () => setProfilePic(null);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 shadow-sm border-b border-gray-200 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 relative">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group animate-pop">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg animate-bounce-slow">
              <Sparkles size={28} className="text-white drop-shadow-lg animate-spin-slow" />
            </div>
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent animate-gradient-text group-hover:scale-105 transition-transform">PromptQuiz</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/"
              className="flex items-center space-x-1 px-5 py-2 rounded-lg border-2 border-blue-500 bg-white text-blue-600 font-semibold shadow-sm hover:bg-blue-50 hover:text-blue-700 transition-colors animate-pop"
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            {isAuthenticated ? (
              <div className="relative animate-pop delay-200">
                <button
                  className={`flex items-center justify-center w-11 h-11 rounded-full border-2 border-blue-200 bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100 shadow-md hover:shadow-lg hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${showProfile ? 'ring-2 ring-blue-400 bg-blue-50 border-blue-400' : ''}`}
                  onClick={() => setShowProfile(true)}
                  aria-label="Profile"
                >
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <User size={26} className={showProfile ? 'text-blue-700' : 'text-blue-600'} />
                  )}
                </button>
              </div>
            ) : (
              <button 
                className="btn-primary flex items-center space-x-2 animate-pop delay-200"
                onClick={props.onLoginClick}
              >
                <User size={18} className="text-white" />
                <span>Login / Guest</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600 animate-pop"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Profile Modal Dialog */}
        {showProfile && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 profile-modal-backdrop animate-fade-in"
            onClick={handleBackdropClick}
          >
            <input
              ref={inputRef}
              id="profile-pic-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePicChange}
            />
            <div className="relative w-full max-w-md mx-auto rounded-3xl shadow-2xl overflow-hidden animate-modal-pop-glass bg-white/60 backdrop-blur-2xl border border-white/30 flex flex-col items-center p-0">
              {/* Animated Gradient Border */}
              <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute -top-8 -left-8 w-72 h-72 bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 opacity-30 rounded-full blur-3xl animate-glow" />
                <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-gradient-to-br from-pink-300 via-blue-200 to-purple-200 opacity-30 rounded-full blur-2xl animate-glow delay-200" />
              </div>
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none z-10 bg-white/80 rounded-full p-3 shadow-lg flex items-center justify-center w-10 h-10"
                onClick={() => setShowProfile(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <div className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-36 flex flex-col items-center justify-end relative">
                <div
                  className="relative -mb-20 z-10 flex flex-col items-center"
                  style={{ pointerEvents: 'auto' }}
                >
                  <div
                    className="w-36 h-36 rounded-full bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center shadow-2xl border-8 border-white/80 ring-4 ring-blue-300 animate-avatar-float"
                    style={{ pointerEvents: 'auto' }}
                    title="Profile picture"
                  >
                    {profilePic ? (
                      <img src={profilePic} alt="Profile" className="w-32 h-32 rounded-full object-cover shadow-xl" />
                    ) : (
                      <User size={80} className="text-white" />
                    )}
                  </div>
                  {/* Camera icon and file input removed as per user request */}
                  {profilePic && (
                    <button
                      className="absolute bottom-3 left-3 bg-white rounded-full p-2 shadow hover:bg-red-100 transition border border-gray-200"
                      onClick={handleRemoveProfilePic}
                      title="Remove Photo"
                      type="button"
                    >
                      <X size={22} className="text-red-500" />
                    </button>
                  )}
                </div>
              </div>
              <div className="w-full flex flex-col items-center px-8 pt-24 pb-10 z-10">
                <div className="w-full flex flex-col items-center mb-4">
                  <span className="text-gray-500 text-lg font-semibold mb-1">Name</span>
                  <input
                    type="text"
                    value={editableName || user?.username || ''}
                    onChange={e => setEditableName(e.target.value)}
                    className="text-center text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-gray-200 focus:border-blue-400 outline-none w-full max-w-xs px-2 py-1 transition"
                    style={{ minWidth: 0 }}
                  />
                </div>
                {!user?.isGuest && (
                  <div className="w-full flex flex-col items-center mb-4">
                    <span className="text-gray-500 text-lg font-semibold mb-1">Email</span>
                    <div className="text-lg text-gray-700 text-center w-full break-words">{user?.email}</div>
                  </div>
                )}
                {user?.isGuest && (
                  <div className="text-base text-purple-500 font-semibold mb-4">Guest</div>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-xl shadow-xl hover:from-blue-600 hover:to-purple-600 transition flex items-center justify-center space-x-2 animate-pop"
                >
                  <LogOut size={22} />
                  <span>Logout</span>
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
                .animate-avatar-float {
                  animation: avatarFloat 2.5s infinite alternate cubic-bezier(.68,-0.55,.27,1.55);
                }
                @keyframes avatarFloat {
                  0% { transform: translateY(0); }
                  100% { transform: translateY(-10px) scale(1.04); }
                }
              `}</style>
            </div>
          </div>
        )}
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/"
                className="btn-secondary flex items-center space-x-2 animate-pop"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
              {isAuthenticated ? (
                <div className="flex flex-col space-y-2 animate-pop delay-200">
                  <button
                    className={`flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${showProfile ? 'ring-2 ring-blue-400 bg-blue-50' : ''}`}
                    onClick={() => setShowProfile(true)}
                  >
                    <User size={18} className={showProfile ? 'text-blue-700' : 'text-blue-600'} />
                    <span className="font-semibold text-gray-800">
                      {user?.username}
                      {user?.isGuest && ' (Guest)'}
                    </span>
                  </button>
                </div>
              ) : (
                <button 
                  className="btn-primary w-full flex items-center justify-center space-x-2 text-center animate-pop delay-200"
                  onClick={() => { setIsMenuOpen(false); props.onLoginClick && props.onLoginClick(); }}
                >
                  <User size={18} className="text-white" />
                  <span>Login / Guest</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Custom Animations */}
      <style>{`
        .animate-spin-slow { animation: spin 18s linear infinite; }
        .animate-pop { animation: popIn 0.5s cubic-bezier(.68,-0.55,.27,1.55); }
        .animate-fade-in { animation: fadeIn 0.7s ease; }
        .animate-gradient-bar { background-size: 200% 200%; animation: gradientMove 3s ease-in-out infinite alternate; }
        .animate-gradient-text { background-size: 200% 200%; animation: gradientMove 3s ease-in-out infinite alternate; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes popIn { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes gradientMove { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
      `}</style>
    </nav>
  );
};

export default Navbar; 
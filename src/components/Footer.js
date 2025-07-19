import React from 'react';
import { Sparkles, Github, Twitter, Globe } from 'lucide-react';

const Footer = () => (
  <footer className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-t border-gray-200 py-2 z-40 shadow-lg">
    <div className="max-w-6xl mx-auto px-4 flex items-center justify-between animate-fade-in">
      <span className="flex items-center space-x-3 animate-pop">
          <a href="https://www.linkedin.com/in/pratik-bavche-b6b696325/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 text-xl"><i className="fab fa-linkedin"></i></a>
          <a href="https://facebook.com/pratik_bavche_patil" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xl"><i className="fab fa-facebook-f"></i></a>
          <a href="https://x.com/Pratik_Bavche" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 text-xl"><i className="fab fa-twitter"></i></a>
          <a href="https://github.com/Pratik-Bavche" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-black text-xl"><i className="fab fa-github"></i></a>
          <a href="https://instagram.com/pratik_bavche_patil" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-700 text-xl"><i className="fab fa-instagram"></i></a>
        </span>
        <span className="text-gray-500 text-sm animate-pop">&copy; {new Date().getFullYear()} PromptQuiz. All rights reserved.</span>
    </div>
    {/* Custom Animations */}
    <style>{`
      .animate-bounce-slow { animation: bounce 2.5s infinite; }
      .animate-pop { animation: popIn 0.5s cubic-bezier(.68,-0.55,.27,1.55); }
      .animate-fade-in { animation: fadeIn 0.7s ease; }
      .animate-gradient-text { background-size: 200% 200%; animation: gradientMove 3s ease-in-out infinite alternate; }
      @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      @keyframes popIn { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes gradientMove { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
    `}</style>
  </footer>
);

export default Footer; 
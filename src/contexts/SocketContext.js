import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (user && token) {
      // Initialize socket connection
      socketRef.current = io('http://localhost:5000', {
        auth: {
          token
        }
      });

      // Socket event listeners
      socketRef.current.on('connect', () => {
        console.log('Connected to server');
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      socketRef.current.on('error', (error) => {
        console.error('Socket error:', error);
      });

      // Cleanup on unmount
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [user, token]);

  const joinQuiz = (roomId, participantName) => {
    if (socketRef.current) {
      socketRef.current.emit('join-quiz', { roomId, participantName });
    }
  };

  const startQuiz = (roomId) => {
    if (socketRef.current) {
      socketRef.current.emit('start-quiz', { roomId });
    }
  };

  const submitAnswer = (roomId, questionIndex, selectedAnswer, timeSpent) => {
    if (socketRef.current) {
      socketRef.current.emit('submit-answer', {
        roomId,
        questionIndex,
        selectedAnswer,
        timeSpent
      });
    }
  };

  const onQuizState = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('quiz-state', callback);
    }
  };

  const onParticipantJoined = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('participant-joined', callback);
    }
  };

  const onQuizStarted = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('quiz-started', callback);
    }
  };

  const onQuestion = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('question', callback);
    }
  };

  const onQuizCompleted = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('quiz-completed', callback);
    }
  };

  const onError = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('error', callback);
    }
  };

  const offEvent = (eventName) => {
    if (socketRef.current) {
      socketRef.current.off(eventName);
    }
  };

  const value = {
    socket: socketRef.current,
    joinQuiz,
    startQuiz,
    submitAnswer,
    onQuizState,
    onParticipantJoined,
    onQuizStarted,
    onQuestion,
    onQuizCompleted,
    onError,
    offEvent
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}; 
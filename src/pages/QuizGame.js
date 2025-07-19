import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import { Clock, CheckCircle, XCircle, Trophy } from 'lucide-react';
import axios from 'axios';

const QuizGame = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { submitAnswer, onQuestion, onQuizCompleted, offEvent, joinQuiz } = useSocket();
  
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [results, setResults] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [isDemoQuiz, setIsDemoQuiz] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetchQuizDetails();
  }, [roomId]);

  const fetchQuizDetails = async () => {
    try {
      const response = await axios.get(`/api/quiz/room/${roomId}`);
      const quizData = response.data.quiz;
      console.log('Quiz data received:', quizData);
      setQuiz(quizData);
      
      // Check if this is a demo quiz
      if (quizData.hostId === 'demo') {
        console.log('Demo quiz detected, starting immediately');
        setIsDemoQuiz(true);
        // For demo quizzes, start immediately with first question
        if (quizData.questions && quizData.questions.length > 0) {
          console.log('Questions found:', quizData.questions.length);
          const firstQuestion = quizData.questions[0];
          console.log('First question:', firstQuestion);
          setCurrentQuestion({
            question: firstQuestion.question,
            options: firstQuestion.options,
            correctAnswer: firstQuestion.correctAnswer,
            timeLimit: quizData.timeLimit
          });
          // Start the timer only once for the entire quiz
          setTimeLeft(quizData.timeLimit);
        } else {
          console.log('No questions found in demo quiz');
        }
      } else {
        console.log('Regular quiz detected, waiting for socket events');
      }
    } catch (error) {
      console.error('Failed to fetch quiz details:', error);
    }
  };

  useEffect(() => {
    // Set up socket listeners only for non-demo quizzes
    if (!isDemoQuiz) {
      onQuestion((data) => {
        setCurrentQuestion(data);
        setQuestionIndex(data.questionIndex);
        setSelectedAnswer(null);
        setAnswered(false);
        setTimeLeft(data.timeLimit);
      });

      onQuizCompleted((data) => {
        setGameCompleted(true);
        setResults(data);
      });

      // Cleanup
      return () => {
        offEvent('question');
        offEvent('quiz-completed');
      };
    }
  }, [isDemoQuiz]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !answered) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !answered && currentQuestion) {
      // Auto-submit when time runs out
      if (isDemoQuiz) {
        // For demo quizzes, auto-submit only if an answer is selected
        if (selectedAnswer !== null) {
          handleSubmitAnswer(selectedAnswer);
        } else {
          handleSubmitAnswer(null);
        }
        // If this is the final question, immediately submit the quiz
        if (questionIndex === quiz.questions.length - 1) {
          handleSubmitQuiz();
        }
      } else {
        if (selectedAnswer !== null) {
          handleSubmitAnswer(selectedAnswer);
        } else {
          handleSubmitAnswer(null);
        }
      }
    }
  }, [timeLeft, answered, currentQuestion, selectedAnswer, isDemoQuiz, questionIndex, quiz]);

  const handleSubmitAnswer = (answerIndex) => {
    if (answered || !currentQuestion) return;

    setSelectedAnswer(answerIndex);
    setAnswered(true);

    // Store the answer
    const newUserAnswers = [...userAnswers];
    newUserAnswers[questionIndex] = {
      questionIndex,
      selectedAnswer: answerIndex,
      isCorrect: answerIndex !== null && answerIndex === currentQuestion.correctAnswer,
      question: currentQuestion.question,
      options: currentQuestion.options,
      correctAnswer: currentQuestion.correctAnswer
    };
    setUserAnswers(newUserAnswers);

    if (isDemoQuiz) {
      // For demo quizzes, check if this is the final question
      if (questionIndex === quiz.questions.length - 1) {
        // Final question - show submit button
        setShowSubmitButton(true);
      } else {
        // Not final question - move to next after delay
        setTimeout(() => {
          moveToNextQuestion();
        }, 2000); // 2 second delay to show correct answer
      }
    } else {
      // Submit answer to server for regular quizzes
      submitAnswer(roomId, questionIndex, answerIndex, currentQuestion.timeLimit - timeLeft);
    }
  };

  const handleSubmitQuiz = () => {
    // Calculate final score
    const correctAnswers = userAnswers.filter(answer => answer.selectedAnswer !== null && answer.isCorrect).length;
    const totalQuestions = quiz.questions.length;
    
    setResults({
      score: correctAnswers,
      totalQuestions: totalQuestions,
      userAnswers: userAnswers
    });
    setShowResults(true);
  };

  const moveToNextQuestion = () => {
    if (!quiz || !quiz.questions) return;

    const nextIndex = questionIndex + 1;
    
    if (nextIndex >= quiz.questions.length) {
      // Quiz completed - this shouldn't happen for demo quizzes now
      setGameCompleted(true);
      setResults({
        participants: quiz.participants,
        totalQuestions: quiz.questions.length
      });
    } else {
      // Move to next question
      const nextQuestion = quiz.questions[nextIndex];
      setCurrentQuestion({
        question: nextQuestion.question,
        options: nextQuestion.options,
        correctAnswer: nextQuestion.correctAnswer,
        timeLimit: quiz.timeLimit
      });
      setQuestionIndex(nextIndex);
      setSelectedAnswer(null);
      setAnswered(false);
      // Don't reset the timer - let it continue from where it left off
      setShowSubmitButton(false); // Reset submit button
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getOptionClass = (index) => {
    if (!answered) {
      return selectedAnswer === index 
        ? 'bg-blue-100 border-blue-500' 
        : 'bg-white hover:bg-gray-50 border-gray-200';
    }
    
    // Show correct/incorrect answers
    const isCorrect = index === currentQuestion?.correctAnswer;
    const isSelected = selectedAnswer === index;
    
    if (isCorrect) {
      return 'bg-green-100 border-green-500';
    } else if (isSelected && !isCorrect) {
      return 'bg-red-100 border-red-500';
    } else {
      return 'bg-gray-100 border-gray-200 opacity-50';
    }
  };

  if (showResults && results) {
    const percent = Math.round((results.score / results.totalQuestions) * 100);
    const radius = 48;
    const stroke = 10;
    const normalizedRadius = radius - stroke / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const progress = circumference - (percent / 100) * circumference;
    return (
      <div className="flex justify-center items-center bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 min-h-[calc(100vh-112px)] pt-4 pb-3">
        <div className="card w-full max-w-xl py-4 px-4 shadow-lg rounded-2xl flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="text-yellow-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
          <p className="text-gray-600 mb-6">Here are your results</p>
          <div className="mb-4 flex flex-col items-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{results.score}/{results.totalQuestions}</div>
            <div className="text-xl text-gray-600 mb-2">Correct Answers</div>
            <div className="relative w-28 h-28 flex items-center justify-center mb-2">
              <svg width="112" height="112">
                <circle
                  cx="56"
                  cy="56"
                  r={normalizedRadius}
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth={stroke}
                />
                <circle
                  cx="56"
                  cy="56"
                  r={normalizedRadius}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth={stroke}
                  strokeDasharray={circumference}
                  strokeDashoffset={progress}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">{percent}%</span>
                <span className="text-sm text-gray-500">Score</span>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <button
              onClick={() => navigate('/')} 
              className="btn-primary"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameCompleted && results) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 overflow-hidden pt-16 pb-10">
        <div className="card text-center max-h-[calc(100vh-96px)] overflow-auto">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="text-yellow-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
          <p className="text-gray-600 mb-6">Here are the final results</p>
          
          <div className="space-y-4">
            {results.participants.map((participant, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-500' : 'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{participant.name}</div>
                    <div className="text-sm text-gray-600">
                      {participant.score}/{results.totalQuestions} correct
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{participant.score}</div>
                  <div className="text-sm text-gray-600">
                    {Math.floor(participant.timeTaken / 1000)}s
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8">
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 overflow-hidden pt-16 pb-10">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Waiting for questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 pb-24">
        <div className="fixed left-1/2 -translate-x-1/2 top-20 w-full max-w-4xl z-10">
          <div className="card py-0 px-12 shadow-lg rounded-2xl">
          {/* Quiz Title */}
          {quiz && (
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
              <p className="text-gray-600">Topic: {quiz.topic}</p>
            </div>
          )}
          
          {/* Header */}
          <div className="flex items-center justify-between mb-[3px]">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Question {questionIndex + 1}</h2>
              <p className="text-gray-500">Select the correct answer</p>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="text-gray-400" size={20} />
              <span className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-gray-900'}`}>{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Question */}
          <div className="mb-[3px]">
            <h3 className="text-xl font-medium text-gray-900 mb-2 leading-relaxed">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSubmitAnswer(index)}
                disabled={answered}
                className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${getOptionClass(index)}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === index 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswer === index && (
                      <CheckCircle className="text-white" size={16} />
                    )}
                  </div>
                  <span className="font-medium text-gray-900">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Submit Button for Final Question */}
          {showSubmitButton && answered && (
            <div className="mb-6">
              <button
                onClick={handleSubmitQuiz}
                className="btn-primary w-full py-4 text-lg font-semibold"
              >
                Submit Quiz & View Results
              </button>
            </div>
          )}

          {/* Progress */}
          {!showResults && (
            <>
              <div className="text-center text-sm text-gray-600">
                Question {questionIndex + 1} of 10
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizGame;
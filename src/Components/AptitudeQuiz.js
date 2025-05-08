import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CheckCircle2, AlertCircle, Timer, ClipboardList, ChevronLeft,
  ChevronRight, Flag, CheckCircle, AlertTriangle, Loader2,
  BookOpen, User, Settings, Home, BarChart2, Clock, Award, HelpCircle
} from "lucide-react";

const AptitudeQuiz = ({ setAptiStatus, setusn, uname, usn, sub_name, stdname }) => {
  // State management
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes
  const [quizStatus, setQuizStatus] = useState("not_started");
  const [startTime, setStartTime] = useState(null);
  const [attemptNumber, setAttemptNumber] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showQuestionNav, setShowQuestionNav] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [maxAttemptsReached, setMaxAttemptsReached] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const questionsPerPage = 1; // Show 3 questions at a time
  const MAX_ATTEMPTS = 3;

  // Timer effect
  useEffect(() => {
    let timer;
    if (quizStatus === "started" && timeRemaining > 0) {
      timer = setInterval(() => setTimeRemaining(prev => prev - 1), 1000);
    } else if (quizStatus === "started" && timeRemaining === 0) {
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [quizStatus, timeRemaining]);

  // Initial data fetching
  useEffect(() => {
    fetchQuestions();
    checkAttempts();
  }, [attemptNumber]);

  const checkAttempts = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/getAptiscore/${usn}`);
      if (response.data && response.data.length > 0) {
        const highestAttempt = Math.max(...response.data.map(attempt => attempt.attempt_no));
        if (highestAttempt >= MAX_ATTEMPTS) {
          setMaxAttemptsReached(true);
        } else {
          setAttemptNumber(highestAttempt + 1);
        }
      } else {
        setAttemptNumber(1);
      }
    } catch (err) {
      console.error("Error checking attempt count", err);
      setAttemptNumber(1);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/getAllAptitudeQuestions");
      setQuestions(res.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching questions", err);
      setIsLoading(false);
    }
  };

  const handleChange = (q_no, answer) => {
    setSelectedAnswers(prev => ({ ...prev, [q_no]: answer }));
  };

  const toggleFlagQuestion = (q_no) => {
    setFlaggedQuestions(prev => ({ ...prev, [q_no]: !prev[q_no] }));
  };

  const calculateTimeTaken = () => (startTime ? Math.floor((Date.now() - startTime) / 1000) : 0);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSubmitting(true);

    const score = questions.reduce((acc, q) => 
      selectedAnswers[q.q_no] === q.correct_ans_no ? acc + 1 : acc, 0);

    const totalQuestions = questions.length;
    const unanswered = totalQuestions - Object.keys(selectedAnswers).length;

    if (unanswered > 0) {
      const confirm = window.confirm(`You have ${unanswered} unanswered questions. Submit anyway?`);
      if (!confirm) {
        setSubmitting(false);
        return;
      }
    }

    const submissionData = {
      usn,
      sub_name: "Apti",
      answers: selectedAnswers,
      totalQuestions,
      score,
      attempt_no: attemptNumber,
      quiz_date: new Date().toISOString(),
      timetaken: calculateTimeTaken(),
    };

    try {
      await axios.post("http://localhost:8080/api/Aptiscore", submissionData);
      setAptiStatus(true);
      setQuizStatus("completed");
      alert(`Quiz submitted! Score: ${score}/${totalQuestions}`);
    } catch (err) {
      console.error("Submission failed", err);
      alert("Failed to submit. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const startQuiz = () => {
    setQuizStatus("started");
    setStartTime(Date.now());
  };

  const getTimeClass = () => {
    if (timeRemaining < 300) return "text-red-600 animate-pulse font-bold";
    if (timeRemaining < 600) return "text-orange-500 font-bold";
    return "text-blue-700 font-bold";
  };

  const navigateToQuestion = (index) => {
    setCurrentPage(Math.floor(index / questionsPerPage));
    setShowQuestionNav(false);
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(questions.length / questionsPerPage) - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const getQuestionStatus = (index) => {
    const q = questions[index];
    if (!q) return "unknown";
    if (flaggedQuestions[q.q_no]) return "flagged";
    if (selectedAnswers[q.q_no]) return "answered";
    return "unanswered";
  };

  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const startIndex = currentPage * questionsPerPage;
  const currentQuestions = questions.slice(startIndex, startIndex + questionsPerPage);
  const progressPercentage = ((currentPage + 1) / totalPages) * 100;
  
  const answeredCount = Object.keys(selectedAnswers).length;
  const flaggedCount = Object.keys(flaggedQuestions).filter(key => flaggedQuestions[key]).length;

  // Dashboard sidebar navigation
  const SidebarNav = () => (
    <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-indigo-900 text-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <BookOpen className="h-6 w-6 mr-2 text-indigo-300" />
            <h1 className="text-xl font-bold">AptQuiz Pro</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-8 w-8 rounded-full bg-indigo-800 flex items-center justify-center">
              <User className="h-5 w-5 text-indigo-300" />
            </div>
            <div>
              <p className="font-medium text-indigo-100">{uname}</p>
              <p className="text-xs text-indigo-400">{stdname}</p>
            </div>
          </div>
        </div>
        
        <nav className="space-y-1">
          <a href="#" className="flex items-center px-4 py-2 text-indigo-100 rounded-lg bg-indigo-800">
            <Home className="h-4 w-4 mr-3 text-indigo-300" />
            <span>Dashboard</span>
          </a>
          
          <a href="#" className="flex items-center px-4 py-2 text-indigo-100 rounded-lg hover:bg-indigo-800 transition-colors">
            <BookOpen className="h-4 w-4 mr-3 text-indigo-300" />
            <span>Aptitude Quiz</span>
          </a>
        </nav>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="bg-indigo-800 rounded-lg p-3">
          <div className="flex items-center mb-2">
            <HelpCircle className="h-4 w-4 mr-2 text-indigo-300" />
            <h3 className="font-medium text-indigo-100">Need Help?</h3>
          </div>
          <p className="text-xs text-indigo-300 mb-2">
            If you're having trouble, contact your instructor for assistance.
          </p>
          <button className="w-full py-1.5 bg-indigo-700 hover:bg-indigo-600 rounded-lg text-xs font-medium transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );

  // Question navigator modal
  const QuestionNavigator = () => (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center transition-opacity duration-300 ${showQuestionNav ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Question Navigator</h3>
          <button onClick={() => setShowQuestionNav(false)} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex justify-between mb-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span className="text-gray-600 mr-4">Answered</span>
            
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
            <span className="text-gray-600">Flagged</span>
          </div>
          
          <div className="text-blue-600 font-medium">
            {answeredCount}/{questions.length} answered
          </div>
        </div>
        
        <div className="grid grid-cols-5 gap-2 mb-4">
          {questions.map((q, index) => {
            const status = getQuestionStatus(index);
            let bgColor = "bg-gray-100 border-gray-300"; // unanswered
            if (status === "answered") bgColor = "bg-green-100 border-green-500";
            if (status === "flagged") bgColor = "bg-yellow-100 border-yellow-500";
            if (Math.floor(index / questionsPerPage) === currentPage) bgColor = "bg-blue-200 border-blue-600";
            
            return (
              <button
                key={index}
                onClick={() => navigateToQuestion(index)}
                className={`h-10 w-10 ${bgColor} rounded-lg flex items-center justify-center font-medium border-2 transition-all hover:scale-105`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setShowQuestionNav(false)}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  // Conditional rendering based on quiz state
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="text-center bg-white p-8 rounded-xl shadow-2xl">
          <Loader2 className="animate-spin text-indigo-600 mx-auto mb-4" size={48} />
          <p className="text-xl font-medium text-gray-800">Loading your aptitude quiz...</p>
          <p className="text-gray-500 mt-2">Preparing your personalized assessment</p>
        </div>
      </div>
    );
  }

  if (maxAttemptsReached) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md w-full">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Maximum Attempts Reached</h1>
          <p className="text-gray-600 mb-6">Sorry, {uname}. You've already used all {MAX_ATTEMPTS} attempts for the Aptitude quiz.</p>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
            <AlertTriangle className="inline mr-2" size={20} />
            Please contact your instructor for more information.
          </div>
        </div>
      </div>
    );
  }

  if (quizStatus === "completed") {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md w-full">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
            <CheckCircle2 className="text-green-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Quiz Completed!</h1>
          <p className="text-gray-600 mb-6">Thanks, {uname}! Your responses have been successfully recorded.</p>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
            <CheckCircle className="inline mr-2" size={20} />
            Your instructor will review your performance shortly.
          </div>
        </div>
      </div>
    );
  }

  if (quizStatus === "not_started") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4 flex">
        <SidebarNav />
        
        <div className="flex-1 flex flex-col p-4">
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="md:hidden bg-white p-2 rounded-lg shadow-md text-indigo-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="text-right">
              <h2 className="text-lg font-medium text-gray-800">Welcome back</h2>
              <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="min-w-md mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden flex-1 flex flex-col">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-4 text-white">
              <h1 className="text-2xl font-bold">Aptitude Quiz</h1>
              <p className="text-sm opacity-90">Test your problem-solving skills</p>
            </div>
            
            <div className="p-6 flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Welcome, {uname}</h2>
                  <p className="text-sm text-gray-600">{stdname}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-100 shadow-sm">
                  <div className="flex items-center mb-2">
                    <Award className="h-4 w-4 text-indigo-600 mr-2" />
                    <h3 className="font-medium text-sm text-gray-800">Attempt</h3>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">Current attempt</span>
                    <span className="font-bold text-sm text-indigo-600">{attemptNumber} of {MAX_ATTEMPTS}</span>
                  </div>
                  <div className="h-1.5 bg-indigo-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full" 
                      style={{ width: `${(attemptNumber / MAX_ATTEMPTS) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-100 shadow-sm">
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 text-indigo-600 mr-2" />
                    <h3 className="font-medium text-sm text-gray-800">Time Limit</h3>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Duration</span>
                    <span className="font-bold text-sm text-indigo-600">30 minutes</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-indigo-50 rounded-xl p-4 mb-4 border border-indigo-100">
                <h3 className="text-md font-semibold text-gray-800 mb-3">Quiz Information</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                      <ClipboardList size={16} />
                    </div>
                    <div className="ml-2">
                      <p className="font-medium text-xs text-gray-800">Questions</p>
                      <p className="text-xs text-gray-600">{questions.length} total</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                      <Timer size={16} />
                    </div>
                    <div className="ml-2">
                      <p className="font-medium text-xs text-gray-800">Time</p>
                      <p className="text-xs text-gray-600">30 minutes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                      <Flag size={16} />
                    </div>
                    <div className="ml-2">
                      <p className="font-medium text-xs text-gray-800">Flag</p>
                      <p className="text-xs text-gray-600">Mark for review</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={startQuiz}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz started state
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex">
      <QuestionNavigator />
      <SidebarNav />
      
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="md:hidden bg-white p-2 rounded-lg shadow-md text-indigo-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg bg-white shadow-md ${getTimeClass()}`}>
            <Timer size={18} className="flex-shrink-0" />
            <span className="font-medium">{formatTime(timeRemaining)}</span>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
          {/* Top Quiz Info */}
          <div className="bg-white shadow-lg rounded-t-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-3 flex justify-between items-center text-white">
              <div className="flex items-center space-x-3">
                <ClipboardList size={20} />
                <h2 className="text-lg font-bold">Aptitude Quiz</h2>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1 text-sm font-medium">
                Attempt {attemptNumber}/{MAX_ATTEMPTS}
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="h-1 bg-gray-100">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            
            {/* Question stats */}
            <div className="p-3 bg-indigo-50 flex flex-wrap items-center justify-between gap-2">
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 font-bold text-sm">
                    {currentPage + 1}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">of {totalPages}</span>
                </div>
                
                <div className="flex items-center text-gray-600 text-xs">
                  <CheckCircle size={14} className="text-green-500 mr-1" />
                  <span>{answeredCount} answered</span>
                </div>
                
                <div className="flex items-center text-gray-600 text-xs">
                  <Flag size={14} className="text-yellow-500 mr-1" />
                  <span>{flaggedCount} flagged</span>
                </div>
              </div>
              
              <button
                onClick={() => setShowQuestionNav(true)}
                className="flex items-center space-x-1 px-2 py-1 bg-white hover:bg-gray-50 rounded-lg text-indigo-700 text-xs transition-colors shadow-sm border border-indigo-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span>Question Navigator</span>
              </button>
            </div>
          </div>
          
          {/* Questions Content */}
          <div className="bg-white p-4 shadow-lg rounded-b-2xl flex-1 overflow-y-auto">
            <div className="space-y-6">
              {currentQuestions.map((question, idx) => (
                <div key={question.q_no} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <div className="mb-1 text-sm text-indigo-600 font-medium flex items-center">
                    <span className="inline-block w-6 h-6 bg-indigo-100 rounded-full text-center text-indigo-700 font-bold text-xs mr-2 flex items-center justify-center">
                      Q
                    </span>
                    Question {startIndex + idx + 1}
                  </div>
                  <div className="text-lg font-semibold text-gray-800 mb-4">
                    {question.question}
                  </div>
                  
                  <div className="space-y-2">
                    {["option_1", "option_2", "option_3", "option_4"].map((optKey, i) => (
                      <label
                        key={i}
                        className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedAnswers[question.q_no] === i + 1
                            ? "bg-indigo-50 border-indigo-500 shadow-sm"
                            : "hover:bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className={`h-4 w-4 rounded-full flex items-center justify-center border-2 mr-3 ${
                          selectedAnswers[question.q_no] === i + 1
                            ? "border-indigo-500 bg-indigo-500"
                            : "border-gray-400"
                        }`}>
                          {selectedAnswers[question.q_no] === i + 1 && (
                            <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                          )}
                        </div>
                        <input
                          type="radio"
                          name={`question-${question.q_no}`}
                          value={i + 1}
                          className="sr-only"
                          onChange={() => handleChange(question.q_no, i + 1)}
                        />
                        <span className="text-sm text-gray-700">{question[optKey]}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => toggleFlagQuestion(question.q_no)}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm ${
                        flaggedQuestions[question.q_no]
                          ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                      }`}
                    >
                      <Flag size={14} className={`mr-1 ${flaggedQuestions[question.q_no] ? "text-yellow-500" : ""}`} />
                      {flaggedQuestions[question.q_no] ? "Flagged" : "Flag Question"}
                    </button>
                    
                    <div className="text-sm text-gray-500">
                      {selectedAnswers[question.q_no] ? "Answer selected" : "Not answered yet"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-4 bg-white p-4 rounded-2xl shadow-lg">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition ${
                currentPage === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
              }`}
            >
              <ChevronLeft size={16} className="mr-1" />
              Previous
            </button>
            
            <div className="text-sm text-gray-600">
              Page {currentPage + 1} of {totalPages}
            </div>
            
            {currentPage === totalPages - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} className="mr-2" />
                    Submit Quiz
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={nextPage}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                Next
                <ChevronRight size={16} className="ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AptitudeQuiz;
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CheckCircle2,
  AlertCircle,
  Timer,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Flag,
  HelpCircle,
  Circle,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";

const AptitudeQuiz = ({ setAptiStatus, setusn, uname, usn, sub_name, stdname }) => {
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
  const questionsPerPage = 1;
  const MAX_ATTEMPTS = 3;

  useEffect(() => {
    let timer;
    if (quizStatus === "started" && timeRemaining > 0) {
      timer = setInterval(() => setTimeRemaining((prev) => prev - 1), 1000);
    } else if (quizStatus === "started" && timeRemaining === 0) {
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [quizStatus, timeRemaining]);

  useEffect(() => {
    fetchQuestions();
    checkAttempts();
  }, [attemptNumber]);

  const checkAttempts = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/getAptiscore/${usn}`);
      if (response.data && response.data.length > 0) {
        // Find the highest attempt number
        const highestAttempt = Math.max(...response.data.map(attempt => attempt.attempt_no));
        if (highestAttempt >= MAX_ATTEMPTS) {
          setMaxAttemptsReached(true);
        } else {
          setAttemptNumber(highestAttempt + 1);
        }
      } else {
        // No previous attempts
        setAttemptNumber(1);
      }
    } catch (err) {
      console.error("Error checking attempt count", err);
      // Default to 1 if we can't check
      setAttemptNumber(1);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/getAllAptitudeQuestions");
      setQuestions(res.data);
    } catch (err) {
      console.error("Error fetching questions", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (q_no, answer) => {
    setSelectedAnswers((prev) => ({ ...prev, [q_no]: answer }));
  };

  const toggleFlagQuestion = (q_no) => {
    setFlaggedQuestions((prev) => ({ ...prev, [q_no]: !prev[q_no] }));
  };

  const calculateTimeTaken = () => (startTime ? Math.floor((Date.now() - startTime) / 1000) : 0);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSubmitting(true);

    const score = questions.reduce((acc, q) => (
      selectedAnswers[q.q_no] === q.correct_ans_no ? acc + 1 : acc
    ), 0);

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

  const formatTime = (seconds) => {
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
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
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
  const currentQuestion = questions[startIndex];

  // Quiz progress percentage
  const progressPercentage = ((currentPage + 1) / totalPages) * 100;

  // Question navigator
  const QuestionNavigator = () => {
    return (
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center transition-opacity duration-300 ${showQuestionNav ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Question Navigator</h3>
            <button onClick={() => setShowQuestionNav(false)} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, index) => {
              const status = getQuestionStatus(index);
              let bgColor = "bg-gray-200"; // unanswered
              if (status === "answered") bgColor = "bg-green-100 border-green-500";
              if (status === "flagged") bgColor = "bg-yellow-100 border-yellow-500";
              if (index === currentPage) bgColor = "bg-blue-200 border-blue-600";
              
              return (
                <button
                  key={index}
                  onClick={() => navigateToQuestion(index)}
                  className={`h-12 w-12 ${bgColor} rounded-lg flex items-center justify-center font-medium border-2 transition-all hover:scale-105`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowQuestionNav(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center bg-white p-8 rounded-xl shadow-2xl transform transition-all">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={64} />
          <p className="text-xl font-medium text-gray-700">Loading your aptitude quiz...</p>
          <p className="text-gray-500 mt-2">Please wait while we prepare your questions</p>
        </div>
      </div>
    );
  }

  if (maxAttemptsReached) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md w-full transform transition-all">
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
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md w-full transform transition-all">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <QuestionNavigator />
      
      {quizStatus === "not_started" ? (
        <div className="max-w-md mx-auto mt-12 bg-white shadow-2xl rounded-2xl overflow-hidden transition-all">
          <div className="bg-blue-600 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">Aptitude Quiz</h1>
            <p className="opacity-90">Test your aptitude skills</p>
          </div>
          <div className="p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <ClipboardList size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Welcome, {uname}</h2>
                <p className="text-gray-600">{stdname}</p>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100">
              <div className="flex justify-between items-center">
                <span className="font-medium text-blue-800">Attempt</span>
                <span className="font-bold text-blue-800">{attemptNumber} of {MAX_ATTEMPTS}</span>
              </div>
              <div className="mt-2 bg-white rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full" 
                  style={{ width: `${(attemptNumber / MAX_ATTEMPTS) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">Total Questions</p>
                  <p className="text-gray-600 text-sm">{questions.length} questions to answer</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <Timer size={20} className="text-green-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">Time Limit</p>
                  <p className="text-gray-600 text-sm">30 minutes to complete</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <ClipboardList size={20} className="text-green-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">Subject</p>
                  <p className="text-gray-600 text-sm">Aptitude</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={startQuiz}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Start Quiz
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {/* Top Bar */}
          <div className="bg-white shadow-lg rounded-t-2xl overflow-hidden">
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
              <div className="flex items-center space-x-3">
                <ClipboardList size={24} />
                <h2 className="text-xl font-bold">Aptitude Quiz</h2>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full bg-white bg-opacity-20 ${getTimeClass()}`}>
                <Timer size={16} className="flex-shrink-0" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="bg-gray-100 h-2">
              <div 
                className="bg-blue-600 h-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-800 font-bold">
                  {currentPage + 1}
                </span>
                <span className="text-gray-500">of {totalPages}</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium text-sm">
                  Attempt {attemptNumber}/{MAX_ATTEMPTS}
                </div>
                <button
                  onClick={() => setShowQuestionNav(true)}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700 text-sm transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <span>Questions</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Question Content */}
          <div className="bg-white p-6 md:p-8 shadow-lg rounded-b-2xl">
            <div className="mb-6">
              <div className="mb-2 text-sm text-blue-600 font-medium">Question {currentPage + 1}</div>
              <div className="text-xl font-semibold text-gray-800 mb-6">
                {currentQuestion?.question}
              </div>
              
              <div className="space-y-3">
                {["option_1", "option_2", "option_3", "option_4"].map((optKey, i) => (
                  <label
                    key={i}
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedAnswers[currentQuestion.q_no] === i + 1
                        ? "bg-blue-50 border-blue-500 shadow-sm"
                        : "hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center border-2 mr-3 ${
                      selectedAnswers[currentQuestion.q_no] === i + 1
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-400"
                    }`}>
                      {selectedAnswers[currentQuestion.q_no] === i + 1 && (
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <input
                      type="radio"
                      name={`question-${currentQuestion.q_no}`}
                      value={i + 1}
                      className="sr-only"
                      checked={selectedAnswers[currentQuestion.q_no] === i + 1}
                      onChange={() => handleChange(currentQuestion.q_no, i + 1)}
                    />
                    <span className="text-gray-800">{currentQuestion[optKey]}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Navigation controls */}
            <div className="mt-8 border-t pt-6 flex flex-wrap gap-4 justify-between items-center">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 0 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <ChevronLeft size={18} />
                <span>Previous</span>
              </button>
              
              <button
                onClick={() => toggleFlagQuestion(currentQuestion.q_no)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  flaggedQuestions[currentQuestion.q_no] 
                    ? "bg-yellow-100 text-yellow-700 border border-yellow-300 hover:bg-yellow-200" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Flag size={18} />
                <span>{flaggedQuestions[currentQuestion.q_no] ? "Unflag" : "Flag"} Question</span>
              </button>
              
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  currentPage === totalPages - 1 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <span>Next</span>
                <ChevronRight size={18} />
              </button>
            </div>
            
            {/* Submit button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={`px-6 py-3 rounded-lg shadow-lg transition-all ${
                  submitting 
                    ? "bg-green-500 text-white cursor-wait" 
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {submitting ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 size={18} className="animate-spin" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 size={18} />
                    <span>Submit Quiz</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AptitudeQuiz;
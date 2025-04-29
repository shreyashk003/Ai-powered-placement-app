import React, { useState, useEffect } from "react";
import { Book, Check, ChevronDown, Clock, Award, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UnifiedDashboard({ loginName, stdname, usn, setTechnicalStatus }) {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [completedTests, setCompletedTests] = useState([]);
  const [attemptsCount, setAttemptsCount] = useState({});
  const [quizActive, setQuizActive] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timer, setTimer] = useState(900); // 15 minutes
  const [currentPage, setCurrentPage] = useState(1);
  const [startTime, setStartTime] = useState(null);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [maxAttemptsReached, setMaxAttemptsReached] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null);
  const [currentAttemptScores, setCurrentAttemptScores] = useState({});
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [lastSubmittedScore, setLastSubmittedScore] = useState(null);
  const questionsPerPage = 5;
  const MAX_ATTEMPTS = 3; // Maximum number of attempts allowed

  const subjectsList = {
    cs: [
      { display: "Computer Networks", code: "CN" },
      { display: "Operating System", code: "OS" },
      { display: "Database Management System", code: "DB" },
      { display: "Data-Structure and Algorithm", code: "DSA" },
      { display: "Object-Oriented Programming", code: "OOPS" },
      { display: "Software Engineering", code: "SE" }
    ],
    ec: [
      { display: "Electronic Circuits", code: "EC" },
      { display: "Micro Controllers", code: "MC" },
      { display: "Database Management System", code: "DB" },
      { display: "VLSI Design", code: "VD" },
      { display: "Object-Oriented Programming", code: "OOPS" },
      { display: "Operating System", code: "OS" }
    ],
    cv: [
      { display: "Basics of Civil Engineering", code: "CE" },
      { display: "Structural Engineering", code: "SE" },
      { display: "Strength of Materials", code: "SM" },
      { display: "CAED", code: "CAED" },
      { display: "Building Design", code: "BD" },
      { display: "Materials Management", code: "MM" },
      { display: "Building Materials", code: "BM" }
    ],
    me: [
      { display: "Basics of Mechanical Engineering", code: "ME" },
      { display: "Thermodynamics", code: "TD" },
      { display: "Theory of Machines", code: "TM" },
      { display: "CAED", code: "CAED" },
      { display: "Machine Design", code: "MD" },
      { display: "Fluid Mechanics", code: "FM" },
      { display: "Mechatronics", code: "MT" }
    ]
  };

  // Extract branch from loginName
  const stdBranch = loginName && loginName.length === 10 ? loginName.substring(5, 7).toLowerCase() : "cs";
  const subjects = subjectsList[stdBranch] || [];

  // Clear timer on component unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  // Load all subject attempt data on mount
  useEffect(() => {
    if (usn) {
      loadAllSubjectAttempts();
    }
  }, [usn]);
  
  // New function to load all subject attempt data at once
  const loadAllSubjectAttempts = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/getUserCompletedTests/${usn}`);
      console.log("Loading all subject attempts:", response.data);
      
      // Process the response to extract completed tests and attempt counts
      const completed = [];
      const attempts = {};
      const scores = {};
      
      if (Array.isArray(response.data)) {
        // Group attempts by subject
        const subjectAttempts = {};
        
        response.data.forEach(test => {
          if (!subjectAttempts[test.sub_name]) {
            subjectAttempts[test.sub_name] = [];
            scores[test.sub_name] = {};
          }
          subjectAttempts[test.sub_name].push(test.attempt_no);
          scores[test.sub_name][test.attempt_no] = test.score;
          
          // Mark subject as completed if at least one attempt exists
          if (!completed.includes(test.sub_name)) {
            completed.push(test.sub_name);
          }
        });
        
        // Find maximum attempt number for each subject
        Object.keys(subjectAttempts).forEach(subject => {
          attempts[subject] = Math.max(...subjectAttempts[subject]);
        });
      }
      
      console.log("Processed completed tests:", completed);
      console.log("Processed attempts count:", attempts);
      console.log("Processed scores:", scores);
      
      setCompletedTests(completed);
      setAttemptsCount(attempts);
      setCurrentAttemptScores(scores);
      
      // Check if technical section is completed (5+ subjects completed)
      if (completed.length >= subjects.length) {
        setTechnicalStatus(true);
      }
    } catch (error) {
      console.error("Error loading subject attempts:", error);
      // Initialize with empty arrays in case of error
      setCompletedTests([]);
      setAttemptsCount({});
      setCurrentAttemptScores({});
    }
  };

  // Check attempts for a specific subject before starting quiz
  const getNextAttemptNumber = async (subjectCode) => {
    try {
      const payload = {
        usn: usn,
        sub_name: subjectCode
      };
      
      const response = await axios.post("http://localhost:8080/api/getTechAttempt_no", payload);
      
      if (response.data && response.data.length > 0) {
        const subjectAttempts = response.data.filter(attempt => attempt.sub_name === subjectCode);
        
        if (subjectAttempts.length > 0) {
          const highestAttempt = Math.max(...subjectAttempts.map(attempt => attempt.attempt_no));
          alert(highestAttempt)
          setAttemptsCount(prev => ({
            ...prev,
            [subjectCode]: highestAttempt
          }));
          
          return { nextAttemptNumber: highestAttempt + 1 }; // Allow next attempt
        }
      }
      
      return { nextAttemptNumber: 1 }; // No previous attempts
    } catch (err) {
      console.error("Error checking attempt count", err);
      return { nextAttemptNumber: 1 }; // Default to 1 if we can't check
    }
  };
  const handleStartQuiz = async (subject) => {
    // Get the next attempt number for this subject
    const { nextAttemptNumber, maxReached } = await getNextAttemptNumber(subject.code);
    
    // If max attempts reached, inform the user but allow to proceed
    if (maxReached) {
      const confirmProceed = window.confirm(
        `You have already completed ${MAX_ATTEMPTS} attempts for ${subject.display}. Would you like to view your previous results?`
      );
      
      if (confirmProceed) {
        // Navigate to results page or show a modal with previous scores
        showPreviousScores(subject.code);
        return;
      } else {
        return;
      }
    }
    
    setAttemptNumber(nextAttemptNumber);
    setSelectedSubject(subject);
    setQuizActive(true);
    setCurrentPage(1);
    setSelectedAnswers({});
    setTimer(900);
    
    // Fetch questions
    try {
      const response = await axios.get(`http://localhost:8080/api/getTechSubQuestionsByName/${subject.code}`);
      setQuestions(response.data);
      setStartTime(new Date());
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert('Failed to load questions. Please try again.');
      setQuizActive(false);
      return;
    }
    
    // Start timer - store the interval ID so we can clear it later
    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimerInterval(countdown);
  };

  const showPreviousScores = (subjectCode) => {
    // Display previous scores for this subject
    if (currentAttemptScores[subjectCode]) {
      let message = `Previous scores for ${subjectCode}:\n`;
      Object.entries(currentAttemptScores[subjectCode]).forEach(([attempt, score]) => {
        message += `Attempt ${attempt}: ${score}\n`;
      });
      alert(message);
    } else {
      alert("No previous scores found for this subject.");
    }
  };

  const handleAnswerSelect = (q_no, option) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [q_no.toString()]: option,
    }));
  };

  const handleStartNextAttempt = (subjectCode) => {
    // Find the subject from subjects list
    const subject = subjects.find(s => s.code === subjectCode);
    if (subject) {
      handleStartQuiz(subject);
    }
  };

  const handleNextSubject = () => {
    // Find current subject index
    const currentIndex = subjects.findIndex(s => s.code === selectedSubject.code);
    
    // If there are more subjects, move to the next one
    if (currentIndex < subjects.length - 1) {
      const nextSubject = subjects[currentIndex + 1];
      handleStartQuiz(nextSubject);
    } else {
      // All subjects completed
      setShowScoreModal(false);
      setSelectedSubject(null);
      setQuizActive(false);
    }
  };

  const handleSubmitQuiz = async () => {
    // Clear the timer
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    // Don't proceed if subject is not selected (safeguard)
    if (!selectedSubject) {
      setQuizActive(false);
      return;
    }
    
    const totalQuestions = questions.length;
    const unanswered = questions.filter(q => !selectedAnswers[q.q_no]).length;

    if (unanswered > 0) {
      const confirmSubmit = window.confirm(`You have ${unanswered} unanswered question(s). Are you sure you want to submit?`);
      if (!confirmSubmit) return;
    }

    let score = 0;
    questions.forEach((q) => {
      const correctOption = q[`option_${q.correct_ans}`];
      if (selectedAnswers[q.q_no] === correctOption) score++;
    });

    const endTime = new Date();
    const timeTaken = Math.floor((endTime - (startTime || endTime)) / 1000);

    const submissionData = {
      usn,
      sub_name: selectedSubject.code,
      score,
      attempt_no: attemptNumber,
      quiz_date: new Date().toISOString(),
      time_taken: timeTaken,
    };

    try {
      await axios.post("http://localhost:8080/api/storeScores", submissionData);
      
      // Update attempts count in state
      setAttemptsCount(prev => ({
        ...prev,
        [selectedSubject.code]: attemptNumber
      }));
      
      // Add to completed tests if it's not already there
      if (!completedTests.includes(selectedSubject.code)) {
        const updatedCompletedTests = [...completedTests, selectedSubject.code];
        setCompletedTests(updatedCompletedTests);
        
        // Check if technical section is now completed
        if (updatedCompletedTests.length >= subjects.length && attemptNumber>3) {
          setTechnicalStatus(true);
        }
      }
      
      // Update scores record
      setCurrentAttemptScores(prev => ({
        ...prev,
        [selectedSubject.code]: {
          ...(prev[selectedSubject.code] || {}),
          [attemptNumber]: score
        }
      }));
      
      // Store last submitted score for the modal
      setLastSubmittedScore({
        subject: selectedSubject,
        score,
        totalQuestions,
        timeTaken,
        attemptNumber
      });
      
      // Show score modal
      setShowScoreModal(true);
      
      // Reload all subject data to ensure state is in sync with database
      loadAllSubjectAttempts();
    } catch (error) {
      console.error("Error submitting quiz", error);
      alert("❌ Failed to submit quiz. Please try again.");
      setQuizActive(false);
      setSelectedSubject(null);
    }
  };

  const handleCloseScoreModal = () => {
    setShowScoreModal(false);
    setSelectedSubject(null);
    setQuizActive(false);
  };

  const handleExitQuiz = () => {
    if (window.confirm("Are you sure you want to exit? Your progress will be lost.")) {
      // Clear the timer
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      
      setQuizActive(false);
      setSelectedSubject(null);
    }
  };

  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = questions.slice(startIndex, endIndex);
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate average score if data is available
  const calculateAverageScore = () => {
    let totalScores = 0;
    let totalAttempts = 0;
    
    Object.keys(currentAttemptScores).forEach(subject => {
      Object.values(currentAttemptScores[subject]).forEach(score => {
        totalScores += score;
        totalAttempts++;
      });
    });
    
    return totalAttempts > 0 ? Math.round((totalScores / totalAttempts) * 100) / 100 : 0;
  };

  const avgScore = calculateAverageScore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Book className="text-blue-600 mr-3" size={28} />
              <h1 className="text-xl font-bold text-gray-800">Technical Skills Assessment Dashboard</h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full flex items-center">
                <span className="font-medium">{loginName ? loginName.toUpperCase() : 'STUDENT'} • {stdname || 'User'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {!quizActive ? (
          <>
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 uppercase font-medium">Completed Tests</p>
                    <p className="text-2xl font-bold text-gray-800">{completedTests.length}/{subjects.length}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${subjects.length ? (completedTests.length / subjects.length) * 100 : 0}%` }} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 uppercase font-medium">Average Score</p>
                    <p className="text-2xl font-bold text-gray-800">{avgScore}%</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${avgScore}%` }} />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 uppercase font-medium">Remaining Tests</p>
                    <p className="text-2xl font-bold text-gray-800">{subjects.length - completedTests.length}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${subjects.length ? ((subjects.length - completedTests.length) / subjects.length) * 100 : 0}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Subject Cards */}
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Available Tests</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {subjects.map((subject) => {
                const isCompleted = completedTests.includes(subject.code);
                const currentAttempts = attemptsCount[subject.code] || 0;
                const attemptsUsed = currentAttempts >= MAX_ATTEMPTS ? MAX_ATTEMPTS : currentAttempts;
                const attemptsLeft = MAX_ATTEMPTS - attemptsUsed;
                
                return (
                  <div 
                    key={subject.code}
                    className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow
                      ${isCompleted && attemptsUsed >= MAX_ATTEMPTS ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'}`}
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-800">{subject.display}</h3>
                        {isCompleted ? (
                          <span className="bg-green-100 text-green-600 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                            <Check size={12} className="mr-1" /> Attempted
                          </span>
                        ) : (
                          <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-0.5 rounded">
                            Available
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Subject Code: {subject.code}</p>
                      
                      {/* Display attempt information */}
                      <p className="text-sm text-gray-600 mt-2">
                        {attemptsUsed > 0 
                          ? `Attempts: ${attemptsUsed}/${MAX_ATTEMPTS}` 
                          : `Attempts: 0/${MAX_ATTEMPTS}`
                        }
                      </p>
                      
                      {/* Display previous scores if any */}
                      {currentAttemptScores[subject.code] && (
                        <div className="mt-1 text-sm">
                          <p className="text-gray-600">Previous scores:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Object.entries(currentAttemptScores[subject.code]).map(([attempt, score]) => (
                              <span key={attempt} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                                Attempt {attempt}: {score}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <button
                          onClick={() => handleStartQuiz(subject)}
                          className="w-full py-2 rounded-md font-medium text-sm bg-blue-600 text-white hover:bg-blue-700"
                        >
                          {attemptsUsed >= MAX_ATTEMPTS 
                            ? 'View Results' 
                            : isCompleted 
                              ? `Continue Attempts (${attemptsLeft} left)` 
                              : 'Start Test'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Quiz Interface */
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{selectedSubject?.display} Test</h2>
                <p className="text-sm text-gray-500">
                  Answer all questions to complete the test • Attempt #{attemptNumber}/{MAX_ATTEMPTS}
                </p>
              </div>
              <div className="flex items-center">
                <div className="text-red-600 font-medium flex items-center">
                  <Clock size={20} className="mr-2" /> {formatTime(timer)}
                </div>
                <button 
                  onClick={handleExitQuiz}
                  className="ml-4 p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {questions.length > 0 ? (
              <>
                <div className="space-y-8">
                  {currentQuestions.map((question, index) => (
                    <div key={question.q_no} className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-medium mb-3 text-gray-800">
                        Q{startIndex + index + 1}. {question.question}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[question.option_1, question.option_2, question.option_3, question.option_4].map((opt, i) => (
                          <label 
                            key={i} 
                            className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors
                              ${selectedAnswers[question.q_no] === opt 
                                ? 'bg-blue-50 border-blue-300' 
                                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                          >
                            <input
                              type="radio"
                              name={`q${question.q_no}`}
                              value={opt}
                              checked={selectedAnswers[question.q_no] === opt}
                              onChange={() => handleAnswerSelect(question.q_no, opt)}
                              className="accent-blue-600 mr-3"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-8 h-8 rounded-full font-medium ${
                          currentPage === i + 1
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex space-x-3">
                    {currentPage === totalPages ? (
                      <button
                        onClick={handleSubmitQuiz}
                        className="px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700"
                      >
                        Submit Quiz
                      </button>
                    ) : (
                      <button
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-600">Loading questions...</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Score Modal */}
      {showScoreModal && lastSubmittedScore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Quiz Completed!</h3>
              <p className="text-gray-600">{lastSubmittedScore.subject.display}</p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Score:</span>
                <span className="font-medium">{lastSubmittedScore.score}/{lastSubmittedScore.totalQuestions}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Time Taken:</span>
                <span className="font-medium">{formatTime(lastSubmittedScore.timeTaken)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Attempt:</span>
                <span className="font-medium">{lastSubmittedScore.attemptNumber}/{MAX_ATTEMPTS}</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              {lastSubmittedScore.attemptNumber < MAX_ATTEMPTS && (
                <button
                  onClick={() => {
                    setShowScoreModal(false);
                    handleStartNextAttempt(lastSubmittedScore.subject.code);
                  }}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
                >
                  Try Again
                </button>
              )}
              
              <button
                onClick={() => {
                  setShowScoreModal(false);
                  handleNextSubject();
                }}
              
                className="flex-1 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700"
              >
                Next Subject
              </button>
              
              <button
                onClick={handleCloseScoreModal}
                className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UnifiedDashboard;
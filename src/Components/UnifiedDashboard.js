import React, { useState, useEffect } from "react";
import { Book, Check, Clock, Award, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ProgramSkill from "./ProgramSkill";

function UnifiedDashboard({ loginName, stdname, usn, setTechnicalStatus, setProgramStatus, sem }) {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjectData, setSubjectData] = useState({});
  const [quizActive, setQuizActive] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timer, setTimer] = useState(900);
  const [currentPage, setCurrentPage] = useState(1);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [lastScore, setLastScore] = useState(null);
  const [timerInterval, setTimerInterval] = useState(null);
  const questionsPerPage = 5;
  const MAX_ATTEMPTS = 3;

  // Extract branch from loginName
  const stdBranch = loginName && loginName.length === 10 ? loginName.substring(5, 7).toLowerCase() : "cs";

  // Full subject lists by branch
  const allSubjectsList = {
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
      { display: "Materials Management", code: "MM" }
    ],
    me: [
      { display: "Basics of Mechanical Engineering", code: "ME" },
      { display: "Thermodynamics", code: "TD" },
      { display: "Theory of Machines", code: "TM" },
      { display: "CAED", code: "CAED" },
      { display: "Machine Design", code: "MD" },
      { display: "Fluid Mechanics", code: "FM" }
    ]
  };

  // Subjects for lower semesters (4-5)
  const lowerSemSubjectsList = {
    cs: [
      { display: "Data-Structure and Algorithm", code: "DSA" },
      { display: "Operating System", code: "OS" },
      { display: "Database Management System", code: "DB" },
      { display: "Object-Oriented Programming", code: "OOPS" }
    ],
    ec: [
      { display: "Database Management System", code: "DB" },
      { display: "Object-Oriented Programming", code: "OOPS" },
      { display: "Operating System", code: "OS" },
      { display: "Electronic Circuits", code: "EC" }
    ],
    cv: [
      { display: "Basics of Civil Engineering", code: "CE" },
      { display: "Structural Engineering", code: "SE" },
      { display: "Strength of Materials", code: "SM" },
      { display: "CAED", code: "CAED" }
    ],
    me: [
      { display: "Basics of Mechanical Engineering", code: "ME" },
      { display: "Thermodynamics", code: "TD" },
      { display: "Theory of Machines", code: "TM" },
      { display: "CAED", code: "CAED" }
    ]
  };

  // Determine which subject list to use based on semester
  const subjects = sem && (sem === 4 || sem === 5) 
    ? (lowerSemSubjectsList[stdBranch] || [])
    : (allSubjectsList[stdBranch] || []);

  // Load subject data on component mount
  useEffect(() => {
    if (usn) {
      loadSubjectData();
    }
    
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [usn]);

  // Load all subject attempt data
  const loadSubjectData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/getUserCompletedTests/${usn}`);
      
      // Process subject data
      const data = {};
      
      subjects.forEach(subject => {
        data[subject.code] = {
          completed: false,
          attempts: 0,
          scores: {}
        };
      });
      
      if (Array.isArray(response.data)) {
        response.data.forEach(test => {
          if (data[test.sub_name]) {
            data[test.sub_name].completed = true;
            data[test.sub_name].attempts = Math.max(data[test.sub_name].attempts, test.attempt_no);
            data[test.sub_name].scores[test.attempt_no] = test.score;
          }
        });
      }
      
      setSubjectData(data);
      
      // Check if all subjects are completed
      checkTechnicalCompletion(data);
    } catch (error) {
      console.error("Error loading subject data:", error);
    }
  };

  // Check if technical assessment is complete
  const checkTechnicalCompletion = (data) => {
    const allComplete = subjects.every(subject => 
      data[subject.code] && data[subject.code].attempts >= MAX_ATTEMPTS
    );
    
    if (allComplete) {
      setTechnicalStatus(true);
    }
  };

  // Start quiz for a subject
  const handleStartQuiz = async (subject) => {
    const subjectInfo = subjectData[subject.code] || { attempts: 0 };
    const nextAttemptNumber = subjectInfo.attempts + 1;
    
    // Check if max attempts reached
    if (nextAttemptNumber > MAX_ATTEMPTS) {
      alert(`You've already completed all ${MAX_ATTEMPTS} attempts for ${subject.display}.`);
      return;
    }
    
    setSelectedSubject({...subject, attemptNumber: nextAttemptNumber});
    setQuizActive(true);
    setCurrentPage(1);
    setSelectedAnswers({});
    setTimer(900);
    
    try {
      const response = await axios.get(`http://localhost:8080/api/getTechSubQuestionsByName/${subject.code}`);
      setQuestions(response.data);
      
      // Start timer
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
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert('Failed to load questions. Please try again.');
      setQuizActive(false);
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (questionNo, option) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionNo.toString()]: option,
    }));
  };

  // Submit quiz
  const handleSubmitQuiz = async () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    if (!selectedSubject) {
      setQuizActive(false);
      return;
    }
    
    const unanswered = questions.filter(q => !selectedAnswers[q.q_no]).length;
    if (unanswered > 0) {
      const confirmSubmit = window.confirm(`You have ${unanswered} unanswered question(s). Are you sure you want to submit?`);
      if (!confirmSubmit) return;
    }

    // Calculate score
    let score = 0;
    questions.forEach((q) => {
      const correctOption = q[`option_${q.correct_ans}`];
      if (selectedAnswers[q.q_no] === correctOption) score++;
    });

    // Submit data
    const submissionData = {
      usn,
      sub_name: selectedSubject.code,
      score,
      attempt_no: selectedSubject.attemptNumber,
      quiz_date: new Date().toISOString(),
      time_taken: Math.floor((900 - timer)),
    };

    try {
      await axios.post("http://localhost:8080/api/storeScores", submissionData);
      
      // Update local state
      setSubjectData(prev => ({
        ...prev,
        [selectedSubject.code]: {
          ...prev[selectedSubject.code],
          completed: true,
          attempts: selectedSubject.attemptNumber,
          scores: {
            ...prev[selectedSubject.code]?.scores,
            [selectedSubject.attemptNumber]: score
          }
        }
      }));
      
      // Store last score for modal
      setLastScore({
        subject: selectedSubject,
        score,
        total: questions.length
      });
      
      // Show score modal
      setShowScoreModal(true);
      
      // Reload subject data
      loadSubjectData();
    } catch (error) {
      console.error("Error submitting quiz", error);
      alert("Failed to submit quiz. Please try again.");
      setQuizActive(false);
    }
  };

  // Close score modal
  const handleCloseScoreModal = () => {
    setShowScoreModal(false);
    setSelectedSubject(null);
    setQuizActive(false);
  };

  // Exit quiz
  const handleExitQuiz = () => {
    if (window.confirm("Are you sure you want to exit? Your progress will be lost.")) {
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      
      setQuizActive(false);
      setSelectedSubject(null);
    }
  };

  // Navigation for quiz pages
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = questions.slice(startIndex, endIndex);
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate dashboard stats
  const completedSubjects = Object.values(subjectData).filter(subject => subject.completed).length;
  const completedPercentage = subjects.length ? (completedSubjects / subjects.length) * 100 : 0;
  
  // Calculate average score
  const calculateAverageScore = () => {
    let totalScore = 0;
    let totalTests = 0;
    
    Object.values(subjectData).forEach(subject => {
      Object.values(subject.scores || {}).forEach(score => {
        totalScore += score;
        totalTests++;
      });
    });
    
    return totalTests > 0 ? (totalScore / totalTests) : 0;
  };
  
  const avgScore = calculateAverageScore();

  // Check if all subjects have at least one attempt
  const allSubjectsStarted = subjects.every(subject => 
    subjectData[subject.code] && subjectData[subject.code].attempts >= 1
  );

  // Proceed to programming skills section
  const handleProceedToProgramming = () => {
   // navigate("/program-skill");
   setTechnicalStatus(true)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Book className="text-blue-600 mr-2" size={24} />
              <h1 className="text-lg font-bold text-gray-800">Technical Assessment</h1>
              {sem && <span className="ml-2 text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Semester {sem}</span>}
            </div>
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
              {loginName ? loginName.toUpperCase() : 'STUDENT'} • {stdname || 'User'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {!quizActive ? (
          <>
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex justify-between items-center">
                  <p className="text-gray-500 text-sm">Completed Subjects</p>
                  <div className="bg-green-100 p-2 rounded-full">
                    <Check size={16} className="text-green-600" />
                  </div>
                </div>
                <p className="text-xl font-bold mt-1">{completedSubjects}/{subjects.length}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${completedPercentage}%` }} />
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex justify-between items-center">
                  <p className="text-gray-500 text-sm">Average Score</p>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Award size={16} className="text-blue-600" />
                  </div>
                </div>
                <p className="text-xl font-bold mt-1">{avgScore.toFixed(1)}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${avgScore}%` }} />
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex justify-between items-center">
                  <p className="text-gray-500 text-sm">Remaining Subjects</p>
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Clock size={16} className="text-purple-600" />
                  </div>
                </div>
                <p className="text-xl font-bold mt-1">{subjects.length - completedSubjects}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${subjects.length - completedSubjects > 0 ? ((subjects.length - completedSubjects) / subjects.length) * 100 : 0}%` }} />
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={handleProceedToProgramming}
                className={`py-2 px-4 rounded-md text-white font-medium ${
                  allSubjectsStarted ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={!allSubjectsStarted}
              >
                Proceed to Programming Skills
              </button>
            </div>

            {/* Subject Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((subject) => {
                const subjectInfo = subjectData[subject.code] || { completed: false, attempts: 0, scores: {} };
                const attemptsLeft = MAX_ATTEMPTS - subjectInfo.attempts;
                
                return (
                  <div key={subject.code} className="bg-white border rounded-lg shadow-sm">
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{subject.display}</h3>
                        {subjectInfo.completed ? (
                          <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded">
                            Attempted
                          </span>
                        ) : (
                          <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">
                            Available
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-500 mb-2">Attempts: {subjectInfo.attempts}/{MAX_ATTEMPTS}</p>
                      
                      {Object.keys(subjectInfo.scores || {}).length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Scores:</p>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(subjectInfo.scores).map(([attempt, score]) => (
                              <span key={attempt} className="bg-gray-100 text-xs px-1.5 py-0.5 rounded">
                                #{attempt}: {score}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <button
                        onClick={() => handleStartQuiz(subject)}
                        disabled={subjectInfo.attempts >= MAX_ATTEMPTS}
                        className={`w-full py-1.5 rounded text-sm font-medium ${
                          subjectInfo.attempts >= MAX_ATTEMPTS
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {subjectInfo.attempts >= MAX_ATTEMPTS
                          ? 'All Attempts Used'
                          : subjectInfo.completed
                            ? `Continue (${attemptsLeft} left)`
                            : 'Start Test'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Quiz Interface */
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold">{selectedSubject?.display} Test</h2>
                <p className="text-sm text-gray-500">
                  Attempt #{selectedSubject?.attemptNumber}/{MAX_ATTEMPTS}
                </p>
              </div>
              <div className="flex items-center">
                <div className="text-red-600 font-medium mr-3">
                  <Clock size={16} className="inline mr-1" /> {formatTime(timer)}
                </div>
                <button 
                  onClick={handleExitQuiz}
                  className="p-1 text-gray-500 hover:bg-gray-100 rounded-full"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Questions */}
            {currentQuestions.length > 0 ? (
              <div className="space-y-4">
                {currentQuestions.map((question, index) => (
                  <div key={question.q_no} className="p-3 border rounded-lg">
                    <h3 className="font-medium mb-2">
                      Q{startIndex + index + 1}. {question.question}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {[1, 2, 3, 4].map((optionNum) => (
                        <label 
                          key={optionNum} 
                          className={`flex items-center p-2 rounded border cursor-pointer ${
                            selectedAnswers[question.q_no] === question[`option_${optionNum}`] 
                              ? 'bg-blue-50 border-blue-300' 
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q${question.q_no}`}
                            value={question[`option_${optionNum}`]}
                            checked={selectedAnswers[question.q_no] === question[`option_${optionNum}`]}
                            onChange={() => handleAnswerSelect(question.q_no, question[`option_${optionNum}`])}
                            className="mr-2"
                          />
                          <span>{question[`option_${optionNum}`]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="mt-4 flex justify-between items-center">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded font-medium disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-7 h-7 rounded-full text-sm ${
                          currentPage === i + 1
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  
                  {currentPage === totalPages ? (
                    <button
                      onClick={handleSubmitQuiz}
                      className="px-4 py-1 bg-green-600 text-white rounded font-medium"
                    >
                      Submit
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="px-3 py-1 bg-blue-600 text-white rounded font-medium"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-600">Loading questions...</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Score Modal */}
      {showScoreModal && lastScore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-4 max-w-sm w-full">
            <div className="text-center mb-4">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="text-green-600" size={24} />
              </div>
              <h3 className="text-lg font-bold">Quiz Completed!</h3>
              <p className="text-gray-600">{lastScore.subject.display}</p>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Score:</span>
                <span className="font-medium">{lastScore.score}/{lastScore.total}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Attempt:</span>
                <span className="font-medium">{lastScore.subject.attemptNumber}/{MAX_ATTEMPTS}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {lastScore.subject.attemptNumber < MAX_ATTEMPTS && (
                <button
                  onClick={() => {
                    setShowScoreModal(false);
                    handleStartQuiz({
                      ...lastScore.subject,
                      attemptNumber: lastScore.subject.attemptNumber + 1
                    });
                  }}
                  className="flex-1 py-2 bg-blue-600 text-white rounded font-medium"
                >
                  Try Again
                </button>
              )}
              
              <button
                onClick={handleCloseScoreModal}
                className="flex-1 py-2 bg-gray-100 text-gray-700 rounded font-medium"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
      <Routes>
        <Route
          path="/program-skill"
          element={<ProgramSkill setProgramStatus={setProgramStatus} usn={usn} />}
        />
      </Routes>
    </div>
  );
}

export default UnifiedDashboard;
import React, { useState, useEffect } from "react";
import { Book, Check, ChevronDown, Clock, Award, X } from "lucide-react";
import axios from "axios";

function UnifiedDashboard({ loginName, stdname, usn , setTechnicalStatus }) {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [completedTests, setCompletedTests] = useState([]);
  const [quizActive, setQuizActive] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timer, setTimer] = useState(900); // 15 minutes
  const [currentPage, setCurrentPage] = useState(1);
  const [startTime, setStartTime] = useState(null);
  const questionsPerPage = 5;
  //const [techStatus, setTechnicalStatus] = useState(false);

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

  // Fetch completed tests
  useEffect(() => {
    const fetchCompletedTests = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/getUserCompletedTests/${usn}`);
        setCompletedTests(response.data.map(test => test.sub_name));
      } catch (error) {
        console.error("Error fetching completed tests:", error);
        // For testing
        // setCompletedTests(["PS", "OS"]);
      }
    };
    fetchCompletedTests();
  }, [usn]);

  const handleStartQuiz = (subject) => {
    setSelectedSubject(subject);
    setQuizActive(true);
    setCurrentPage(1);
    setSelectedAnswers({});
    setTimer(900);
    
    // Fetch questions
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/getTechSubQuestionsByName/${subject.code}`);
        setQuestions(response.data);
        setStartTime(new Date());
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();
    
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
    
    return () => clearInterval(countdown);
  };

  const handleAnswerSelect = (q_no, option) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [q_no.toString()]: option,
    }));
  };

  const handleSubmitQuiz = async () => {
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
    const timeTaken = Math.floor((endTime - startTime) / 1000);

    const submissionData = {
      usn,
      sub_name: selectedSubject.code,
      score,
      attempt_no: 1,
      quiz_date: new Date().toISOString(),
      time_taken: timeTaken,
    };

    try {
      await axios.post("http://localhost:8080/api/storeScores", submissionData);
      alert(`✔️ ${selectedSubject.display} Quiz Submitted Successfully!\n\nScore: ${score}/${totalQuestions}\nTime Taken: ${formatTime(timeTaken)}`);
      setCompletedTests(prev => [...prev, selectedSubject.code]);
      if(completedTests.length==5)
      setTechnicalStatus(true);
    } catch (error) {
      console.error("Error submitting quiz", error);
      alert("❌ Failed to submit quiz. Please try again.");
    }
    
    setQuizActive(false);
    setSelectedSubject(null);
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
                <span className="font-medium">{loginName.toUpperCase()} • {stdname}</span>
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
                      style={{ width: `${(completedTests.length / subjects.length) * 100}%` }} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 uppercase font-medium">Average Score</p>
                    <p className="text-2xl font-bold text-gray-800">82%</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '82%' }} />
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
                      style={{ width: `${((subjects.length - completedTests.length) / subjects.length) * 100}%` }} 
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
                return (
                  <div 
                    key={subject.code}
                    className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow
                      ${isCompleted ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'}`}
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-800">{subject.display}</h3>
                        {isCompleted ? (
                          <span className="bg-green-100 text-green-600 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                            <Check size={12} className="mr-1" /> Completed
                          </span>
                        ) : (
                          <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-0.5 rounded">
                            Available
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Subject Code: {subject.code}</p>
                      <div className="mt-4">
                        <button
                          onClick={() => handleStartQuiz(subject)}
                          disabled={isCompleted}
                          className={`w-full py-2 rounded-md font-medium text-sm
                            ${isCompleted 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                              : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        >
                          {isCompleted ? 'Test Completed' : 'Start Test'}
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
                <h2 className="text-xl font-semibold text-gray-800">{selectedSubject.display} Test</h2>
                <p className="text-sm text-gray-500">Answer all questions to complete the test</p>
              </div>
              <div className="flex items-center">
                <div className="text-red-600 font-medium flex items-center">
                  <Clock size={20} className="mr-2" /> {formatTime(timer)}
                </div>
                <button 
                  onClick={() => {
                    if(window.confirm("Are you sure you want to exit? Your progress will be lost.")) {
                      setQuizActive(false);
                      setSelectedSubject(null);
                    }
                  }}
                  className="ml-4 p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

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
          </div>
        )}
      </div>
    </div>
  );
}

export default UnifiedDashboard;
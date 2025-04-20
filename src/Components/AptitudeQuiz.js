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
  }, [quizStatus, timeRemaining ]);

  useEffect(() => {
    fetchQuestions();
    checkAttempts();
  }, [attemptNumber]);

  const checkAttempts = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/getAptiscore/${usn}`);
      console.log("iamhere")
      console.log(response.data)
      if (response.data && response.data.length > 0) {
        // Find the highest attempt number
        const highestAttempt = Math.max(...response.data.map(attempt => attempt.attempt_no));
       // alert(highestAttempt)
        if (highestAttempt >= MAX_ATTEMPTS) {
          setMaxAttemptsReached(true);
        } else {
          setAttemptNumber(highestAttempt + 1);
        }
      } else {
        alert("iamhere")
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
    if (timeRemaining < 300) return "text-red-600 animate-pulse";
    if (timeRemaining < 600) return "text-orange-500";
    return "text-blue-600";
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={48} />
          <p className="text-xl">Loading Questions...</p>
        </div>
      </div>
    );
  }

  if (maxAttemptsReached) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md w-full">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={64} />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Maximum Attempts Reached</h1>
          <p className="text-gray-600">Sorry, {uname}. You've already used all {MAX_ATTEMPTS} attempts for the Aptitude quiz.</p>
        </div>
      </div>
    );
  }

  if (quizStatus === "completed") {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md w-full">
          <CheckCircle2 className="mx-auto text-green-500 mb-4" size={64} />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Quiz Completed!</h1>
          <p className="text-gray-600">Thanks, {uname}! Your responses are recorded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      {quizStatus === "not_started" ? (
        <div className="max-w-md mx-auto my-auto bg-white shadow-xl rounded-xl p-8 text-center">
          <h1 className="text-3xl font-bold text-blue-800 mb-4">Welcome, {uname} - {stdname}</h1>
          <ClipboardList size={48} className="text-blue-500 mx-auto mb-4" />
          <div className="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-200">
            <p className="font-semibold text-blue-800">Attempt: {attemptNumber} of {MAX_ATTEMPTS}</p>
          </div>
          <ul className="text-gray-700 text-left space-y-2 mb-6">
            <li><CheckCircle size={16} className="inline mr-2 text-green-500" /> Total Questions: {questions.length}</li>
            <li><CheckCircle size={16} className="inline mr-2 text-green-500" /> Time Limit: 30 minutes</li>
            <li><CheckCircle size={16} className="inline mr-2 text-green-500" /> Subject: Aptitude</li>
          </ul>
          <button
            onClick={startQuiz}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all"
          >
            Start Quiz
          </button>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <ClipboardList size={24} />
                <h2 className="text-xl font-bold text-blue-700">Aptitude Quiz</h2>
              </div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                Attempt {attemptNumber}/{MAX_ATTEMPTS}
              </div>
            </div>
            <div className={`font-bold ${getTimeClass()}`}>
              <Timer size={20} className="inline mr-1" />
              {formatTime(timeRemaining)}
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4 text-lg font-semibold text-gray-800">
              Q{currentPage + 1}: {currentQuestion?.question}
            </div>
            <div className="space-y-2">
              {["option_1", "option_2", "option_3", "option_4"].map((optKey, i) => (
                <label
                  key={i}
                  className={`block p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedAnswers[currentQuestion.q_no] === i + 1
                      ? "bg-blue-100 border-blue-400"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.q_no}`}
                    value={i + 1}
                    className="mr-2"
                    checked={selectedAnswers[currentQuestion.q_no] === i + 1}
                    onChange={() => handleChange(currentQuestion.q_no, i + 1)}
                  />
                  {currentQuestion[optKey]}
                </label>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className="flex items-center px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                <ChevronLeft /> Prev
              </button>
              <button
                onClick={() => toggleFlagQuestion(currentQuestion.q_no)}
                className={`px-4 py-2 rounded ${
                  flaggedQuestions[currentQuestion.q_no] ? "bg-yellow-200" : "bg-gray-100"
                } hover:bg-yellow-300`}
              >
                <Flag className="inline mr-2" />
                {flaggedQuestions[currentQuestion.q_no] ? "Unflag" : "Flag"}
              </button>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                className="flex items-center px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Next <ChevronRight />
              </button>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md"
              >
                {submitting ? "Submitting..." : "Submit Quiz"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AptitudeQuiz;
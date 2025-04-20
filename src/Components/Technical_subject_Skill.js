import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TechnicalSubjectQuiz = ({ sub_name, setTechnicalStatus, usn }) => {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timer, setTimer] = useState(900); // 15 minutes
  const [currentPage, setCurrentPage] = useState(1);
  const [startTime, setStartTime] = useState(null);
  const questionsPerPage = 5;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/getTechSubQuestionsByName/${sub_name}`);
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();
  }, [sub_name]);

  useEffect(() => {
    setStartTime(new Date());
    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, [questions]);

  const handleAnswerSelect = (q_no, option) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [q_no.toString()]: option,
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

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
    const timeTaken = Math.floor((endTime - startTime) / 1000); // seconds

    const submissionData = {
      usn,
      sub_name,
      score,
      attempt_no: 1,
      quiz_date: new Date().toISOString(),
      time_taken: timeTaken,
    };

    try {
      await axios.post("http://localhost:8080/api/storeScores", submissionData);
      alert(`✔️ ${sub_name} Quiz Submitted Successfully!\n\nScore: ${score}/${totalQuestions}\nTime Taken: ${formatTime(timeTaken)}`);
      setTechnicalStatus(true);
    } catch (error) {
      console.error("Error submitting quiz", error);
      alert("❌ Failed to submit quiz. Please try again.");
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

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Subject: {sub_name}</h2>
        <div className="text-red-600 font-semibold">⏱️ Time Left: {formatTime(timer)}</div>
      </div>

      {currentQuestions.map((question, index) => (
        <div key={question.q_no} className="mb-6">
          <h3 className="font-semibold mb-2">
            Q{startIndex + index + 1}. {question.question}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[question.option_1, question.option_2, question.option_3, question.option_4].map((opt, i) => (
              <label key={i} className="flex items-center space-x-2 cursor-pointer bg-gray-100 px-3 py-2 rounded hover:bg-gray-200">
                <input
                  type="radio"
                  name={`q${question.q_no}`}
                  value={opt}
                  checked={selectedAnswers[question.q_no] === opt}
                  onChange={() => handleAnswerSelect(question.q_no, opt)}
                  className="accent-blue-600"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
};

export default TechnicalSubjectQuiz;

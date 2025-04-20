import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProgramSkill = ({ setTechnicalStatus, setProgramStatus, usn }) => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [maxAttemptsReached, setMaxAttemptsReached] = useState(false);
  
  const MAX_ATTEMPTS = 3; // Define the maximum allowed attempts
  const navigate = useNavigate();

  useEffect(() => {
    checkAttempts(); // Call checkAttempts when component mounts
    fetchQuestions();
  }, [attemptNumber]);

  const fetchQuestions = () => {
    setLoading(true);
    axios
      .get("http://localhost:8080/api/getAllProgramQuestions")
      .then((res) => {
        setQuestions(res.data);
        setUserAnswers(new Array(res.data.length).fill(null));
        setStartTime(new Date());
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions. Please try again later.");
        setLoading(false);
      });
  };

  const checkAttempts = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/getProgAttempt_no/${usn}`);
      console.log("Checking attempts for user:", usn);
      console.log("Attempts data:", response.data);
      
      if (response.data && response.data.length > 0) {
        // Filter for only Program-Skill attempts
        const programSkillAttempts = response.data.filter(
          attempt => attempt.sub_name === "Program-Skill"
        );
        
        if (programSkillAttempts.length > 0) {
          // Find the highest attempt number
          const highestAttempt = Math.max(
            ...programSkillAttempts.map(attempt => attempt.attempt_no)
          );
          
          if (highestAttempt >= MAX_ATTEMPTS) {
            setMaxAttemptsReached(true);
            alert(`You have already reached the maximum of ${MAX_ATTEMPTS} attempts for this assessment.`);
            navigate("/test-chooser");
          } else {
            setAttemptNumber(highestAttempt + 1);
            console.log(`Set attempt number to ${highestAttempt + 1}`);
          }
        } else {
          // No previous Program-Skill attempts
          setAttemptNumber(1);
          console.log("No previous attempts found, setting attempt to 1");
        }
      } else {
        // No previous attempts at all
        setAttemptNumber(1);
        console.log("No previous attempts found, setting attempt to 1");
      }
    } catch (err) {
      console.error("Error checking attempt count", err);
      // Default to 1 if we can't check
      setAttemptNumber(1);
    }
  };

  const handleOptionClick = (index) => {
    if (userAnswers[current] !== null) return;

    const newAnswers = [...userAnswers];
    newAnswers[current] = index;
    setUserAnswers(newAnswers);
    setSelected(index);
  };

  const calculateTimeTaken = () => {
    const endTime = new Date();
    const seconds = Math.floor((endTime - startTime) / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  const submitMarks = async () => {
    const totalQuestions = questions.length;
    const unanswered = userAnswers.filter((ans) => ans === null).length;

    if (unanswered > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unanswered} unanswered question(s). Are you sure you want to submit?`
      );
      if (!confirmSubmit) return;
    }

    let score = 0;
    questions.forEach((q, i) => {
      if (userAnswers[i] === q.correct_ans_no - 1) score++;
    });

    const submissionData = {
      usn: usn,
      sub_name: "Program-Skill",
      score: score,
      attempt_no: attemptNumber, // Use the determined attempt number
      quiz_date: new Date().toISOString(),
      timetaken: calculateTimeTaken(),
    };
    console.log("Submitting score data:", submissionData);

    try {
      await axios.post("http://localhost:8080/api/Progscore", submissionData);
      alert(`Quiz submitted! Your score: ${score}/${totalQuestions}`);
      setProgramStatus(true);
      navigate("/test-chooser");
    } catch (error) {
      console.error("Error submitting quiz", error);
      alert("Failed to submit quiz. Please try again.");
    }
  };

  const nextQuestion = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(userAnswers[current + 1]);
    }
  };

  const previousQuestion = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setSelected(userAnswers[current - 1]);
    }
  };

  if (maxAttemptsReached) {
    return (
      <div className="max-w-2xl mx-auto mt-16 bg-red-50 p-6 rounded-lg border border-red-200">
        <p className="text-center text-lg font-semibold text-red-600">
          You have already reached the maximum number of attempts for this assessment.
        </p>
        <button
          onClick={() => navigate("/test-chooser")}
          className="mt-4 mx-auto block py-2 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
        >
          Back to Test Selection
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-lg font-semibold mt-4 text-gray-700">Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-16 bg-red-50 p-6 rounded-lg border border-red-200">
        <p className="text-center text-lg font-semibold text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 mx-auto block py-2 px-6 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="max-w-2xl mx-auto mt-16 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <p className="text-center text-lg font-semibold text-yellow-700">No questions available.</p>
      </div>
    );
  }

  const { problem_statement, correct_ans_no, option_1, option_2, option_3, option_4 } = questions[current];
  const options = [option_1, option_2, option_3, option_4];

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-10 border border-gray-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">Programming Skills Assessment</h2>
        <div className="flex justify-center mt-2">
          <div className="bg-blue-100 px-4 py-1 rounded-full">
            <span className="text-sm font-medium text-blue-800">
              Question {current + 1} of {questions.length}
            </span>
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <div className="bg-yellow-100 px-4 py-1 rounded-full">
            <span className="text-sm font-medium text-yellow-800">
              Attempt {attemptNumber} of {MAX_ATTEMPTS}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6 border-l-4 border-blue-500">
        <p className="text-lg font-medium text-gray-800">{problem_statement}</p>
      </div>

      <div className="space-y-3">
        {options.map((option, index) => {
          let optionStyle = "bg-white hover:bg-blue-50 border border-gray-300";

          if (userAnswers[current] !== null) {
            if (index === correct_ans_no - 1) {
              optionStyle = "bg-green-100 border border-green-500 text-green-800";
            } else if (userAnswers[current] === index) {
              optionStyle = "bg-red-100 border border-red-500 text-red-800";
            } else {
              optionStyle = "bg-gray-100 border border-gray-300 text-gray-500";
            }
          }

          return (
            <div
              key={index}
              className={`flex items-center p-4 rounded-lg cursor-pointer transition-all ${optionStyle} ${userAnswers[current] !== null ? "" : "hover:border-blue-400"}`}
              onClick={() => handleOptionClick(index)}
            >
              <div className="flex items-center justify-center mr-4">
                <div className={`w-5 h-5 rounded-full border ${userAnswers[current] === index ? "border-0 bg-blue-600" : "border-gray-400"} flex items-center justify-center`}>
                  {userAnswers[current] === index && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
              </div>
              <span className="text-lg">{option}</span>
              {userAnswers[current] !== null && index === correct_ans_no - 1 && (
                <svg className="w-5 h-5 ml-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {userAnswers[current] !== null && (
        <div className="mt-8">
          <div className={`p-4 rounded-lg mb-4 ${userAnswers[current] === correct_ans_no - 1 ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
            <p className={`font-medium ${userAnswers[current] === correct_ans_no - 1 ? "text-green-800" : "text-red-800"}`}>
              {userAnswers[current] === correct_ans_no - 1
                ? "Correct! Great job!"
                : `Incorrect. The correct answer is: ${options[correct_ans_no - 1]}`}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={previousQuestion}
              disabled={current === 0}
              className={`flex-1 py-3 font-semibold text-lg rounded-lg transition-all flex items-center justify-center ${
                current === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <button
              onClick={current < questions.length - 1 ? nextQuestion : submitMarks}
              className="flex-1 py-3 bg-blue-600 text-white font-semibold text-lg rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
            >
              {current < questions.length - 1 ? (
                <>
                  Next Question
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </>
              ) : (
                <>
                  Complete Assessment
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramSkill;
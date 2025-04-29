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
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes in seconds
  
  const MAX_ATTEMPTS = 3;
  const navigate = useNavigate();

  useEffect(() => {
    checkAttempts();
    fetchQuestions();
  }, [attemptNumber]);

  // Timer countdown
  useEffect(() => {
    if (!loading && !maxAttemptsReached) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 0) {
            clearInterval(timer);
            submitMarks();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [loading, maxAttemptsReached]);

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
        const programSkillAttempts = response.data.filter(
          attempt => attempt.sub_name === "Program-Skill"
        );
        
        if (programSkillAttempts.length > 0) {
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
          setAttemptNumber(1);
          console.log("No previous attempts found, setting attempt to 1");
        }
      } else {
        setAttemptNumber(1);
        console.log("No previous attempts found, setting attempt to 1");
      }
    } catch (err) {
      console.error("Error checking attempt count", err);
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
      attempt_no: attemptNumber,
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

  const getProgressBarWidth = () => {
    return `${((current + 1) / questions.length) * 100}%`;
  };

  if (maxAttemptsReached) {
    return (
      <div className="max-w-xl mx-auto mt-8 bg-amber-50 p-6 rounded-lg border border-amber-200 shadow-md">
        <div className="flex items-center justify-center mb-3 text-amber-600">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-center text-amber-800 mb-3">Assessment Limit Reached</h2>
        <p className="text-center text-amber-700 mb-4">
          You have already reached the maximum number of attempts for this assessment.
        </p>
        <button
          onClick={() => navigate("/test-chooser")}
          className="mx-auto block py-2 px-6 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-md w-full sm:w-auto sm:mx-auto"
        >
          Return to Test Selection
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-xl mx-auto mt-8 text-center p-6 bg-white rounded-lg shadow-md">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
        <p className="font-medium mt-4 text-gray-700">Loading your assessment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-8 bg-red-50 p-6 rounded-lg border border-red-200 shadow-md">
        <div className="flex items-center justify-center mb-3 text-red-600">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-center text-red-800 mb-3">Error Loading Assessment</h2>
        <p className="text-center text-red-700 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mx-auto block py-2 px-6 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-md w-full sm:w-auto sm:mx-auto"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="max-w-xl mx-auto mt-8 bg-yellow-50 p-6 rounded-lg border border-yellow-200 shadow-md">
        <div className="flex items-center justify-center mb-3 text-yellow-600">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-center text-yellow-800 mb-3">No Questions Available</h2>
        <p className="text-center text-yellow-700">The assessment questions could not be loaded at this time.</p>
      </div>
    );
  }

  const { problem_statement, correct_ans_no, option_1, option_2, option_3, option_4 } = questions[current];
  const options = [option_1, option_2, option_3, option_4];
  const answered = userAnswers.filter(answer => answer !== null).length;

  return (
    <div className="max-w-3xl mx-auto my-6 px-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-t-lg shadow-md">
        <div className="p-4">
          <h1 className="text-xl font-bold text-white mb-1">Programming Skills Assessment</h1>
          
          <div className="flex flex-wrap justify-between items-center gap-2 mt-2">
            <div className="flex flex-wrap gap-2">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-medium text-white">
                Attempt {attemptNumber}/{MAX_ATTEMPTS}
              </div>
              
              <div className="bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-medium text-white">
                {answered}/{questions.length} Answered
              </div>
            </div>
            
            <div className="bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-medium text-white flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Time: {formatTime(timeRemaining)}
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-indigo-800 h-1">
          <div 
            className="bg-green-400 h-1 transition-all duration-300 ease-in-out"
            style={{ width: getProgressBarWidth() }}
          ></div>
        </div>
      </div>
      
      {/* Question navigation */}
      <div className="bg-white p-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <span className="bg-indigo-600 text-white font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 text-xs">
            {current + 1}
          </span>
          <span className="text-gray-700 text-sm">of {questions.length}</span>
        </div>
        
        <div className="flex overflow-x-auto py-1 gap-1 max-w-xs">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrent(idx);
                setSelected(userAnswers[idx]);
              }}
              className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium flex-shrink-0
                ${current === idx ? 'bg-indigo-600 text-white' : ''} 
                ${userAnswers[idx] !== null ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-gray-100 text-gray-700 border border-gray-300'}
              `}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
      
      {/* Question and answers */}
      <div className="bg-white shadow-md rounded-b-lg overflow-hidden">
        <div className="p-4">
          <div className="bg-indigo-50 p-4 rounded-lg mb-4 border-l-4 border-indigo-400">
            <p className="font-medium text-gray-800 whitespace-pre-line">{problem_statement}</p>
          </div>

          <div className="space-y-3 mb-4">
            {options.map((option, index) => {
              let optionStyle = "bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50";
              let textStyle = "text-gray-800";
              let iconElement = null;

              if (userAnswers[current] !== null) {
                if (index === correct_ans_no - 1) {
                  optionStyle = "bg-green-50 border border-green-300";
                  textStyle = "text-green-800";
                  iconElement = (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  );
                } else if (userAnswers[current] === index) {
                  optionStyle = "bg-red-50 border border-red-300";
                  textStyle = "text-red-800";
                  iconElement = (
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  );
                } else {
                  optionStyle = "bg-gray-50 border border-gray-200";
                  textStyle = "text-gray-500";
                }
              }

              return (
                <div
                  key={index}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${optionStyle} ${userAnswers[current] !== null ? "" : "hover:shadow-sm"}`}
                  onClick={() => handleOptionClick(index)}
                >
                  <div className="flex items-center justify-center mr-3">
                    <div className={`w-5 h-5 rounded-full ${userAnswers[current] === index ? "bg-indigo-600 text-white flex items-center justify-center" : "border-2 border-gray-300"}`}>
                      {userAnswers[current] === index && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                  </div>
                  <span className={`${textStyle}`}>{option}</span>
                  {iconElement && <div className="ml-auto">{iconElement}</div>}
                </div>
              );
            })}
          </div>

          {userAnswers[current] !== null && (
            <div className="mb-4">
              <div className={`p-3 rounded-lg ${userAnswers[current] === correct_ans_no - 1 ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                <div className="flex items-start">
                  {userAnswers[current] === correct_ans_no - 1 ? (
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <p className={`font-medium text-sm ${userAnswers[current] === correct_ans_no - 1 ? "text-green-800" : "text-red-800"}`}>
                    {userAnswers[current] === correct_ans_no - 1
                      ? "Correct! Great job!"
                      : `Incorrect. The correct answer is: ${options[correct_ans_no - 1]}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={previousQuestion}
              disabled={current === 0}
              className={`flex-1 py-2 px-3 font-medium text-sm rounded-lg transition-all flex items-center justify-center ${
                current === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            {userAnswers[current] === null ? (
              <button
                onClick={() => {
                  if (current < questions.length - 1) {
                    nextQuestion();
                  } else {
                    const confirmSubmit = window.confirm("Are you sure you want to submit your assessment?");
                    if (confirmSubmit) submitMarks();
                  }
                }}
                className="flex-1 py-2 px-3 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center"
              >
                {current < questions.length - 1 ? "Skip Question" : "Submit Assessment"}
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={current < questions.length - 1 ? nextQuestion : submitMarks}
                className="flex-1 py-2 px-3 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center"
              >
                {current < questions.length - 1 ? (
                  <>
                    Next
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    Submit
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramSkill;
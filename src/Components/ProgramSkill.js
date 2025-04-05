import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProgramSkill = ({ setTechnicalStatus, setProgramStatus }) => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Track user's answers for each question
  const [userAnswers, setUserAnswers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8080/api/getAllProgramQuestions")
      .then((res) => {
        setQuestions(res.data);
        // Initialize userAnswers array with nulls
        setUserAnswers(new Array(res.data.length).fill(null));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleOptionClick = (index) => {
    if (userAnswers[current] !== null) return;
    
    // Create a new array to avoid direct state mutation
    const newAnswers = [...userAnswers];
    newAnswers[current] = index;
    setUserAnswers(newAnswers);
    setSelected(index);
  };

  const nextQuestion = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(userAnswers[current + 1]);
    } else {
      setProgramStatus(true);
      navigate("/test-chooser");
    }
  };

  const previousQuestion = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setSelected(userAnswers[current - 1]);
    }
  };

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
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6 border-l-4 border-blue-500">
        <p className="text-lg font-medium text-gray-800">{problem_statement}</p>
      </div>

      <div className="space-y-3">
        {options.map((option, index) => {
          // Determine the style based on selection state
          let optionStyle = "bg-white hover:bg-blue-50 border border-gray-300";
          
          if (selected !== null) {
            if (index === correct_ans_no - 1) {
              optionStyle = "bg-green-100 border border-green-500 text-green-800";
            } else if (selected === index) {
              optionStyle = "bg-red-100 border border-red-500 text-red-800";
            } else {
              optionStyle = "bg-gray-100 border border-gray-300 text-gray-500";
            }
          }

          return (
            <div 
              key={index}
              className={`flex items-center p-4 rounded-lg cursor-pointer transition-all ${optionStyle} ${selected !== null ? "" : "hover:border-blue-400"}`}
              onClick={() => handleOptionClick(index)}
            >
              <div className="flex items-center justify-center mr-4">
                <div className={`w-5 h-5 rounded-full border ${selected === index ? "border-0 bg-blue-600" : "border-gray-400"} flex items-center justify-center`}>
                  {selected === index && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
              </div>
              <span className="text-lg">{option}</span>
              {selected !== null && index === correct_ans_no - 1 && (
                <svg className="w-5 h-5 ml-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {selected !== null && (
        <div className="mt-8">
          <div className={`p-4 rounded-lg mb-4 ${selected === correct_ans_no - 1 ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
            <p className={`font-medium ${selected === correct_ans_no - 1 ? "text-green-800" : "text-red-800"}`}>
              {selected === correct_ans_no - 1 
                ? "Correct! Great job!" 
                : `Incorrect. The correct answer is: ${options[correct_ans_no - 1]}`}
            </p>
          </div>
          
          {/* Navigation buttons container */}
          <div className="flex gap-4">
            {/* Previous button */}
            <button
              onClick={previousQuestion}
              disabled={current === 0}
              className={`flex-1 py-3 font-semibold text-lg rounded-lg transition-all flex items-center justify-center
                ${current === 0 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Previous
            </button>
            
            {/* Next/Complete button */}
            <button
              onClick={nextQuestion}
              className="flex-1 py-3 bg-blue-600 text-white font-semibold text-lg rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
            >
              {current < questions.length - 1 ? (
                <>
                  Next Question
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </>
              ) : (
                <>
                  Complete Assessment
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-center text-sm text-gray-600 mt-2">
          {Math.round(((current + 1) / questions.length) * 100)}% complete
        </p>
      </div>
    </div>
  );
};

export default ProgramSkill;
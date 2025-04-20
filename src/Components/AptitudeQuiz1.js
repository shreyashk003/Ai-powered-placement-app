import React, { useEffect, useState } from "react";
import axios from "axios";

const AptitudeQuiz = ({ setAptiStatus, setusn, uname, usn, sub_name ,stdname }) => {
  const [attempts, setAttempts] = useState([]);
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [quizStarted, setQuizStarted] = useState(false);
  const [score, setScore] = useState(0); // Replace with actual scoring logic

  useEffect(() => {
    axios.get(`http://localhost:5000/api/aptiscore/${usn}`)
      .then(res => {
        const previousAttempts = res.data;
        setAttempts(previousAttempts);
        if (previousAttempts.length >= 3) {
          alert("You have completed all 3 attempts.");
        } else {
          setCurrentAttempt(previousAttempts.length + 1);
        }
      })
      .catch(err => console.error("Error loading attempts", err));
  }, [userId]);

  const handleSubmit = () => {
    axios.post("http://localhost:5000/api/aptiscore", {
      userId,
      score,
      attemptNumber: currentAttempt
    })
      .then(() => {
        alert(`Attempt ${currentAttempt} submitted successfully!`);
        setQuizStarted(false);
      })
      .catch(err => {
        alert("Submission failed: " + err.response?.data?.message);
      });
  };

  if (attempts.length >= 3) {
    return <p className="text-red-600 font-bold">You've used all 3 attempts.</p>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-xl rounded-lg">
      <h1 className="text-xl font-bold text-indigo-700 mb-4">
        Aptitude Test - Attempt {currentAttempt} of 3
      </h1>

      {!quizStarted ? (
        <button
          onClick={() => setQuizStarted(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Start Attempt {currentAttempt}
        </button>
      ) : (
        <>
          {/* Your quiz component here */}
          <p className="my-4 text-gray-700">[Quiz questions here]</p>
          
          {/* Simulate a score for demo */}
          <input
            type="number"
            placeholder="Score"
            value={score}
            onChange={e => setScore(parseInt(e.target.value))}
            className="border px-2 py-1 rounded"
          />
          
          <button
            onClick={handleSubmit}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Attempt
          </button>
        </>
      )}
    </div>
  );
};

export default AptitudeQuiz;

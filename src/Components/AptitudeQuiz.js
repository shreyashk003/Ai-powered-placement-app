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
  Loader2
} from "lucide-react";

const AptitudeQuiz = ({ setAptiStatus, setusn, uname, usn, sub_name ,stdname }) => {
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [flaggedQuestions, setFlaggedQuestions] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes
    const [quizStatus, setQuizStatus] = useState('not_started');
    const [startTime, setStartTime] = useState(null);
    const [attemptNumber, setAttemptNumber] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [showQuestionNav, setShowQuestionNav] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const questionsPerPage = 1; // Show one question at a time for better focus

    useEffect(() => {
        let timer;
        if (quizStatus === 'started' && timeRemaining > 0) {
            timer = setInterval(() => {
                setTimeRemaining(prev => prev - 1);
            }, 1000);
        } else if (quizStatus === 'started' && timeRemaining === 0) {
            handleSubmit();
        }
        return () => clearInterval(timer);
    }, [quizStatus, timeRemaining]);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/getAllAptitudeQuestions");
            setQuestions(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching questions", error);
            setIsLoading(false);
        }
    };

    const handleChange = (q_no, answer) => {
        setSelectedAnswers(prev => ({ ...prev, [q_no]: answer }));
    };

    const toggleFlagQuestion = (q_no) => {
        setFlaggedQuestions(prev => ({
            ...prev,
            [q_no]: !prev[q_no]
        }));
    };

    const calculateTimeTaken = () => {
        return startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setSubmitting(true);

        let score = 0;
        questions.forEach((question) => {
            if (selectedAnswers[question.q_no] === question.correct_ans_no) {
                score++;
            }
        });

        const totalQuestions = questions.length;
        const unansweredQuestions = totalQuestions - Object.keys(selectedAnswers).length;

        if (unansweredQuestions > 0) {
            const confirmSubmit = window.confirm(`You have ${unansweredQuestions} unanswered questions. Do you want to submit?`);
            if (!confirmSubmit) {
                setSubmitting(false);
                return;
            }
        }

        const submissionData = {
            usn: usn,
            sub_name: "Apti",
            answers: selectedAnswers,
            totalQuestions: totalQuestions,
            score: score,
            attempt_no: attemptNumber,
            quiz_date: new Date().toISOString(),
            timetaken: calculateTimeTaken()
        };

        try {
            await axios.post("http://localhost:8080/api/score", submissionData);
            setAptiStatus(true);
            setQuizStatus('completed');
            alert(`Quiz submitted! Your score: ${score}/${totalQuestions}`);
        } catch (error) {
            console.error("Error submitting quiz", error);
            alert("Failed to submit quiz. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const startQuiz = () => {
        setQuizStatus('started');
        setStartTime(Date.now());
    };

    const navigateToQuestion = (index) => {
        setCurrentPage(Math.floor(index / questionsPerPage));
        setShowQuestionNav(false);
    };

    const nextPage = () => {
        if (currentPage < Math.ceil(questions.length / questionsPerPage) - 1) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    // Get question status (answered, flagged, etc.)
    const getQuestionStatus = (questionIndex) => {
        const question = questions[questionIndex];
        if (!question) return 'unknown';
        
        if (flaggedQuestions[question.q_no]) return 'flagged';
        if (selectedAnswers[question.q_no]) return 'answered';
        return 'unanswered';
    };

    // Get warning class if time is running low
    const getTimeClass = () => {
        if (timeRemaining < 300) return 'text-red-600 animate-pulse'; // Less than 5 mins
        if (timeRemaining < 600) return 'text-orange-500'; // Less than 10 mins
        return 'text-blue-600';
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                    <Loader2 className="mx-auto mb-4 text-blue-600 animate-spin" size={48} />
                    <p className="text-xl text-gray-700">Loading Quiz Questions...</p>
                    <p className="text-gray-500 mt-2">Please wait while we prepare your test.</p>
                </div>
            </div>
        );
    }

    if (quizStatus === 'completed') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 flex flex-col items-center justify-center">
                <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center">
                    <CheckCircle2 className="mx-auto mb-4 text-green-500" size={64} />
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Quiz Completed!</h1>
                    <p className="text-gray-600 mb-6">Thank you for completing the Aptitude Quiz.</p>
                    <p className="bg-green-50 text-green-700 p-3 rounded-lg">Your responses have been recorded.</p>
                </div>
            </div>
        );
    }

    const startIndex = currentPage * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    const currentQuestions = questions.slice(startIndex, endIndex);
    const currentQuestion = currentQuestions[0];
    const totalPages = Math.ceil(questions.length / questionsPerPage);
    const percentComplete = ((currentPage + 1) / totalPages) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 flex flex-col">
            {quizStatus === 'not_started' ? (
                <div className="max-w-md mx-auto my-auto bg-white shadow-2xl rounded-2xl p-8 text-center">
                    <h1 className="text-3xl font-bold text-blue-800 mb-4">Welcome, {uname}-{stdname}</h1>
                    <div className="flex justify-center mb-6">
                        <ClipboardList className="text-blue-500" size={64} />
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h2 className="font-semibold text-blue-800 mb-2">Quiz Information</h2>
                        <ul className="text-left text-gray-700 space-y-2">
                            <li className="flex items-center">
                                <CheckCircle2 size={16} className="text-green-500 mr-2" />
                                <span>Total Questions: {questions.length}</span>
                            </li>
                            <li className="flex items-center">
                                <CheckCircle2 size={16} className="text-green-500 mr-2" />
                                <span>Time Limit: 30 minutes</span>
                            </li>
                            <li className="flex items-center">
                                <CheckCircle2 size={16} className="text-green-500 mr-2" />
                                <span>Subject: Aptitude Test</span>
                            </li>
                        </ul>
                    </div>
                    <p className="text-gray-600 mb-6">You are about to start the Aptitude Quiz. Click the button below when you're ready to begin.</p>
                    <button 
                        onClick={startQuiz} 
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg active:transform active:scale-95"
                    >
                        Start Quiz
                    </button>
                </div>
            ) : (
                <div className="container mx-auto max-w-4xl">
                    {/* Header with Timer and Progress */}
                    <div className="bg-white shadow-md rounded-t-lg p-4 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-blue-800 flex items-center"><ClipboardList className="mr-2" /> Aptitude Quiz</h2>
                        <div className="flex items-center space-x-4">
                            <button 
                                onClick={() => setShowQuestionNav(!showQuestionNav)} 
                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200"
                            >
                                Questions
                            </button>
                            <div className={`flex items-center space-x-1 ${getTimeClass()}`}>
                                <Timer className="text-current" />
                                <span className="font-bold text-current">{formatTime(timeRemaining)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-gray-200 h-2">
                        <div className="bg-blue-600 h-2 transition-all duration-300" style={{ width: `${percentComplete}%` }}></div>
                    </div>

                    {/* Question Navigation Panel (slides in from right) */}
                    {showQuestionNav && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-10 flex justify-end">
                            <div className="bg-white w-80 h-full p-4 overflow-y-auto">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-lg">Question Navigator</h3>
                                    <button onClick={() => setShowQuestionNav(false)} className="text-gray-500 hover:text-gray-700">
                                        ✕
                                    </button>
                                </div>
                                <div className="grid grid-cols-5 gap-2">
                                    {questions.map((question, index) => {
                                        const status = getQuestionStatus(index);
                                        let buttonClass = "flex items-center justify-center w-full h-10 rounded";
                                        
                                        switch(status) {
                                            case 'answered':
                                                buttonClass += " bg-green-100 text-green-700 border border-green-300";
                                                break;
                                            case 'flagged':
                                                buttonClass += " bg-yellow-100 text-yellow-700 border border-yellow-300";
                                                break;
                                            default:
                                                buttonClass += " bg-gray-100 text-gray-700 border border-gray-300";
                                        }
                                        
                                        return (
                                            <button 
                                                key={index} 
                                                className={`${buttonClass} ${currentPage === Math.floor(index / questionsPerPage) ? 'ring-2 ring-blue-500' : ''}`}
                                                onClick={() => navigateToQuestion(index)}
                                            >
                                                {index + 1}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="text-sm font-semibold mb-2">Legend:</div>
                                    <div className="flex items-center mb-1">
                                        <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-2"></div>
                                        <span className="text-sm">Answered</span>
                                    </div>
                                    <div className="flex items-center mb-1">
                                        <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded mr-2"></div>
                                        <span className="text-sm">Flagged</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded mr-2"></div>
                                        <span className="text-sm">Unanswered</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Quiz Content */}
                    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-b-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <span className="font-semibold text-gray-700">Question {startIndex + 1} of {questions.length}</span>
                            <button 
                                type="button"
                                onClick={() => toggleFlagQuestion(currentQuestion.q_no)}
                                className={`flex items-center ${flaggedQuestions[currentQuestion.q_no] ? 'text-yellow-600' : 'text-gray-400'} hover:text-yellow-600`}
                            >
                                <Flag size={16} className="mr-1" />
                                <span className="text-sm">{flaggedQuestions[currentQuestion.q_no] ? 'Flagged' : 'Flag for review'}</span>
                            </button>
                        </div>
                        
                        {/* Current Question */}
                        {currentQuestion && (
                            <div className="mb-8">
                                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                    <p className="font-semibold text-gray-800 text-lg">{currentQuestion.question}</p>
                                </div>
                                
                                <div className="space-y-3">
                                    {[1, 2, 3, 4].map((num) => (
                                        <label 
                                            key={num} 
                                            className={`
                                                block p-4 border-2 rounded-lg cursor-pointer transition duration-200
                                                ${selectedAnswers[currentQuestion.q_no] === num 
                                                    ? 'bg-blue-50 border-blue-500 shadow-md' 
                                                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}
                                            `}
                                        > 
                                            <div className="flex items-center">
                                                <div className={`
                                                    w-5 h-5 rounded-full border flex items-center justify-center mr-3
                                                    ${selectedAnswers[currentQuestion.q_no] === num 
                                                        ? 'border-blue-500 bg-blue-500' 
                                                        : 'border-gray-400'}
                                                `}>
                                                    {selectedAnswers[currentQuestion.q_no] === num && (
                                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                                    )}
                                                </div>
                                                <input 
                                                    type="radio" 
                                                    name={`q_${currentQuestion.q_no}`} 
                                                    value={num} 
                                                    checked={selectedAnswers[currentQuestion.q_no] === num} 
                                                    onChange={() => handleChange(currentQuestion.q_no, num)} 
                                                    className="hidden" 
                                                /> 
                                                <span className={selectedAnswers[currentQuestion.q_no] === num ? 'text-blue-700' : 'text-gray-700'}>
                                                    {currentQuestion[`option_${num}`]}
                                                </span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                            <button 
                                type="button" 
                                onClick={prevPage} 
                                disabled={currentPage === 0}
                                className={`
                                    flex items-center py-2 px-4 rounded-lg transition duration-300
                                    ${currentPage === 0 
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}
                                `}
                            >
                                <ChevronLeft size={18} className="mr-1" /> Previous
                            </button>
                            
                            {endIndex < questions.length ? (
                                <button 
                                    type="button" 
                                    onClick={nextPage} 
                                    className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                                >
                                    Next <ChevronRight size={18} className="ml-1" />
                                </button>
                            ) : (
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className={`
                                        flex items-center py-2 px-6 rounded-lg transition duration-300
                                        ${submitting 
                                            ? 'bg-green-400 cursor-not-allowed' 
                                            : 'bg-green-600 hover:bg-green-700'} text-white
                                    `}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 size={18} className="mr-2 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 size={18} className="mr-2" />
                                            Submit Quiz
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                        
                        {/* Question Progress Indicator */}
                        <div className="mt-8 pt-4 border-t border-gray-200">
                            <div className="flex justify-between text-sm text-gray-500">
                                <div>
                                    <span className="font-semibold text-blue-600">
                                        {Object.keys(selectedAnswers).length}
                                    </span> of {questions.length} answered
                                </div>
                                <div>
                                    <span className="font-semibold text-yellow-600">
                                        {Object.keys(flaggedQuestions).filter(key => flaggedQuestions[key]).length}
                                    </span> flagged for review
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AptitudeQuiz;
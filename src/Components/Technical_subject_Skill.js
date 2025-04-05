import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    BookOpen, 
    CheckCircle2, 
    AlertCircle, 
    Loader2, 
    Timer,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

function Technical_subject_Skill({ sub_name, setTechnicalStatus }) {
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes
    const [quizStatus, setQuizStatus] = useState('not_started');
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const questionsPerPage = 3;

    // Timer effect
    useEffect(() => {
        let timer;
        if (quizStatus === 'started' && timeRemaining > 0) {
            timer = setInterval(() => {
                setTimeRemaining(prev => prev - 1);
            }, 1000);
        } else if (timeRemaining === 0) {
            handleSubmit(null);
        }
        return () => clearInterval(timer);
    }, [quizStatus, timeRemaining]);

    // Fetch questions when subject changes
    useEffect(() => {
        fetchQuestions();
    }, [sub_name]);

    const fetchQuestions = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:8080/api/getTechSubQuestionsByName/${sub_name}`);
            setQuestions(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching questions", error);
            setError("Failed to load questions. Please try again.");
            setIsLoading(false);
        }
    };

    const handleChange = (q_no, answer) => {
        setSelectedAnswers(prev => ({ ...prev, [q_no]: answer }));
    };

    // Format time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        
        // Calculate score
        const totalQuestions = questions.length;
        const answeredQuestions = Object.keys(selectedAnswers).length;
        const unansweredQuestions = totalQuestions - answeredQuestions;

        // Validate submission
        if (unansweredQuestions > 0) {
            const confirmSubmit = window.confirm(`You have ${unansweredQuestions} unanswered questions. Do you want to submit?`);
            if (!confirmSubmit) return;
        }

        // Prepare submission data
        const submissionData = {
            subject: sub_name,
            answers: selectedAnswers,
            totalQuestions: totalQuestions
        };
        setTechnicalStatus(true); // Update status

        // TODO: Replace with actual API call to submit quiz
        console.log("Quiz Submission Data:", submissionData);

        setQuizStatus('completed');
        
        // Show results
        const correctAnswers = questions.filter(q => 
            selectedAnswers[q.q_no] === q.correct_option
        ).length;

        alert(`
            ${sub_name} Quiz Completed! 
            Total Questions: ${totalQuestions}
            Answered Questions: ${answeredQuestions}
            Correct Answers: ${correctAnswers}
            Score: ${((correctAnswers / totalQuestions) * 100).toFixed(2)}%
        `);
    };

    const startQuiz = () => {
        setQuizStatus('started');
    };
    
    // Calculate pagination values
    const totalPages = Math.ceil(questions.length / questionsPerPage);
    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
    
    // Page navigation functions
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo(0, 0);
        }
    };
    
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo(0, 0);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <Loader2 className="mx-auto mb-4 text-blue-600 animate-spin" size={48} />
                    <p className="text-lg text-gray-700">Loading {sub_name} Quiz...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center p-6 bg-white rounded-xl shadow-md max-w-md">
                    <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
                    <p className="text-lg text-red-700 mb-4">{error}</p>
                    <button 
                        onClick={fetchQuestions}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Quiz not started
    if (quizStatus === 'not_started') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 text-center">
                    <BookOpen className="mx-auto text-blue-600 mb-4" size={48} />
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">{sub_name} Quiz</h1>
                    <div className="bg-blue-50 p-4 rounded-md mb-4">
                        <h2 className="text-lg font-semibold text-blue-700 mb-2">Quiz Instructions</h2>
                        <ul className="text-left text-sm text-gray-600 space-y-1 list-disc list-inside">
                            <li>Total Questions: {questions.length}</li>
                            <li>Questions per page: {questionsPerPage}</li>
                            <li>Total Pages: {totalPages}</li>
                            <li>Time Limit: 25 minutes</li>
                            <li>Each question is mandatory</li>
                            <li>Select the best possible answer</li>
                        </ul>
                    </div>
                    <button 
                        onClick={startQuiz}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Start {sub_name} Quiz
                    </button>
                </div>
            </div>
        );
    }

    // Main quiz view
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg">
                {/* Quiz Header */}
                <div className="bg-white rounded-t-xl p-4 flex justify-between items-center border-b">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        <BookOpen className="mr-2" size={24} /> {sub_name} Technical Quiz
                    </h2>
                    <div className="flex items-center space-x-4">
                        <div className="text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded">
                            Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Timer className="text-red-500" size={20} />
                            <span className="font-bold text-lg text-red-600">
                                {formatTime(timeRemaining)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quiz Form */}
                <form 
                    onSubmit={handleSubmit} 
                    className="p-4 max-h-[70vh] overflow-y-auto"
                >
                    {currentQuestions.map((question, index) => (
                        <div 
                            key={question.q_no} 
                            className="border-b border-gray-200 pb-4 mb-4"
                        >
                            <p className="font-semibold text-base text-gray-800 mb-3">
                                {indexOfFirstQuestion + index + 1}. {question.question}
                            </p>
                            <div className="space-y-2">
                                {[1, 2, 3, 4].map((num) => (
                                    <label 
                                        key={num} 
                                        className={`
                                            block p-2 border rounded-md cursor-pointer transition duration-200
                                            ${selectedAnswers[question.q_no] === question[`option_${num}`]
                                                ? 'bg-blue-50 border-blue-500' 
                                                : 'hover:bg-gray-50 border-gray-300'}
                                            text-sm
                                        `}
                                    >
                                        <input
                                            type="radio"
                                            name={`q_${question.q_no}`}
                                            value={question[`option_${num}`]}
                                            checked={selectedAnswers[question.q_no] === question[`option_${num}`]}
                                            onChange={() => handleChange(question.q_no, question[`option_${num}`])}
                                            className="mr-2"
                                        />
                                        {question[`option_${num}`]}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Navigation and Submit Buttons */}
                    <div className="flex justify-between mt-6">
                        <button 
                            type="button"
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 flex items-center ${
                                currentPage === 1 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            } rounded-md transition`}
                        >
                            <ChevronLeft size={18} className="mr-1" /> Previous
                        </button>
                        
                        {currentPage === totalPages ? (
                            <button 
                                type="submit"
                                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center"
                            >
                                <CheckCircle2 size={18} className="mr-2" /> Submit Quiz
                            </button>
                        ) : (
                            <button 
                                type="button"
                                onClick={goToNextPage}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
                            >
                                Next <ChevronRight size={18} className="ml-1" />
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Technical_subject_Skill;
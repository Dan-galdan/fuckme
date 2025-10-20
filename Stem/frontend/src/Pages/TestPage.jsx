import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';

function TestPage() {
    const { testId } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [answers, setAnswers] = useState({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Debug logging
    console.log('🔍 TestPage mounted, testId:', testId);

    useEffect(() => {
        fetchTest();
    }, [testId]);

    useEffect(() => {
        if (test?.timeLimitSec) {
            setTimeLeft(test.timeLimitSec);
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        handleSubmitTest();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [test]);

    async function fetchTest() {
        try {
            console.log('🔍 Fetching test with ID:', testId);
            setIsLoading(true);
            const testData = await apiClient.getTestById(testId);
            console.log('🔍 Test data received:', testData);
            setTest(testData);
        } catch (error) {
            console.error('🔍 Failed to fetch test:', error);
        } finally {
            setIsLoading(false);
        }
    }

    function handleAnswerChange(questionId, value) {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    async function handleSubmitTest() {
        setIsSubmitting(true);
        try {
            const answerArray = Object.entries(answers).map(([questionId, answer]) => ({
                questionId,
                answer
            }));

            console.log('🔍 Submitting answers:', answerArray);
            const result = await apiClient.submitTestAttempt({
                testId: testId,
                answers: answerArray
            });

            console.log('🔍 Submission result:', result);
            navigate(`/physic/test/results/${result.attemptId}`);
        } catch (error) {
            console.error('🔍 Failed to submit test:', error);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-black flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600 dark:text-gray-400">Test ачааллаж байна...</p>
                </div>
            </div>
        );
    }

    if (!test) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-black flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Test олдсонгүй</h2>
                    <button
                        onClick={() => navigate('/physic/EYSH_beltgel')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Буцах
                    </button>
                </div>
            </div>
        );
    }

    const question = test.questions[currentQuestion];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-black py-8">
            <div className="max-w-4xl mx-auto px-6">
                {/* Test Header - Google Forms Style */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                {test.title}
                            </h1>
                            {test.description && (
                                <p className="text-slate-600 dark:text-gray-400">
                                    {test.description}
                                </p>
                            )}
                        </div>
                        {test.timeLimitSec > 0 && (
                            <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-3 py-2 rounded-lg font-mono text-lg font-bold">
                                ⏱️ {formatTime(timeLeft)}
                            </div>
                        )}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentQuestion + 1) / test.questions.length) * 100}%` }}
                        ></div>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-gray-400 mt-2">
                        Асуулт {currentQuestion + 1} / {test.questions.length}
                    </div>
                </div>

                {/* Question Card - Google Forms Style */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                            {question.stem}
                        </h2>

                        {/* Question Type Indicator */}
                        <div className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm px-3 py-1 rounded-full mb-4">
                            {question.kind === 'mcq' && 'Олон сонголттой'}
                            {question.kind === 'numeric' && 'Тоон хариулт'}
                            {question.kind === 'short_text' && 'Богино хариулт'}
                        </div>
                    </div>

                    {/* Answer Options - Google Forms Style */}
                    <div className="space-y-3">
                        {question.kind === 'mcq' && question.options?.map((option, index) => (
                            <label
                                key={option.id}
                                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${answers[question.id] === option.id
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name={`question-${question.id}`}
                                    value={option.id}
                                    checked={answers[question.id] === option.id}
                                    onChange={() => handleAnswerChange(question.id, option.id)}
                                    className="hidden"
                                />
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${answers[question.id] === option.id
                                        ? 'border-blue-500 bg-blue-500'
                                        : 'border-gray-400 dark:border-gray-500'
                                    }`}>
                                    {answers[question.id] === option.id && (
                                        <div className="w-2 h-2 rounded-full bg-white"></div>
                                    )}
                                </div>
                                <span className="text-slate-700 dark:text-gray-300">{option.text}</span>
                            </label>
                        ))}

                        {question.kind === 'numeric' && (
                            <input
                                type="number"
                                value={answers[question.id] || ''}
                                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white"
                                placeholder="Хариултаа оруулна уу..."
                            />
                        )}

                        {question.kind === 'short_text' && (
                            <textarea
                                value={answers[question.id] || ''}
                                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white h-32 resize-none"
                                placeholder="Хариултаа оруулна уу..."
                            />
                        )}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                    <button
                        onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestion === 0}
                        className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                    >
                        Өмнөх
                    </button>

                    {currentQuestion < test.questions.length - 1 ? (
                        <button
                            onClick={() => setCurrentQuestion(prev => prev + 1)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                        >
                            Дараах
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmitTest}
                            disabled={isSubmitting}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Илгээж байна...' : 'Дуусгах'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TestPage;
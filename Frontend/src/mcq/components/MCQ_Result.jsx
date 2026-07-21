import React from 'react';
import { useMCQ, ACTIONS } from '../MCQ_API_Context';
import '../assets/css/MCQ_Result.css';

const MCQ_Result = () => {
    const { 
        questions, 
        selectedAnswers, 
        score, 
        totalQuestions,
        dispatch,
        answeredCount
    } = useMCQ();

    // If no questions, show a message
    if (!questions || questions.length === 0) {
        return (
            <div className="mcq-result-empty">
                <i className="bi bi-inbox-fill"></i>
                <h3>No questions available</h3>
                <p>There was an error loading the quiz results.</p>
                <button 
                    className="mcq-action-btn back" 
                    onClick={() => dispatch({ type: ACTIONS.SELECT_CHAPTER, payload: null })}
                >
                    <i className="bi bi-arrow-left"></i> Back to Chapters
                </button>
            </div>
        );
    }

    // Calculate score based on selectedAnswers
    const calculateScore = () => {
        let correct = 0;
        questions.forEach(q => {
            const userAnswer = selectedAnswers[q.id];
            if (userAnswer !== undefined && userAnswer === q.correct_answer) {
                correct++;
            }
        });
        return correct;
    };

    const actualScore = score || calculateScore();
    const attempted = Object.keys(selectedAnswers || {}).length;
    const percentage = totalQuestions > 0 ? Math.round((actualScore / totalQuestions) * 100) : 0;

    const getResultMessage = () => {
        if (percentage >= 90) return '🌟 Excellent! Outstanding performance!';
        if (percentage >= 70) return '👏 Good job! Keep practicing!';
        if (percentage >= 50) return '📚 Not bad! Review the explanations below.';
        return '💪 Keep learning! Review your mistakes and try again.';
    };

    const getScoreColor = () => {
        if (percentage >= 70) return 'score-high';
        if (percentage >= 50) return 'score-medium';
        return 'score-low';
    };

    const handleRetry = () => {
        // Reset quiz but keep questions
        dispatch({ type: ACTIONS.RESET_QUIZ });
    };

    const handleBack = () => {
        dispatch({ type: ACTIONS.SELECT_CHAPTER, payload: null });
    };

    // Debug logs to check data
    console.log('📊 Result Debug:', {
        questions: questions.length,
        selectedAnswers,
        score: actualScore,
        totalQuestions,
        attempted
    });

    return (
        <div className="mcq-result-container">
            <div className="mcq-result-header">
                <h2 className="mcq-result-title">Quiz Complete! 🎉</h2>
                <p className="mcq-result-message">{getResultMessage()}</p>
            </div>

            <div className="mcq-result-score">
                <div className="mcq-score-circle">
                    <div className="mcq-score-number">{actualScore}</div>
                    <div className="mcq-score-total">/{totalQuestions}</div>
                </div>
                <div className={`mcq-score-percentage ${getScoreColor()}`}>
                    {percentage}%
                </div>
            </div>

            <div className="mcq-result-stats">
                <div className="mcq-stat-item correct">
                    <span className="mcq-stat-value">{actualScore}</span>
                    <span className="mcq-stat-label">Correct</span>
                </div>
                <div className="mcq-stat-item incorrect">
                    <span className="mcq-stat-value">{totalQuestions - actualScore}</span>
                    <span className="mcq-stat-label">Incorrect</span>
                </div>
                <div className="mcq-stat-item attempted">
                    <span className="mcq-stat-value">{attempted}</span>
                    <span className="mcq-stat-label">Attempted</span>
                </div>
                <div className="mcq-stat-item accuracy">
                    <span className="mcq-stat-value">{percentage}%</span>
                    <span className="mcq-stat-label">Accuracy</span>
                </div>
            </div>

            <div className="mcq-result-actions">
                <button className="mcq-action-btn retry" onClick={handleRetry}>
                    <i className="bi bi-arrow-repeat"></i> Retry Quiz
                </button>
                <button className="mcq-action-btn back" onClick={handleBack}>
                    <i className="bi bi-arrow-left"></i> Back to Chapters
                </button>
            </div>

            <div className="mcq-result-review">
                <h3 className="mcq-review-title">Detailed Review</h3>
                {questions.map((question, index) => {
                    const userAnswer = selectedAnswers[question.id];
                    const isCorrect = userAnswer !== undefined && userAnswer === question.correct_answer;
                    const isAnswered = userAnswer !== undefined;

                    return (
                        <div key={question.id || index} className={`mcq-review-item ${isCorrect ? 'review-correct' : (isAnswered ? 'review-incorrect' : 'review-skipped')}`}>
                            <div className="mcq-review-header">
                                <span className="mcq-review-number">Q{index + 1}.</span>
                                <span className={`mcq-review-status ${isCorrect ? 'correct' : (isAnswered ? 'incorrect' : 'skipped')}`}>
                                    {isCorrect ? '✅' : (isAnswered ? '❌' : '⏭️')}
                                </span>
                            </div>
                            <p className="mcq-review-question">{question.question_text || question.question}</p>
                            <div className="mcq-review-answers">
                                <div className="mcq-review-answer correct-answer">
                                    <strong>Correct:</strong> {question.options[question.correct_answer]}
                                </div>
                                {!isCorrect && isAnswered && (
                                    <div className="mcq-review-answer user-answer">
                                        <strong>Your Answer:</strong> {question.options[userAnswer]}
                                    </div>
                                )}
                                {!isAnswered && (
                                    <div className="mcq-review-answer skipped-answer">
                                        <strong>Status:</strong> Skipped
                                    </div>
                                )}
                            </div>
                            <div className="mcq-review-explanation">
                                <strong>Explanation:</strong> {question.explanation || 'No explanation provided'}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MCQ_Result;
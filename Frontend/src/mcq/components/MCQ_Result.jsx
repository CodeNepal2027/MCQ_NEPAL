import React from 'react';
import { useMCQ, ACTIONS } from '../MCQ_API_Context';
import '../assets/css/MCQ_Result.css';

const MCQ_Result = () => {
    const { 
        questions, 
        selectedAnswers, 
        score, 
        totalQuestions,
        dispatch 
    } = useMCQ();

    const percentage = Math.round((score / totalQuestions) * 100);

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
        dispatch({ type: ACTIONS.RESET_QUIZ });
    };

    const handleBack = () => {
        dispatch({ type: ACTIONS.SELECT_CHAPTER, payload: null });
    };

    return (
        <div className="mcq-result-container">
            <div className="mcq-result-header">
                <h2 className="mcq-result-title">Quiz Complete! 🎉</h2>
                <p className="mcq-result-message">{getResultMessage()}</p>
            </div>

            <div className="mcq-result-score">
                <div className="mcq-score-circle">
                    <div className="mcq-score-number">{score}</div>
                    <div className="mcq-score-total">/{totalQuestions}</div>
                </div>
                <div className={`mcq-score-percentage ${getScoreColor()}`}>
                    {percentage}%
                </div>
            </div>

            <div className="mcq-result-stats">
                <div className="mcq-stat-item correct">
                    <span className="mcq-stat-value">{score}</span>
                    <span className="mcq-stat-label">Correct</span>
                </div>
                <div className="mcq-stat-item incorrect">
                    <span className="mcq-stat-value">{totalQuestions - score}</span>
                    <span className="mcq-stat-label">Incorrect</span>
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
                    const isCorrect = userAnswer === question.correctAnswer;

                    return (
                        <div key={question.id} className={`mcq-review-item ${isCorrect ? 'review-correct' : 'review-incorrect'}`}>
                            <div className="mcq-review-header">
                                <span className="mcq-review-number">Q{index + 1}.</span>
                                <span className={`mcq-review-status ${isCorrect ? 'correct' : 'incorrect'}`}>
                                    {isCorrect ? '✅' : '❌'}
                                </span>
                            </div>
                            <p className="mcq-review-question">{question.question}</p>
                            <div className="mcq-review-answers">
                                <div className="mcq-review-answer correct-answer">
                                    <strong>Correct:</strong> {question.options[question.correctAnswer]}
                                </div>
                                {!isCorrect && userAnswer !== undefined && (
                                    <div className="mcq-review-answer user-answer">
                                        <strong>Your Answer:</strong> {question.options[userAnswer]}
                                    </div>
                                )}
                                {userAnswer === undefined && (
                                    <div className="mcq-review-answer skipped-answer">
                                        <strong>Status:</strong> Skipped
                                    </div>
                                )}
                            </div>
                            <div className="mcq-review-explanation">
                                <strong>Explanation:</strong> {question.explanation}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MCQ_Result;
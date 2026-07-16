import React, { useState } from 'react';
import { useMCQ, ACTIONS } from '../MCQ_API_Context';
import '../assets/css/MCQ_Question.css';

const MCQ_Question = () => {
    const { 
        questions, 
        currentQuestionIndex, 
        selectedAnswers,
        dispatch 
    } = useMCQ();

    const [showExplanation, setShowExplanation] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswer = selectedAnswers[currentQuestion?.id] ?? null;

    const handleAnswerSelect = (answerIndex) => {
        if (selectedAnswer !== null) return;
        dispatch({
            type: ACTIONS.SELECT_ANSWER,
            payload: { questionId: currentQuestion.id, answerIndex }
        });
        setShowExplanation(true);
    };

    const optionLabels = ['A', 'B', 'C', 'D'];

    if (!currentQuestion) {
        return (
            <div className="mcq-question-empty">
                <i className="bi bi-inbox-fill"></i>
                <p>No question found</p>
            </div>
        );
    }

    return (
        <div className="mcq-question-container">
            {/* Question Header */}
            <div className="mcq-question-header">
                <div className="question-number">
                    <span className="number-badge">
                        <i className="bi bi-hash"></i>
                        {currentQuestionIndex + 1}
                    </span>
                    <span className="total-questions">
                        of {questions.length} questions
                    </span>
                </div>
                <div className="question-status">
                    {selectedAnswer !== null ? (
                        <span className="status-answered">
                            <i className="bi bi-check-circle-fill"></i> Answered
                        </span>
                    ) : (
                        <span className="status-unanswered">
                            <i className="bi bi-circle"></i> Unanswered
                        </span>
                    )}
                </div>
            </div>

            {/* Question Text */}
            <div className="mcq-question-text">
                <p>{currentQuestion.question}</p>
            </div>

            {/* Options */}
            <div className="mcq-options">
                {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = index === currentQuestion.correctAnswer;
                    const showResult = selectedAnswer !== null;

                    let className = 'mcq-option';
                    if (showResult) {
                        if (isCorrect) className += ' correct';
                        if (isSelected && !isCorrect) className += ' wrong';
                        if (isSelected) className += ' selected';
                    } else if (isSelected) {
                        className += ' selected';
                    }

                    const letterColors = ['#dc2626', '#2563eb', '#16a34a', '#d97706'];

                    return (
                        <div
                            key={index}
                            className={className}
                            onClick={() => handleAnswerSelect(index)}
                        >
                            <span 
                                className="mcq-option-label"
                                style={{ 
                                    background: isSelected ? letterColors[index] : 'var(--bg-main-2)',
                                    color: isSelected ? '#fff' : 'var(--text-color-2)'
                                }}
                            >
                                {optionLabels[index]}
                            </span>
                            <span className="mcq-option-text">{option}</span>
                            {showResult && isCorrect && (
                                <i className="bi bi-check-circle-fill mcq-option-icon correct-icon"></i>
                            )}
                            {showResult && isSelected && !isCorrect && (
                                <i className="bi bi-x-circle-fill mcq-option-icon wrong-icon"></i>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Explanation */}
            {selectedAnswer !== null && showExplanation && (
                <div className="mcq-explanation">
                    <div className="mcq-explanation-header">
                        <span className={`mcq-explanation-badge ${selectedAnswer === currentQuestion.correctAnswer ? 'correct' : 'incorrect'}`}>
                            {selectedAnswer === currentQuestion.correctAnswer ? (
                                <>
                                    <i className="bi bi-check-circle-fill"></i> Correct!
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-x-circle-fill"></i> Incorrect
                                </>
                            )}
                        </span>
                        <button 
                            className="explanation-toggle"
                            onClick={() => setShowExplanation(!showExplanation)}
                        >
                            <i className={`bi ${showExplanation ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                        </button>
                    </div>
                    <div className="mcq-explanation-content">
                        <p className="mcq-explanation-text">{currentQuestion.explanation}</p>
                    </div>
                </div>
            )}

            {/* Progress Indicator */}
            <div className="mcq-question-footer">
                <div className="question-progress-dots">
                    {questions.map((q, index) => (
                        <span 
                            key={q.id}
                            className={`progress-dot ${index === currentQuestionIndex ? 'active' : ''} ${selectedAnswers[q.id] !== undefined ? 'answered' : ''}`}
                            onClick={() => dispatch({ type: ACTIONS.JUMP_TO_QUESTION, payload: index })}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MCQ_Question;
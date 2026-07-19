import React, { useState } from 'react';
import { useMCQ, ACTIONS } from '../MCQ_API_Context';
import '../assets/css/MCQ_Question.css';

const MCQ_Question = () => {
    const { 
        questions, 
        selectedAnswers,
        dispatch,
        chapter,
        branch
    } = useMCQ();

    const [showAnswers, setShowAnswers] = useState({});
    const [showExplanations, setShowExplanations] = useState({});

    const optionLabels = ['A', 'B', 'C', 'D'];

    const handleAnswerSelect = (questionId, answerIndex) => {
        if (selectedAnswers[questionId] !== undefined) return;
        dispatch({
            type: 'SELECT_ANSWER',
            payload: { questionId, answerIndex }
        });
    };

    const toggleAnswer = (questionId) => {
        setShowAnswers(prev => ({
            ...prev,
            [questionId]: !prev[questionId]
        }));
    };

    const toggleExplanation = (questionId) => {
        setShowExplanations(prev => ({
            ...prev,
            [questionId]: !prev[questionId]
        }));
    };

    const handleBackToChapters = () => {
        dispatch({ type: ACTIONS.SELECT_CHAPTER, payload: null });
    };

    if (!questions || questions.length === 0) {
        return (
            <div className="mcq-question-empty">
                <i className="bi bi-inbox-fill"></i>
                <p>No questions found</p>
            </div>
        );
    }

    // Calculate progress
    const answeredCount = Object.keys(selectedAnswers).length;
    const totalQuestions = questions.length;
    const progress = (answeredCount / totalQuestions) * 100;

    return (
        <div className="mcq-question-container">
            {/* Back Button Header */}
            <div className="mcq-question-header-top">
                <button onClick={handleBackToChapters} className="mcq-back-btn">
                    <i className="bi bi-arrow-left"></i> Back to Chapters
                </button>
                <div className="header-info">
                    <span className="chapter-name">
                        <i className="bi bi-book-fill"></i>
                        {chapter?.name || 'Questions'}
                    </span>
                    <span className="branch-name">
                        <i className="bi bi-folder-fill"></i>
                        {branch?.name || ''}
                    </span>
                </div>
            </div>

            {/* Progress Header */}
            <div className="mcq-progress-header">
                <div className="mcq-progress-info">
                    <span className="mcq-progress-title">
                        <i className="bi bi-journal-text"></i> Practice Questions
                    </span>
                    <span className="mcq-progress-count">
                        {answeredCount} / {totalQuestions} Answered
                    </span>
                </div>
                <div className="mcq-progress-bar-wrapper">
                    <div className="mcq-progress-bar">
                        <div 
                            className="mcq-progress-fill" 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <span className="mcq-progress-percentage">
                        {Math.round(progress)}%
                    </span>
                </div>
            </div>

            {/* All Questions */}
            <div className="mcq-questions-list">
                {questions.map((question, index) => {
                    const selectedAnswer = selectedAnswers[question.id] ?? null;
                    const showAnswer = showAnswers[question.id] || false;
                    const showExplanation = showExplanations[question.id] || false;

                    return (
                        <div key={question.id} className="mcq-question-item">
                            {/* Question Number */}
                            <div className="mcq-question-number">
                                <span className="q-number">Question {index + 1}</span>
                                <span className={`q-status ${selectedAnswer !== null ? 'answered' : 'unanswered'}`}>
                                    {selectedAnswer !== null ? (
                                        <><i className="bi bi-check-circle-fill"></i> Answered</>
                                    ) : (
                                        <><i className="bi bi-circle"></i> Unanswered</>
                                    )}
                                </span>
                            </div>

                            {/* Question Text */}
                            <div className="mcq-question-text">
                                <p>{question.question}</p>
                            </div>

                            {/* Question Image - New Feature */}
                            {question.image && (
                                <div className="mcq-question-image">
                                    <img 
                                        src={question.image} 
                                        alt="Question diagram" 
                                        className="mcq-image"
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            const parent = e.target.parentElement;
                                            const errorDiv = document.createElement('div');
                                            errorDiv.className = 'mcq-image-error';
                                            errorDiv.innerHTML = '<i class="bi bi-image-fill"></i> Image not available';
                                            parent.appendChild(errorDiv);
                                        }}
                                    />
                                </div>
                            )}

                            {/* Options */}
                            <div className="mcq-options">
                                {question.options.map((option, optIndex) => {
                                    const isSelected = selectedAnswer === optIndex;
                                    const isCorrect = optIndex === question.correctAnswer;
                                    const showResult = showAnswer;

                                    let className = 'mcq-option';
                                    if (isSelected) className += ' selected';
                                    if (showResult) {
                                        if (isCorrect) className += ' correct';
                                        if (isSelected && !isCorrect) className += ' wrong';
                                    }

                                    const letterColors = ['#dc2626', '#2563eb', '#16a34a', '#d97706'];

                                    return (
                                        <div
                                            key={optIndex}
                                            className={className}
                                            onClick={() => handleAnswerSelect(question.id, optIndex)}
                                        >
                                            <span 
                                                className="mcq-option-label"
                                                style={{ 
                                                    background: isSelected ? letterColors[optIndex] : 'var(--bg-main-2)',
                                                    color: isSelected ? '#fff' : 'var(--text-color-2)'
                                                }}
                                            >
                                                {optionLabels[optIndex]}
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

                            {/* Action Buttons */}
                            <div className="mcq-question-actions">
                                <button 
                                    className={`mcq-action-btn ${showAnswer ? 'active' : ''}`}
                                    onClick={() => toggleAnswer(question.id)}
                                >
                                    <i className={`bi ${showAnswer ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                                    {showAnswer ? 'Hide Answer' : 'Show Answer'}
                                </button>
                                <button 
                                    className={`mcq-action-btn ${showExplanation ? 'active' : ''}`}
                                    onClick={() => toggleExplanation(question.id)}
                                    disabled={!showAnswer}
                                >
                                    <i className={`bi ${showExplanation ? 'bi-x-circle-fill' : 'bi-lightbulb-fill'}`}></i>
                                    {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                                </button>
                            </div>

                            {/* Explanation */}
                            {showAnswer && showExplanation && (
                                <div className="mcq-explanation">
                                    <div className="mcq-explanation-header">
                                        <span className={`mcq-explanation-badge ${selectedAnswer === question.correctAnswer ? 'correct' : 'incorrect'}`}>
                                            {selectedAnswer !== null && selectedAnswer === question.correctAnswer ? (
                                                <>
                                                    <i className="bi bi-check-circle-fill"></i> Your Answer: Correct!
                                                </>
                                            ) : selectedAnswer !== null ? (
                                                <>
                                                    <i className="bi bi-x-circle-fill"></i> Your Answer: Incorrect
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-info-circle-fill"></i> Correct Answer
                                                </>
                                            )}
                                        </span>
                                    </div>
                                    <div className="mcq-explanation-content">
                                        <div className="explanation-row">
                                            <span className="explanation-label">Correct Answer:</span>
                                            <span className="explanation-value correct-text">
                                                {optionLabels[question.correctAnswer]}. {question.options[question.correctAnswer]}
                                            </span>
                                        </div>
                                        <div className="explanation-divider"></div>
                                        <p className="mcq-explanation-text">
                                            <span className="explanation-label">Explanation:</span>
                                            {question.explanation}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MCQ_Question;
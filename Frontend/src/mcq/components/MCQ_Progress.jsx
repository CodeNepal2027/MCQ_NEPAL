import React from 'react';
import { useMCQ } from '../MCQ_API_Context';
import '../assets/css/MCQ_Progress.css';

const MCQ_Progress = () => {
    const { 
        questions, 
        currentQuestionIndex, 
        selectedAnswers,
        totalQuestions,
        answeredCount,
        scorePercentage
    } = useMCQ();

    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

    return (
        <div className="mcq-progress-container">
            <div className="mcq-progress-top">
                <div className="mcq-progress-info">
                    <span className="progress-label">
                        <i className="bi bi-question-circle"></i>
                        Question {currentQuestionIndex + 1} of {totalQuestions}
                    </span>
                    <span className="progress-stats">
                        <span className="stat-badge answered">
                            <i className="bi bi-check-circle-fill"></i>
                            {answeredCount} Answered
                        </span>
                        <span className="stat-badge remaining">
                            <i className="bi bi-circle"></i>
                            {totalQuestions - answeredCount} Remaining
                        </span>
                    </span>
                </div>
                <div className="mcq-progress-score">
                    <span className="score-label">Score</span>
                    <span className="score-value">{scorePercentage}%</span>
                </div>
            </div>

            <div className="mcq-progress-bar-wrapper">
                <div className="mcq-progress-bar">
                    <div 
                        className="mcq-progress-fill" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <div className="mcq-progress-percentage">
                    {Math.round(progress)}%
                </div>
            </div>

            <div className="mcq-progress-dots">
                {questions.map((q, index) => {
                    const isAnswered = selectedAnswers[q.id] !== undefined;
                    const isActive = index === currentQuestionIndex;
                    return (
                        <div
                            key={q.id}
                            className={`mcq-dot ${isActive ? 'active' : ''} ${isAnswered ? 'answered' : ''}`}
                            title={`Question ${index + 1} - ${isAnswered ? 'Answered' : 'Unanswered'}`}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default MCQ_Progress;
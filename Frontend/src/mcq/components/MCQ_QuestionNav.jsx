import React from 'react';
import { useMCQ, ACTIONS } from '../MCQ_API_Context';
import '../assets/css/MCQ_QuestionNav.css';

const MCQ_QuestionNav = () => {
    const { 
        questions, 
        currentQuestionIndex, 
        selectedAnswers,
        dispatch 
    } = useMCQ();

    const handlePrevious = () => {
        dispatch({ type: ACTIONS.PREV_QUESTION });
    };

    const handleNext = () => {
        dispatch({ type: ACTIONS.NEXT_QUESTION });
    };

    const handleSubmit = () => {
        const answered = Object.keys(selectedAnswers).length;
        const total = questions.length;

        if (answered < total) {
            const confirmSubmit = window.confirm(
                `You have answered ${answered} out of ${total} questions. Do you want to submit?`
            );
            if (!confirmSubmit) return;
        }

        dispatch({ type: ACTIONS.COMPLETE_QUIZ });
    };

    const isFirst = currentQuestionIndex === 0;
    const isLast = currentQuestionIndex === questions.length - 1;

    return (
        <div className="mcq-nav-container">
            <button
                className="mcq-nav-btn prev"
                onClick={handlePrevious}
                disabled={isFirst}
            >
                <i className="bi bi-chevron-left"></i> Previous
            </button>
            <button
                className="mcq-nav-btn next"
                onClick={handleNext}
                disabled={isLast}
            >
                Next <i className="bi bi-chevron-right"></i>
            </button>
            {isLast && (
                <button
                    className="mcq-nav-btn submit"
                    onClick={handleSubmit}
                >
                    Submit Quiz <i className="bi bi-check-lg"></i>
                </button>
            )}
        </div>
    );
};

export default MCQ_QuestionNav;
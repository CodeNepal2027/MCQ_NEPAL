import React from 'react';
import { useMCQ, ACTIONS } from '../MCQ_API_Context';
import '../assets/css/MCQ_QuestionNav.css';

const MCQ_QuestionNav = () => {
    const { 
        questions, 
        selectedAnswers,
        dispatch 
    } = useMCQ();

    const handleSubmit = () => {
        const answered = Object.keys(selectedAnswers || {}).length;
        const total = questions?.length || 0;

        if (answered < total) {
            const confirmSubmit = window.confirm(
                `You have answered ${answered} out of ${total} questions. Do you want to submit?`
            );
            if (!confirmSubmit) return;
        } else {
            const confirmSubmit = window.confirm(
                `You have answered all ${total} questions. Do you want to submit?`
            );
            if (!confirmSubmit) return;
        }

        dispatch({ type: ACTIONS.COMPLETE_QUIZ });
    };

    if (!questions || questions.length === 0) {
        return null;
    }

    return (
        <div className="mcq-nav-container">
            <button
                className="mcq-nav-btn submit"
                onClick={handleSubmit}
            >
                <i className="bi bi-check-lg"></i> Submit Quiz
            </button>
        </div>
    );
};

export default MCQ_QuestionNav;
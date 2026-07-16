import React, { useEffect, useState } from 'react';
import { useMCQ, ACTIONS } from './MCQ_API_Context';
import { fetchCategories } from './MCQ_API_Fetch';
import { 
    MCQ_Category,
    MCQ_SubCategory,
    MCQ_Question,
    MCQ_Result,
    MCQ_Progress,
    MCQ_QuestionNav
} from './MCQ_Import';
import './assets/css/MCQ.css';

const MCQ = () => {
    const { 
        categories,
        selectedCategory, 
        selectedSubCategory, 
        questions, 
        quizCompleted,
        isLoading,
        error,
        dispatch
    } = useMCQ();

    const [loadingMessage, setLoadingMessage] = useState('Loading...');

    // Load categories on mount with better loading experience
    useEffect(() => {
        const loadCategories = async () => {
            if (categories.length > 0) return; // Don't reload if already loaded
            
            dispatch({ type: ACTIONS.SET_LOADING, payload: true });
            setLoadingMessage('Loading categories...');
            
            try {
                const data = await fetchCategories();
                dispatch({ type: ACTIONS.SET_CATEGORIES, payload: data });
            } catch (error) {
                dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
            }
        };
        loadCategories();
    }, [categories.length, dispatch]);

    // Show loading state with better UI
    if (isLoading && categories.length === 0) {
        return (
            <div className="mcq-loading-container">
                <div className="mcq-loading-spinner"></div>
                <p className="mcq-loading-text">{loadingMessage}</p>
                <p className="mcq-loading-subtext">Please wait while we prepare your questions</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="mcq-error-container">
                <div className="mcq-error-icon">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                </div>
                <h3 className="mcq-error-title">Oops! Something went wrong</h3>
                <p className="mcq-error-message">{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mcq-error-btn"
                >
                    <i className="bi bi-arrow-clockwise"></i> Try Again
                </button>
            </div>
        );
    }

    // Render Category Selection
    if (!selectedCategory) {
        return <MCQ_Category />;
    }

    // Render Sub-Category Selection
    if (selectedCategory && !selectedSubCategory) {
        return <MCQ_SubCategory />;
    }

    // Render Quiz
    if (selectedCategory && selectedSubCategory && questions.length > 0) {
        if (quizCompleted) {
            return <MCQ_Result />;
        }
        return (
            <div className="mcq-quiz-wrapper">
                <MCQ_Progress />
                <MCQ_Question />
                <MCQ_QuestionNav />
            </div>
        );
    }

    // Loading questions
    if (isLoading) {
        return (
            <div className="mcq-loading-container">
                <div className="mcq-loading-spinner"></div>
                <p className="mcq-loading-text">Loading questions...</p>
                <p className="mcq-loading-subtext">Getting your practice questions ready</p>
            </div>
        );
    }

    // No questions found
    return (
        <div className="mcq-empty-container">
            <div className="mcq-empty-icon">
                <i className="bi bi-inbox-fill"></i>
            </div>
            <h3 className="mcq-empty-title">No questions available</h3>
            <p className="mcq-empty-message">Please try another category or sub-category.</p>
            <button 
                onClick={() => dispatch({ type: ACTIONS.SELECT_CATEGORY, payload: null })}
                className="mcq-empty-btn"
            >
                <i className="bi bi-arrow-left"></i> Go Back
            </button>
        </div>
    );
};

export default MCQ;
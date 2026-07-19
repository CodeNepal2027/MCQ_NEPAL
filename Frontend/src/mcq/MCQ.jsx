import React, { useEffect, useState } from 'react';
import { useMCQ, ACTIONS } from './MCQ_API_Context';
import { fetchCategories } from './MCQ_API_Fetch';
import { 
    MCQ_Category,
    MCQ_Faculty,
    MCQ_Branch,
    MCQ_Chapter,
    MCQ_Question,
    MCQ_Result,
    MCQ_QuestionNav
} from './MCQ_Import';
import './assets/css/MCQ.css';

const MCQ = () => {
    const { 
        categories,
        selectedCategory, 
        selectedFaculty,
        selectedBranch,
        selectedChapter,
        questions, 
        quizCompleted,
        isLoading,
        error,
        dispatch
    } = useMCQ();

    const [loadingMessage, setLoadingMessage] = useState('Loading...');

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Load categories on mount - check if we have saved state first
    useEffect(() => {
        const loadCategories = async () => {
            // If we already have categories, don't reload
            if (categories.length > 0) {
                dispatch({ type: ACTIONS.SET_LOADING, payload: false });
                return;
            }
            
            // Check if we have a saved selection
            const savedState = localStorage.getItem('mcq_state');
            if (savedState) {
                try {
                    const parsed = JSON.parse(savedState);
                    if (parsed.selectedCategory) {
                        // We have a saved category, but categories are already being loaded by the provider
                        // Just wait for them
                        return;
                    }
                } catch (e) {
                    console.warn('Failed to parse saved state:', e);
                }
            }
            
            // No saved state or no categories, load categories
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

    // Scroll to top when any level changes
    useEffect(() => {
        scrollToTop();
    }, [selectedCategory, selectedFaculty, selectedBranch, selectedChapter, quizCompleted]);

    // Show loading state - with better handling
    if (isLoading) {
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

    // Level 1: Category Selection
    if (!selectedCategory) {
        return <MCQ_Category />;
    }

    // Level 2: Faculty Selection
    if (selectedCategory && !selectedFaculty) {
        return <MCQ_Faculty />;
    }

    // Level 3: Branch Selection
    if (selectedCategory && selectedFaculty && !selectedBranch) {
        return <MCQ_Branch />;
    }

    // Level 4: Chapter Selection
    if (selectedCategory && selectedFaculty && selectedBranch && !selectedChapter) {
        return <MCQ_Chapter />;
    }

    // Level 5: Quiz
    if (selectedCategory && selectedFaculty && selectedBranch && selectedChapter && questions.length > 0) {
        if (quizCompleted) {
            return <MCQ_Result />;
        }
        return (
            <div className="mcq-quiz-wrapper">
                <MCQ_Question />
                <MCQ_QuestionNav />
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
            <p className="mcq-empty-message">Please try another category, faculty, branch, or chapter.</p>
            <button 
                onClick={() => dispatch({ type: ACTIONS.SELECT_CHAPTER, payload: null })}
                className="mcq-empty-btn"
            >
                <i className="bi bi-arrow-left"></i> Go Back
            </button>
        </div>
    );
};

export default MCQ;
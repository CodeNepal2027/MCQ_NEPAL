import React, { useEffect } from 'react';
import { useMCQ, ACTIONS } from '../MCQ_API_Context';
import { fetchQuestions } from '../MCQ_API_Fetch';
import '../assets/css/MCQ_Chapter.css';

const MCQ_Chapter = () => {
    const { 
        selectedCategory,
        selectedFaculty,
        selectedBranch,
        branch,
        dispatch 
    } = useMCQ();

    // Get chapters from branch data
    const chapters = branch?.chapters || [];

    const handleChapterSelect = async (chapterId) => {
        // Set the selected chapter
        dispatch({ type: ACTIONS.SELECT_CHAPTER, payload: chapterId });
        
        // Fetch questions for this chapter
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        try {
            console.log('Fetching questions for:', selectedCategory, selectedFaculty, selectedBranch, chapterId);
            const questions = await fetchQuestions(selectedCategory, selectedFaculty, selectedBranch, chapterId);
            console.log('Questions received:', questions);
            
            if (questions && questions.length > 0) {
                dispatch({ type: ACTIONS.SET_QUESTIONS, payload: questions });
            } else {
                dispatch({ 
                    type: ACTIONS.SET_ERROR, 
                    payload: 'No questions available for this chapter' 
                });
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
        }
    };

    const handleBack = () => {
        dispatch({ type: ACTIONS.SELECT_BRANCH, payload: null });
    };

    if (!branch) {
        return (
            <div className="mcq-chapter-error">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <p>Branch not found</p>
                <button onClick={handleBack} className="mcq-back-btn">
                    <i className="bi bi-arrow-left"></i> Go Back
                </button>
            </div>
        );
    }

    if (chapters.length === 0) {
        return (
            <div className="mcq-chapter-empty">
                <i className="bi bi-book-fill"></i>
                <h3>No chapters available</h3>
                <p>This branch doesn't have any chapters yet.</p>
                <button onClick={handleBack} className="mcq-back-btn">
                    <i className="bi bi-arrow-left"></i> Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="mcq-chapter-container">
            <div className="mcq-chapter-header">
                <button onClick={handleBack} className="mcq-back-btn">
                    <i className="bi bi-arrow-left"></i> Back to Branches
                </button>
                <div className="header-content">
                    <div>
                        <h2 className="mcq-chapter-title">
                            {branch.name}
                        </h2>
                        <p className="mcq-chapter-subtitle">
                            <i className="bi bi-grid-fill"></i> 
                            Select a chapter to start practicing
                        </p>
                    </div>
                </div>
            </div>

            <div className="mcq-chapter-grid">
                {chapters.map((chapter) => (
                    <div
                        key={chapter.id}
                        className="mcq-chapter-card"
                        onClick={() => handleChapterSelect(chapter.id)}
                    >
                        <div className="chapter-icon">
                            <i className="bi bi-book-fill"></i>
                        </div>
                        <h3 className="mcq-chapter-name">{chapter.name}</h3>
                        <p className="mcq-chapter-desc">{chapter.description}</p>
                        <div className="mcq-chapter-meta">
                            <span className="chapter-meta">
                                <i className="bi bi-question-circle"></i> 
                                {chapter.questionCount || 0} Questions
                            </span>
                        </div>
                        <div className="mcq-chapter-start">
                            Start Practice <i className="bi bi-arrow-right-circle"></i>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mcq-chapter-footer">
                <p>
                    <i className="bi bi-info-circle-fill"></i>
                    {chapters.length} chapters available in this branch
                </p>
            </div>
        </div>
    );
};

export default MCQ_Chapter;
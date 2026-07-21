import React, { useEffect } from 'react';
import { useMCQ, ACTIONS } from '../MCQ_API_Context';
import { fetchChaptersByBranch, fetchQuestions } from '../MCQ_API_Fetch';
import '../assets/css/MCQ_Chapter.css';

const MCQ_Chapter = () => {
    const { 
        selectedCategory,
        selectedFaculty,
        selectedBranch,
        branch,
        dispatch,
        isLoading,
        faculty,
        category,
        categories
    } = useMCQ();

    // Load chapters if not already loaded
    useEffect(() => {
        const loadChapters = async () => {
            if (selectedBranch && !branch?.chapters) {
                dispatch({ type: ACTIONS.SET_LOADING, payload: true });
                try {
                    console.log('📡 Loading chapters for branch:', selectedBranch);
                    const chapters = await fetchChaptersByBranch(selectedBranch);
                    console.log('📦 Chapters loaded:', chapters);
                    
                    // Update the branch with chapters
                    const updatedBranch = { ...branch, chapters };
                    
                    // Update the branch in the categories state
                    const updatedFaculty = { ...faculty };
                    const updatedBranches = updatedFaculty.branches?.map(b => 
                        b.id === selectedBranch ? updatedBranch : b
                    ) || [];
                    updatedFaculty.branches = updatedBranches;
                    
                    const updatedCategory = { ...category };
                    const updatedFaculties = updatedCategory.faculties?.map(f => 
                        f.id === selectedFaculty ? updatedFaculty : f
                    ) || [];
                    updatedCategory.faculties = updatedFaculties;
                    
                    const updatedCategories = categories.map(c => 
                        c.id === selectedCategory ? updatedCategory : c
                    );
                    
                    // Dispatch both updates
                    dispatch({ 
                        type: ACTIONS.UPDATE_BRANCH, 
                        payload: { branchId: selectedBranch, branchData: updatedBranch } 
                    });
                    
                    dispatch({ 
                        type: ACTIONS.SET_CATEGORIES, 
                        payload: updatedCategories 
                    });
                    
                    dispatch({ type: ACTIONS.SET_LOADING, payload: false });
                } catch (error) {
                    console.error('Error loading chapters:', error);
                    dispatch({ type: ACTIONS.SET_ERROR, payload: error.message || 'Failed to load chapters' });
                    dispatch({ type: ACTIONS.SET_LOADING, payload: false });
                }
            }
        };
        loadChapters();
    }, [selectedBranch, branch, dispatch, faculty, category, selectedCategory, selectedFaculty, categories]);

    // Get chapters from branch data
    const chapters = branch?.chapters || [];

    const handleChapterSelect = async (chapterId) => {
        // Set the selected chapter
        dispatch({ type: ACTIONS.SELECT_CHAPTER, payload: chapterId });
        
        // Fetch questions for this chapter
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        try {
            console.log('Fetching questions for chapter:', chapterId);
            console.log('Path:', selectedCategory, selectedFaculty, selectedBranch, chapterId);
            
            const questions = await fetchQuestions(
                selectedCategory, 
                selectedFaculty, 
                selectedBranch, 
                chapterId
            );
            console.log('📦 Questions received:', questions.length);
            
            if (questions && questions.length > 0) {
                dispatch({ type: ACTIONS.SET_QUESTIONS, payload: questions });
            } else {
                dispatch({ 
                    type: ACTIONS.SET_ERROR, 
                    payload: 'No questions available for this chapter' 
                });
            }
            dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        } catch (error) {
            console.error('Error fetching questions:', error);
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message || 'Failed to load questions' });
            dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        }
    };

    const handleBack = () => {
        dispatch({ type: ACTIONS.SELECT_BRANCH, payload: null });
    };

    if (isLoading) {
        return (
            <div className="mcq-chapter-loading">
                <div className="mcq-loading-spinner"></div>
                <p>Loading chapters...</p>
            </div>
        );
    }

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
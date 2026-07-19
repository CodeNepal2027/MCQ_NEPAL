import React, { useEffect } from 'react';
import { useMCQ, ACTIONS } from '../MCQ_API_Context';
import { fetchBranches } from '../MCQ_API_Fetch';
import '../assets/css/MCQ_Branch.css';

const MCQ_Branch = () => {
    const { 
        selectedCategory, 
        selectedFaculty,
        category,
        faculty,
        dispatch 
    } = useMCQ();

    // Load branches if not already loaded
    useEffect(() => {
        const loadBranches = async () => {
            if (selectedCategory && selectedFaculty && !faculty?.branches) {
                dispatch({ type: ACTIONS.SET_LOADING, payload: true });
                try {
                    const branches = await fetchBranches(selectedCategory, selectedFaculty);
                    // Update the faculty with branches
                    const updatedCategory = { ...category };
                    const updatedFaculties = updatedCategory.faculties.map(f => 
                        f.id === selectedFaculty ? { ...f, branches } : f
                    );
                    updatedCategory.faculties = updatedFaculties;
                    
                    // Update categories in state
                    const updatedCategories = category.categories?.map(c => 
                        c.id === selectedCategory ? updatedCategory : c
                    ) || [];
                    dispatch({ type: ACTIONS.SET_CATEGORIES, payload: updatedCategories });
                    dispatch({ type: ACTIONS.SET_LOADING, payload: false });
                } catch (error) {
                    dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
                }
            }
        };
        loadBranches();
    }, [selectedCategory, selectedFaculty, faculty, category, dispatch]);

    const handleBranchSelect = (branchId) => {
        dispatch({ type: ACTIONS.SELECT_BRANCH, payload: branchId });
    };

    const handleBack = () => {
        dispatch({ type: ACTIONS.SELECT_FACULTY, payload: null });
    };

    if (!faculty) {
        return (
            <div className="mcq-branch-error">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <p>Faculty not found</p>
                <button onClick={handleBack} className="mcq-back-btn">
                    <i className="bi bi-arrow-left"></i> Go Back
                </button>
            </div>
        );
    }

    const branches = faculty.branches || [];

    if (branches.length === 0) {
        return (
            <div className="mcq-branch-loading">
                <div className="mcq-loading-spinner"></div>
                <p>Loading branches...</p>
            </div>
        );
    }

    return (
        <div className="mcq-branch-container">
            <div className="mcq-branch-header">
                <button onClick={handleBack} className="mcq-back-btn">
                    <i className="bi bi-arrow-left"></i> Back to Faculties
                </button>
                <div className="header-content">
                    <span className="header-icon">
                        <i className={faculty.icon || 'bi-book-fill'}></i>
                    </span>
                    <div>
                        <h2 className="mcq-branch-title">{faculty.name}</h2>
                        <p className="mcq-branch-subtitle">
                            <i className="bi bi-grid-fill"></i> 
                            Select your specialization branch to begin
                        </p>
                    </div>
                </div>
            </div>

            <div className="mcq-branch-grid">
                {branches.map((branch) => (
                    <div
                        key={branch.id}
                        className="mcq-branch-card"
                        onClick={() => handleBranchSelect(branch.id)}
                    >
                        <div className="branch-icon">
                            <i className="bi bi-code-square"></i>
                        </div>
                        <h3 className="mcq-branch-name">{branch.name}</h3>
                        <p className="mcq-branch-desc">{branch.description}</p>
                        <div className="mcq-branch-meta">
                            <span className="branch-meta">
                                <i className="bi bi-question-circle"></i> 
                                {branch.chapters?.length || 0} Chapters
                            </span>
                        </div>
                        <div className="mcq-branch-start">
                            Select Branch <i className="bi bi-arrow-right-circle"></i>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MCQ_Branch;
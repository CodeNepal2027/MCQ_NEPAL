import React, { useEffect, useRef } from 'react';
import { useMCQ, ACTIONS } from '../MCQ_API_Context';
import { fetchBranchesByFaculty } from '../MCQ_API_Fetch';
import '../assets/css/MCQ_Branch.css';

const MCQ_Branch = () => {
    const { 
        selectedFaculty,
        dispatch,
        faculty,
        isLoading,
        category,
        selectedCategory,
        categories
    } = useMCQ();

    const branchesLoadedRef = useRef(false);

    useEffect(() => {
        const loadBranches = async () => {
            // If faculty doesn't exist, try to find it
            if (!faculty) {
                console.warn('Faculty not found in state, trying to reload...');
                return;
            }
            
            // If branches already exist, don't reload
            if (faculty.branches && faculty.branches.length > 0) {
                branchesLoadedRef.current = true;
                return;
            }
            
            if (selectedFaculty && !branchesLoadedRef.current) {
                dispatch({ type: ACTIONS.SET_LOADING, payload: true });
                try {
                    console.log('📡 Loading branches for faculty:', selectedFaculty);
                    const branches = await fetchBranchesByFaculty(selectedFaculty);
                    console.log('📦 Branches loaded:', branches.length);
                    
                    const updatedFaculty = { ...faculty, branches };
                    
                    // Update the faculty in the categories state
                    const updatedCategory = { ...category };
                    const updatedFaculties = updatedCategory.faculties?.map(f => 
                        f.id === selectedFaculty ? updatedFaculty : f
                    ) || [];
                    updatedCategory.faculties = updatedFaculties;
                    
                    const updatedCategories = categories.map(c => 
                        c.id === selectedCategory ? updatedCategory : c
                    );
                    
                    dispatch({ 
                        type: ACTIONS.SET_CATEGORIES, 
                        payload: updatedCategories 
                    });
                    
                    branchesLoadedRef.current = true;
                } catch (error) {
                    console.error('Error loading branches:', error);
                    dispatch({ type: ACTIONS.SET_ERROR, payload: error.message || 'Failed to load branches' });
                } finally {
                    dispatch({ type: ACTIONS.SET_LOADING, payload: false });
                }
            }
        };
        
        if (selectedFaculty && faculty) {
            loadBranches();
        }
    }, [selectedFaculty, faculty, dispatch, category, selectedCategory, categories]);

    // Reset the loaded ref when faculty changes
    useEffect(() => {
        branchesLoadedRef.current = false;
    }, [selectedFaculty]);

    const handleBranchSelect = (branchId) => {
        dispatch({ type: ACTIONS.SELECT_BRANCH, payload: branchId });
    };

    const handleBack = () => {
        dispatch({ type: ACTIONS.SELECT_FACULTY, payload: null });
    };

    if (isLoading) {
        return (
            <div className="mcq-branch-container">
                <div className="mcq-branch-header">
                    <div className="mcq-back-btn-skeleton shimmer"></div>
                    <div className="header-content">
                        <div className="header-icon-skeleton shimmer"></div>
                        <div>
                            <div className="mcq-branch-title-skeleton shimmer"></div>
                            <div className="mcq-branch-subtitle-skeleton shimmer"></div>
                        </div>
                    </div>
                </div>
                <div className="mcq-branch-grid">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="mcq-branch-card skeleton">
                            <div className="skeleton-icon shimmer"></div>
                            <div className="skeleton-title shimmer"></div>
                            <div className="skeleton-desc shimmer"></div>
                            <div className="skeleton-meta shimmer"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!faculty) {
        return (
            <div className="mcq-branch-error">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <p>Faculty not found. Please go back and try again.</p>
                <button onClick={handleBack} className="mcq-back-btn">
                    <i className="bi bi-arrow-left"></i> Go Back
                </button>
            </div>
        );
    }

    const branches = faculty.branches || [];

    if (branches.length === 0) {
        return (
            <div className="mcq-branch-empty">
                <i className="bi bi-folder-fill"></i>
                <h3>No branches available</h3>
                <p>This faculty doesn't have any branches yet.</p>
                <button onClick={handleBack} className="mcq-back-btn">
                    <i className="bi bi-arrow-left"></i> Go Back
                </button>
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
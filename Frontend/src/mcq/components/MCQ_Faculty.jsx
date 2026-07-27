import React, { useEffect } from 'react';
import { useMCQ, ACTIONS } from '../MCQ_API_Context';
import { fetchFacultiesByCategory } from '../MCQ_API_Fetch';
import '../assets/css/MCQ_Faculty.css';

const MCQ_Faculty = () => {
    const { 
        categories, 
        selectedCategory,
        dispatch,
        category,
        isLoading
    } = useMCQ();

    useEffect(() => {
        const loadFaculties = async () => {
            // If category doesn't exist in categories, try to find it
            if (!category) {
                console.warn('Category not found in state, trying to reload...');
                return;
            }
            
            // If faculties already exist, don't reload
            if (category.faculties && category.faculties.length > 0) {
                return;
            }
            
            dispatch({ type: ACTIONS.SET_LOADING, payload: true });
            try {
                const faculties = await fetchFacultiesByCategory(selectedCategory);
                console.log('📦 Faculties loaded:', faculties.length);
                
                // Update the category with faculties
                const updatedCategory = { ...category, faculties };
                const updatedCategories = categories.map(c => 
                    c.id === selectedCategory ? updatedCategory : c
                );
                dispatch({ type: ACTIONS.SET_CATEGORIES, payload: updatedCategories });
            } catch (error) {
                console.error('Error loading faculties:', error);
                dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
            } finally {
                dispatch({ type: ACTIONS.SET_LOADING, payload: false });
            }
        };
        
        // Only load if we have a selected category
        if (selectedCategory && category) {
            loadFaculties();
        }
    }, [selectedCategory, category, categories, dispatch]);

    const handleFacultySelect = (facultyId) => {
        dispatch({ type: ACTIONS.SELECT_FACULTY, payload: facultyId });
    };

    const handleBack = () => {
        dispatch({ type: ACTIONS.SELECT_CATEGORY, payload: null });
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="mcq-faculty-container">
                <div className="mcq-faculty-header">
                    <div className="mcq-back-btn-skeleton shimmer"></div>
                    <div className="header-content">
                        <div className="header-icon-skeleton shimmer"></div>
                        <div>
                            <div className="mcq-faculty-title-skeleton shimmer"></div>
                            <div className="mcq-faculty-subtitle-skeleton shimmer"></div>
                        </div>
                    </div>
                </div>
                <div className="mcq-faculty-grid">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="mcq-faculty-card skeleton">
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

    if (!category) {
        return (
            <div className="mcq-faculty-error">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <p>Category not found. Please go back and try again.</p>
                <button onClick={handleBack} className="mcq-back-btn">
                    <i className="bi bi-arrow-left"></i> Go Back
                </button>
            </div>
        );
    }

    const faculties = category.faculties || [];

    if (faculties.length === 0) {
        return (
            <div className="mcq-faculty-empty">
                <i className="bi bi-folder-fill"></i>
                <h3>No faculties available</h3>
                <p>This category doesn't have any faculties yet.</p>
                <button onClick={handleBack} className="mcq-back-btn">
                    <i className="bi bi-arrow-left"></i> Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="mcq-faculty-container">
            <div className="mcq-faculty-header">
                <button onClick={handleBack} className="mcq-back-btn">
                    <i className="bi bi-arrow-left"></i> Back to Categories
                </button>
                <div className="header-content">
                    <span className="header-icon">
                        <i className={category.icon}></i>
                    </span>
                    <div>
                        <h2 className="mcq-faculty-title">{category.name}</h2>
                        <p className="mcq-faculty-subtitle">
                            <i className="bi bi-grid-fill"></i> 
                            Select your faculty to begin
                        </p>
                    </div>
                </div>
            </div>

            <div className="mcq-faculty-grid">
                {faculties.map((faculty) => (
                    <div
                        key={faculty.id}
                        className="mcq-faculty-card"
                        onClick={() => handleFacultySelect(faculty.id)}
                    >
                        <div className="faculty-icon">
                            <i className={faculty.icon || 'bi-book-fill'}></i>
                        </div>
                        <h3 className="mcq-faculty-name">{faculty.name}</h3>
                        <p className="mcq-faculty-desc">{faculty.description}</p>
                        <div className="mcq-faculty-meta">
                            <span className="faculty-meta">
                                <i className="bi bi-folder-fill"></i> 
                                {faculty.branches?.length || 0} Branches
                            </span>
                        </div>
                        <div className="mcq-faculty-start">
                            Select <i className="bi bi-arrow-right-circle"></i>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MCQ_Faculty;
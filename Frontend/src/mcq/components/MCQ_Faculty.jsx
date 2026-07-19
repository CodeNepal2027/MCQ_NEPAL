import React, { useEffect } from 'react';
import { useMCQ, ACTIONS } from '../MCQ_API_Context';
import { fetchFaculties } from '../MCQ_API_Fetch';
import '../assets/css/MCQ_Faculty.css';

const MCQ_Faculty = () => {
    const { 
        categories, 
        selectedCategory,
        dispatch,
        category
    } = useMCQ();

    useEffect(() => {
        // Fetch faculties for the selected category if not already loaded
        if (selectedCategory && !category?.faculties) {
            const loadFaculties = async () => {
                dispatch({ type: ACTIONS.SET_LOADING, payload: true });
                try {
                    const faculties = await fetchFaculties(selectedCategory);
                    // Update the category with faculties
                    const updatedCategory = { ...category, faculties };
                    // Update categories in state
                    const updatedCategories = categories.map(c => 
                        c.id === selectedCategory ? updatedCategory : c
                    );
                    dispatch({ type: ACTIONS.SET_CATEGORIES, payload: updatedCategories });
                } catch (error) {
                    dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
                }
            };
            loadFaculties();
        }
    }, [selectedCategory, category, categories, dispatch]);

    const handleFacultySelect = (facultyId) => {
        dispatch({ type: ACTIONS.SELECT_FACULTY, payload: facultyId });
    };

    const handleBack = () => {
        dispatch({ type: ACTIONS.SELECT_CATEGORY, payload: null });
    };

    if (!category) {
        return (
            <div className="mcq-faculty-error">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <p>Category not found</p>
                <button onClick={handleBack} className="mcq-back-btn">
                    <i className="bi bi-arrow-left"></i> Go Back
                </button>
            </div>
        );
    }

    const faculties = category.faculties || [];

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
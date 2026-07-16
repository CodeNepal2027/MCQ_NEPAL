import React, { useEffect } from 'react';
import { useMCQ, ACTIONS } from '../MCQ_API_Context';
import { fetchSubCategories, fetchQuestions } from '../MCQ_API_Fetch';
import '../assets/css/MCQ_SubCategory.css';

const MCQ_SubCategory = () => {
    const { 
        categories, 
        selectedCategory, 
        selectedSubCategory,
        dispatch 
    } = useMCQ();

    const category = categories.find(c => c.id === selectedCategory);

    useEffect(() => {
        // If subCategory is already selected, fetch questions
        if (selectedCategory && selectedSubCategory) {
            const loadQuestions = async () => {
                dispatch({ type: ACTIONS.SET_LOADING, payload: true });
                try {
                    console.log('Fetching questions for:', selectedCategory, selectedSubCategory);
                    const questions = await fetchQuestions(selectedCategory, selectedSubCategory);
                    console.log('Questions received:', questions);
                    
                    if (questions && questions.length > 0) {
                        dispatch({ type: ACTIONS.SET_QUESTIONS, payload: questions });
                    } else {
                        dispatch({ 
                            type: ACTIONS.SET_ERROR, 
                            payload: 'No questions available for this category' 
                        });
                    }
                } catch (error) {
                    console.error('Error fetching questions:', error);
                    dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
                }
            };
            loadQuestions();
        }
    }, [selectedCategory, selectedSubCategory, dispatch]);

    const handleSubCategorySelect = (subCategoryId) => {
        dispatch({ type: ACTIONS.SELECT_SUB_CATEGORY, payload: subCategoryId });
    };

    const handleBack = () => {
        dispatch({ type: ACTIONS.SELECT_CATEGORY, payload: null });
    };

    if (!category) {
        return (
            <div className="mcq-subcategory-error">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <p>Category not found</p>
                <button onClick={handleBack} className="mcq-back-btn">
                    <i className="bi bi-arrow-left"></i> Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="mcq-subcategory-container">
            <div className="mcq-subcategory-header">
                <button onClick={handleBack} className="mcq-back-btn">
                    <i className="bi bi-arrow-left"></i> Back to Categories
                </button>
                <div className="header-content">
                    <span className="header-icon">
                        <i className={category.icon}></i>
                    </span>
                    <div>
                        <h2 className="mcq-subcategory-title">{category.name}</h2>
                        <p className="mcq-subcategory-subtitle">
                            <i className="bi bi-grid-fill"></i> 
                            Select your specialization to begin
                        </p>
                    </div>
                </div>
            </div>

            <div className="mcq-subcategory-grid">
                {category.subCategories?.map((sub) => (
                    <div
                        key={sub.id}
                        className="mcq-subcategory-card"
                        onClick={() => handleSubCategorySelect(sub.id)}
                    >
                        <div className="subcard-icon">
                            <i className="bi bi-book-fill"></i>
                        </div>
                        <h3 className="mcq-subcategory-name">{sub.name}</h3>
                        <p className="mcq-subcategory-desc">{sub.description}</p>
                        <div className="mcq-subcategory-meta">
                            <span className="sub-meta">
                                <i className="bi bi-question-circle"></i> 
                                Practice Questions
                            </span>
                        </div>
                        <div className="mcq-subcategory-start">
                            Start Practice <i className="bi bi-arrow-right-circle"></i>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MCQ_SubCategory;
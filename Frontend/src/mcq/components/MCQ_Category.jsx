import React from 'react';
import { useMCQ, ACTIONS } from '../MCQ_API_Context';
import '../assets/css/MCQ_Category.css';

const MCQ_Category = () => {
    const { categories, isLoading, dispatch } = useMCQ();

    const handleCategorySelect = (categoryId) => {
        dispatch({ type: ACTIONS.SELECT_CATEGORY, payload: categoryId });
    };

    // Show skeleton loading for categories
    if (isLoading && categories.length === 0) {
        return (
            <div className="mcq-category-container">
                <div className="mcq-category-header">
                    <span className="mcq-header-badge">
                        <i className="bi bi-grid-3x3-gap-fill"></i> Categories
                    </span>
                    <h1 className="mcq-category-title">Choose Your <span className="gradient-text">Exam Path</span></h1>
                    <p className="mcq-category-subtitle">Select from our curated collection of exam categories</p>
                </div>
                <div className="mcq-category-grid">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="mcq-category-card skeleton">
                            <div className="skeleton-icon"></div>
                            <div className="skeleton-title"></div>
                            <div className="skeleton-desc"></div>
                            <div className="skeleton-count"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mcq-category-container">
            {/* Header */}
            <div className="mcq-category-header">
                <div className="mcq-header-top">
                    <span className="mcq-header-badge">
                        <i className="bi bi-grid-3x3-gap-fill"></i> Explore Categories
                    </span>
                    <span className="mcq-header-count">
                        <i className="bi bi-bookmark-fill"></i> {categories.length} Categories
                    </span>
                </div>
                <h1 className="mcq-category-title">
                    Choose Your <span className="gradient-text">Exam Path</span>
                </h1>
                <p className="mcq-category-subtitle">
                    Select from our curated collection of exam categories and start your practice journey
                </p>
                <div className="mcq-header-stats">
                    <div className="stat-item">
                        <i className="bi bi-question-circle-fill"></i>
                        <span>10K+ Questions</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <i className="bi bi-people-fill"></i>
                        <span>50K+ Students</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <i className="bi bi-star-fill"></i>
                        <span>4.9 Rating</span>
                    </div>
                </div>
            </div>

            {/* Category Grid */}
            <div className="mcq-category-grid">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="mcq-category-card"
                        onClick={() => handleCategorySelect(category.id)}
                    >
                        <div className="card-badge">
                            <i className="bi bi-pin-fill"></i>
                        </div>
                        <div className="mcq-category-icon">
                            <i className={category.icon}></i>
                        </div>
                        <h3 className="mcq-category-name">{category.name}</h3>
                        <p className="mcq-category-desc">{category.description}</p>
                        <div className="mcq-category-meta">
                            <span className="meta-item">
                                <i className="bi bi-folder-fill"></i>
                                {category.subCategories?.length || 0} Sub-categories
                            </span>
                            <span className="meta-item">
                                <i className="bi bi-clock-history"></i>
                                New
                            </span>
                        </div>
                        <div className="mcq-category-arrow">
                            <span>Start Practice</span>
                            <i className="bi bi-arrow-right-circle-fill"></i>
                        </div>
                        <div className="card-glow"></div>
                    </div>
                ))}
            </div>

            {/* Footer Note */}
            <div className="mcq-category-footer">
                <p>
                    <i className="bi bi-info-circle-fill"></i>
                    New categories added regularly. Stay tuned for more!
                </p>
            </div>
        </div>
    );
};

export default MCQ_Category;
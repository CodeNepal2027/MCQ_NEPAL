import React from 'react';
import '../assets/css/Home_Features.css';

const Home_Features = () => {
    const features = [
        {
            icon: 'bi-question-circle-fill',
            title: 'Extensive Question Bank',
            description: 'Access thousands of MCQs across multiple subjects and categories.'
        },
        {
            icon: 'bi-clock-fill',
            title: 'Timed Practice',
            description: 'Practice with timer to improve speed and accuracy for real exams.'
        },
        {
            icon: 'bi-lightbulb-fill',
            title: 'Detailed Explanations',
            description: 'Learn from detailed explanations for every question and answer.'
        },
        {
            icon: 'bi-graph-up-arrow',
            title: 'Track Progress',
            description: 'Monitor your performance with detailed analytics and insights.'
        },
        {
            icon: 'bi-bookmark-check-fill',
            title: 'Bookmark Questions',
            description: 'Save important questions for later review and revision.'
        },
        {
            icon: 'bi-book-fill',
            title: 'Exam Patterns',
            description: 'Practice with exam-specific patterns and question formats.'
        }
    ];

    return (
        <section className="home-features">
            <div className="features-container">
                <div className="section-header">
                    <span className="section-subtitle">Why Choose Us</span>
                    <h2 className="section-title">Everything You Need to <span className="highlight">Succeed</span></h2>
                    <p className="section-description">
                        Comprehensive features designed to help you prepare effectively for any exam.
                    </p>
                </div>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className="feature-icon">
                                <i className={feature.icon}></i>
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Home_Features;
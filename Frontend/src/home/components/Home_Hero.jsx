import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Home_Hero.css';

const Home_Hero = () => {
    return (
        <section className="home-hero">
            <div className="hero-container">
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="badge-icon">🔥</span>
                        <span>Nepal's #1 MCQ Practice Platform</span>
                    </div>
                    <h1 className="hero-title">
                        Practice MCQs for <br />
                        <span className="highlight">All Nepalese Exams</span>
                    </h1>
                    <p className="hero-description">
                        Prepare for Entrance, License, LokSewa, and professional exams with 
                        thousands of practice questions, detailed explanations, and instant feedback.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/mcq" className="btn-primary">
                            Start Practicing <i className="bi bi-arrow-right"></i>
                        </Link>
                        <Link to="/about" className="btn-secondary">
                            Learn More <i className="bi bi-info-circle"></i>
                        </Link>
                    </div>
                    <div className="hero-stats-mini">
                        <div className="stat-mini">
                            <span className="stat-number">10,000+</span>
                            <span className="stat-label">Questions</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-mini">
                            <span className="stat-number">50+</span>
                            <span className="stat-label">Categories</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-mini">
                            <span className="stat-number">100%</span>
                            <span className="stat-label">Free</span>
                        </div>
                    </div>
                </div>
                <div className="hero-image">
                    <div className="hero-illustration">
                        <div className="floating-card card-1">
                            <i className="bi bi-check-circle-fill"></i>
                            <span>98% Success Rate</span>
                        </div>
                        <div className="floating-card card-2">
                            <i className="bi bi-star-fill"></i>
                            <span>4.9 Rating</span>
                        </div>
                        <div className="floating-card card-3">
                            <i className="bi bi-people-fill"></i>
                            <span>50K+ Users</span>
                        </div>
                        <div className="hero-icon-main">
                            <i className="bi bi-mortarboard-fill"></i>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home_Hero;
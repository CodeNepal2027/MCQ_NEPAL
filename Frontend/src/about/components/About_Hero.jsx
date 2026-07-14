import React from 'react';
import '../assets/css/About_Hero.css';

const About_Hero = () => {
    return (
        <section className="about-hero">
            <div className="about-hero-container">
                <div className="about-hero-content">
                    <span className="about-hero-badge">About Us</span>
                    <h1 className="about-hero-title">
                        Your Trusted <span className="highlight">MCQ Practice</span> Platform
                    </h1>
                    <p className="about-hero-description">
                        We are dedicated to providing the best MCQ practice experience for students 
                        and professionals preparing for various exams in Nepal.
                    </p>
                    <div className="about-hero-stats">
                        <div className="about-stat">
                            <span className="about-stat-number">2020</span>
                            <span className="about-stat-label">Founded</span>
                        </div>
                        <div className="about-stat">
                            <span className="about-stat-number">50K+</span>
                            <span className="about-stat-label">Students</span>
                        </div>
                        <div className="about-stat">
                            <span className="about-stat-number">95%</span>
                            <span className="about-stat-label">Success Rate</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About_Hero;
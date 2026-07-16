import React from 'react';
import '../assets/css/About_Mission.css';

const About_Mission = () => {
    return (
        <section className="about-mission">
            <div className="mission-container">
                <div className="mission-card">
                    <div className="mission-icon"><i className="bi bi-bullseye"></i></div>
                    <h3>Our Mission</h3>
                    <p>
                        To provide accessible, high-quality MCQ practice resources to every 
                        student in Nepal, helping them achieve their academic and professional goals.
                    </p>
                </div>
                <div className="mission-card">
                    <div className="mission-icon"><i className="bi bi-eye-fill"></i></div>
                    <h3>Our Vision</h3>
                    <p>
                        To become Nepal's most trusted and comprehensive MCQ practice platform, 
                        empowering students to excel in every exam they take.
                    </p>
                </div>
                <div className="mission-card">
                    <div className="mission-icon"><i className="bi bi-gem"></i></div>
                    <h3>Our Values</h3>
                    <p>
                        Quality, accessibility, innovation, and student success. We believe in 
                        continuous improvement and staying ahead of educational needs.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default About_Mission;
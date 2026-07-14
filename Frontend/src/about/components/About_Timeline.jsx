import React from 'react';
import '../assets/css/About_Timeline.css';

const About_Timeline = () => {
    const milestones = [
        {
            year: '2020',
            title: 'Platform Launch',
            description: 'Launched with 500+ questions for entrance exams.'
        },
        {
            year: '2021',
            title: 'Expanded Categories',
            description: 'Added License and LokSewa exam categories.'
        },
        {
            year: '2022',
            title: '10K+ Questions',
            description: 'Reached 10,000+ practice questions across all categories.'
        },
        {
            year: '2023',
            title: '50K+ Users',
            description: 'Surpassed 50,000 active users on the platform.'
        }
    ];

    return (
        <section className="about-timeline">
            <div className="timeline-container">
                <div className="section-header">
                    <span className="section-subtitle">Our Journey</span>
                    <h2 className="section-title">Milestones <span className="highlight">Achieved</span></h2>
                </div>
                <div className="timeline">
                    {milestones.map((item, index) => (
                        <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                            <div className="timeline-content">
                                <span className="timeline-year">{item.year}</span>
                                <h3 className="timeline-title">{item.title}</h3>
                                <p className="timeline-description">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About_Timeline;
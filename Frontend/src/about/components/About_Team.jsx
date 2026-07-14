import React from 'react';
import '../assets/css/About_Team.css';

const About_Team = () => {
    const team = [
        {
            name: 'Bikram Thapa',
            role: 'Founder & CEO',
            avatar: '👨‍💻',
            bio: 'Education technology enthusiast with 10+ years of experience.'
        },
        {
            name: 'Sita Adhikari',
            role: 'Content Director',
            avatar: '👩‍🏫',
            bio: 'Expert in curriculum development and educational content creation.'
        },
        {
            name: 'Ram Sharma',
            role: 'Technical Lead',
            avatar: '👨‍🔧',
            bio: 'Full-stack developer passionate about building educational platforms.'
        }
    ];

    return (
        <section className="about-team">
            <div className="team-container">
                <div className="section-header">
                    <span className="section-subtitle">Meet Our Team</span>
                    <h2 className="section-title">The People Behind <span className="highlight">The Platform</span></h2>
                </div>
                <div className="team-grid">
                    {team.map((member, index) => (
                        <div key={index} className="team-card">
                            <div className="team-avatar">{member.avatar}</div>
                            <h3 className="team-name">{member.name}</h3>
                            <span className="team-role">{member.role}</span>
                            <p className="team-bio">{member.bio}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About_Team;
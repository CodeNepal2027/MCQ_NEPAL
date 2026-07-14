import React, { useState, useEffect } from 'react';
import '../assets/css/Home_Stats.css';

const Home_Stats = () => {
    const [counts, setCounts] = useState({
        questions: 0,
        users: 0,
        categories: 0,
        success: 0
    });

    const stats = [
        { id: 'questions', label: 'Practice Questions', icon: 'bi-file-text-fill', target: 10000 },
        { id: 'users', label: 'Active Users', icon: 'bi-people-fill', target: 50000 },
        { id: 'categories', label: 'Exam Categories', icon: 'bi-grid-fill', target: 50 },
        { id: 'success', label: 'Success Rate', icon: 'bi-graph-up-arrow', target: 98 }
    ];

    useEffect(() => {
        const animateCount = () => {
            stats.forEach(stat => {
                let start = 0;
                const duration = 2000;
                const step = Math.ceil(stat.target / (duration / 16));

                const timer = setInterval(() => {
                    start += step;
                    if (start >= stat.target) {
                        start = stat.target;
                        clearInterval(timer);
                    }
                    setCounts(prev => ({
                        ...prev,
                        [stat.id]: start
                    }));
                }, 16);
            });
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCount();
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.5 }
        );

        const section = document.querySelector('.home-stats');
        if (section) {
            observer.observe(section);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section className="home-stats">
            <div className="stats-container">
                <div className="stats-grid">
                    {stats.map((stat) => (
                        <div key={stat.id} className="stat-card">
                            <div className="stat-icon">
                                <i className={stat.icon}></i>
                            </div>
                            <div className="stat-number">
                                {stat.id === 'success' ? `${counts[stat.id]}%` : 
                                    counts[stat.id] >= 1000 ? `${(counts[stat.id]/1000).toFixed(1)}K+` : 
                                    `${counts[stat.id]}+`}
                            </div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Home_Stats;
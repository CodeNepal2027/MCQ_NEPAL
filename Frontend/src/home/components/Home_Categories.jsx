import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Home_Categories.css';

const Home_Categories = () => {
    const categories = [
        {
            id: 'entrance',
            name: 'Entrance',
            icon: '🎓',
            description: 'University & College Entrance Exams',
            color: '#e63946'
        },
        {
            id: 'license',
            name: 'License',
            icon: '📜',
            description: 'Professional & Driving Licenses',
            color: '#2d6a9f'
        },
        {
            id: 'loksewa',
            name: 'LokSewa',
            icon: '🏛️',
            description: 'Public Service Commission Exams',
            color: '#2a9d8f'
        }
    ];

    return (
        <section className="home-categories">
            <div className="categories-container">
                <div className="section-header">
                    <span className="section-subtitle">Exam Categories</span>
                    <h2 className="section-title">Choose Your <span className="highlight">Exam Type</span></h2>
                    <p className="section-description">
                        Select from a wide range of exam categories and start practicing instantly.
                    </p>
                </div>
                <div className="categories-grid">
                    {categories.map((category) => (
                        <div key={category.id} className="category-card">
                            <div className="category-icon" style={{ background: `${category.color}20` }}>
                                <span>{category.icon}</span>
                            </div>
                            <h3 className="category-name">{category.name}</h3>
                            <p className="category-desc">{category.description}</p>
                            <Link to="/categories" className="category-link">
                                Explore <i className="bi bi-arrow-right"></i>
                            </Link>
                        </div>
                    ))}
                </div>
                <div className="categories-cta">
                    <Link to="/categories" className="btn-primary">
                        View All Categories <i className="bi bi-grid-fill"></i>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Home_Categories;
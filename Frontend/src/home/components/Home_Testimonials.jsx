import React, { useState } from 'react';
import '../assets/css/Home_Testimonials.css';

const Home_Testimonials = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const testimonials = [
        {
            id: 1,
            name: 'Sita Sharma',
            role: 'Engineering Student',
            avatar: '👩‍🎓',
            text: 'This platform helped me ace my IOE entrance exam! The explanations are crystal clear and the practice questions are spot on.',
            rating: 5
        },
        {
            id: 2,
            name: 'Ram Thapa',
            role: 'LokSewa Aspirant',
            avatar: '👨‍🎓',
            text: 'I cleared my LokSewa exam thanks to this amazing MCQ practice hub. The variety of questions and detailed solutions are incredible.',
            rating: 5
        },
        {
            id: 3,
            name: 'Priya Karki',
            role: 'Driving License Candidate',
            avatar: '👩',
            text: 'Passed my driving license test on the first attempt! The practice questions are exactly like the real exam.',
            rating: 4
        }
    ];

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section className="home-testimonials">
            <div className="testimonials-container">
                <div className="section-header">
                    <span className="section-subtitle">Testimonials</span>
                    <h2 className="section-title">What Our <span className="highlight">Students Say</span></h2>
                </div>
                <div className="testimonials-slider">
                    <button className="slide-btn prev" onClick={prevSlide}>
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    <div className="testimonial-card">
                        <div className="testimonial-avatar">{testimonials[activeIndex].avatar}</div>
                        <div className="testimonial-rating">
                            {[...Array(5)].map((_, i) => (
                                <i key={i} className={`bi ${i < testimonials[activeIndex].rating ? 'bi-star-fill' : 'bi-star'}`}></i>
                            ))}
                        </div>
                        <p className="testimonial-text">"{testimonials[activeIndex].text}"</p>
                        <div className="testimonial-author">
                            <h4>{testimonials[activeIndex].name}</h4>
                            <span>{testimonials[activeIndex].role}</span>
                        </div>
                    </div>
                    <button className="slide-btn next" onClick={nextSlide}>
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>
                <div className="testimonial-dots">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === activeIndex ? 'active' : ''}`}
                            onClick={() => setActiveIndex(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Home_Testimonials;
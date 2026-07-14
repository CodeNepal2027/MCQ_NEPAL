import React, { useState } from 'react';
import '../assets/css/Contact_FAQ.css';

const Contact_FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: 'How do I start practicing MCQs?',
            answer: 'Simply select your exam category from the home page, choose your sub-category, and start practicing. No registration required!'
        },
        {
            question: 'Are all questions free?',
            answer: 'Yes! All MCQs on our platform are completely free. We believe in making quality education accessible to everyone.'
        },
        {
            question: 'How often are questions updated?',
            answer: 'We update our question bank weekly with new questions based on recent exam patterns and feedback from users.'
        },
        {
            question: 'Can I track my progress?',
            answer: 'Yes, you can track your progress, see your scores, and identify areas for improvement after each practice session.'
        }
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="contact-faq">
            <div className="faq-container">
                <div className="section-header">
                    <span className="section-subtitle">FAQ</span>
                    <h2 className="section-title">Frequently Asked <span className="highlight">Questions</span></h2>
                </div>
                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <div key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`}>
                            <div className="faq-question" onClick={() => toggleFAQ(index)}>
                                <span>{faq.question}</span>
                                <i className={`bi ${activeIndex === index ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                            </div>
                            <div className="faq-answer">
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Contact_FAQ;
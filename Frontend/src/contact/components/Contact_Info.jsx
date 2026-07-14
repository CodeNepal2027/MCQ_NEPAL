import React from 'react';
import '../assets/css/Contact_Info.css';

const Contact_Info = () => {
    const contactMethods = [
        {
            icon: 'bi-geo-alt-fill',
            title: 'Address',
            details: 'Kathmandu, Nepal',
            color: '#dc2626'
        },
        {
            icon: 'bi-envelope-fill',
            title: 'Email',
            details: 'support@nepalmcqhub.com',
            color: '#3b82f6'
        },
        {
            icon: 'bi-telephone-fill',
            title: 'Phone',
            details: '+977 984-1234567',
            color: '#16a34a'
        },
        {
            icon: 'bi-clock-fill',
            title: 'Working Hours',
            details: 'Mon-Fri: 9AM - 6PM',
            color: '#f59e0b'
        }
    ];

    return (
        <div className="contact-info">
            <div className="contact-info-header">
                <span className="contact-badge">Get in Touch</span>
                <h2 className="contact-title">Contact <span className="highlight">Us</span></h2>
                <p className="contact-description">
                    Have questions or feedback? We'd love to hear from you.
                </p>
            </div>
            <div className="contact-methods">
                {contactMethods.map((method, index) => (
                    <div key={index} className="contact-method">
                        <div className="method-icon" style={{ background: `${method.color}15` }}>
                            <i className={method.icon} style={{ color: method.color }}></i>
                        </div>
                        <h4 className="method-title">{method.title}</h4>
                        <p className="method-details">{method.details}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Contact_Info;
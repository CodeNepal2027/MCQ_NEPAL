import React from 'react';
import { Link } from 'react-router-dom';
import "./assets/css/Footer.css";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        quickLinks: [
            { name: 'Home', path: '/' },
            { name: 'MCQ Practice', path: '/mcq' },
            { name: 'About Us', path: '/about' },
            { name: 'Contact', path: '/contact' }
        ],
        categories: [
            { name: 'Entrance Exams', path: '/categories/entrance' },
            { name: 'License Exams', path: '/categories/license' },
            { name: 'LokSewa', path: '/categories/loksewa' },
            { name: 'Medical', path: '/categories/medical' }
        ],
        support: [
            { name: 'Help Center', path: '/help' },
            { name: 'Privacy Policy', path: '/privacy' },
            { name: 'Terms of Service', path: '/terms' },
            { name: 'FAQ', path: '/faq' }
        ]
    };

    const socialLinks = [
        { icon: 'bi-facebook', url: 'https://facebook.com', label: 'Facebook' },
        { icon: 'bi-twitter-x', url: 'https://twitter.com', label: 'Twitter' },
        { icon: 'bi-instagram', url: 'https://instagram.com', label: 'Instagram' },
        { icon: 'bi-youtube', url: 'https://youtube.com', label: 'YouTube' },
        { icon: 'bi-linkedin', url: 'https://linkedin.com', label: 'LinkedIn' }
    ];

    return (
        <footer className="footer-main">
            <div className="footer-container">
                {/* Top Section - Brand & Description */}
                <div className="footer-top">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <span className="logo-icon">📝</span>
                            <span className="logo-text">MCQ NEPAL</span>
                        </div>
                        <p className="footer-description">
                            Your trusted platform for MCQ practice across all Nepalese exams. 
                            Prepare for Entrance, License, LokSewa, and professional exams with 
                            thousands of practice questions and detailed explanations.
                        </p>
                        <div className="footer-social">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="social-link"
                                >
                                    <i className={social.icon}></i>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="footer-links">
                        <div className="footer-column">
                            <h4 className="footer-heading">Quick Links</h4>
                            <ul className="footer-list">
                                {footerLinks.quickLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link to={link.path} className="footer-link">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h4 className="footer-heading">Categories</h4>
                            <ul className="footer-list">
                                {footerLinks.categories.map((link) => (
                                    <li key={link.name}>
                                        <Link to={link.path} className="footer-link">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h4 className="footer-heading">Support</h4>
                            <ul className="footer-list">
                                {footerLinks.support.map((link) => (
                                    <li key={link.name}>
                                        <Link to={link.path} className="footer-link">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Section - Copyright */}
                <div className="footer-bottom">
                    <div className="footer-bottom-content">
                        <p className="footer-copyright">
                            &copy; {currentYear} <span className="copyright-brand">Nepal MCQ Hub</span>. 
                            All rights reserved.
                        </p>
                        <p className="footer-credit">
                            Made with <span className="heart-icon">❤️</span> in Nepal
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import "./assets/css/Navbar.css";

const Navbar = () => {
    const [theme, setTheme] = useState('system');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Theme options
    const themeOptions = [
        { value: 'light', label: 'Light', icon: 'bi-sun-fill' },
        { value: 'dark', label: 'Dark', icon: 'bi-moon-fill' },
        { value: 'system', label: 'System', icon: 'bi-display-fill' }
    ];

    // Apply theme
    const applyTheme = (selectedTheme) => {
        const root = document.documentElement;
        
        root.classList.remove('theme-light', 'theme-dark');
        
        if (selectedTheme === 'system') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.classList.add(systemPrefersDark ? 'theme-dark' : 'theme-light');
            localStorage.setItem('theme', 'system');
        } else {
            root.classList.add(`theme-${selectedTheme}`);
            localStorage.setItem('theme', selectedTheme);
        }
        
        setTheme(selectedTheme);
    };

    // Load saved theme on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'system';
        applyTheme(savedTheme);
    }, []);

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleSystemThemeChange = (e) => {
            if (theme === 'system') {
                const root = document.documentElement;
                root.classList.remove('theme-light', 'theme-dark');
                root.classList.add(e.matches ? 'theme-dark' : 'theme-light');
            }
        };

        mediaQuery.addEventListener('change', handleSystemThemeChange);
        return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }, [theme]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleThemeChange = (selectedTheme) => {
        applyTheme(selectedTheme);
        setIsDropdownOpen(false);
    };

    const getCurrentThemeIcon = () => {
        const currentTheme = themeOptions.find(opt => opt.value === theme);
        return currentTheme ? currentTheme.icon : 'bi-display-fill';
    };

    const getCurrentThemeLabel = () => {
        const currentTheme = themeOptions.find(opt => opt.value === theme);
        return currentTheme ? currentTheme.label : 'System';
    };

    return (
        <nav className="navbar-main">
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-brand">
                    <span className="brand-icon">📝</span>
                    <span className="brand-text">MCQ NEPAL</span>
                </Link>

                {/* Navigation Links - Desktop */}
                <div className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
                    <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                        <i className="bi bi-house-fill"></i> Home
                    </Link>
                    <Link to="/mcq" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                        <i className="bi bi-grid-fill"></i> MCQ
                    </Link>
                    <Link to="/mcq" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                        <i className="bi bi-alarm-fill"></i> Test
                    </Link>
                    <Link to="/about" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                        <i className="bi bi-info-circle-fill"></i> About
                    </Link>
                    <Link to="/contact" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                        <i className="bi bi-envelope-fill"></i> Contact
                    </Link>
                </div>

                {/* Right side: Theme toggle */}
                <div className="navbar-actions">
                    <div className="theme-dropdown" ref={dropdownRef}>
                        <button 
                            className="theme-toggle-btn"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            aria-label="Toggle theme"
                            title={`Current theme: ${getCurrentThemeLabel()}`}
                        >
                            <i className={getCurrentThemeIcon()}></i>
                            <span className="theme-label">{getCurrentThemeLabel()}</span>
                            <i className={`bi bi-chevron-down ${isDropdownOpen ? 'rotated' : ''}`}></i>
                        </button>

                        {isDropdownOpen && (
                            <div className="theme-dropdown-menu">
                                {themeOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        className={`theme-option ${theme === option.value ? 'active' : ''}`}
                                        onClick={() => handleThemeChange(option.value)}
                                    >
                                        <i className={option.icon}></i>
                                        <span>{option.label}</span>
                                        {theme === option.value && (
                                            <i className="bi bi-check-lg check-icon"></i>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button 
                        className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className="menu-bar"></span>
                        <span className="menu-bar"></span>
                        <span className="menu-bar"></span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
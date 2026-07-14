import React from 'react';
import './assets/css/Home.css';

import {
    Home_Hero,
    Home_Features,
    Home_Stats,
    Home_Categories,
    Home_Testimonials
} from "./Home_Import"

const Home = () => {
    return (
        <div className="home-page">
            <Home_Hero />
            <Home_Features />
            <Home_Stats />
            <Home_Categories />
            <Home_Testimonials />
        </div>
    );
};

export default Home;
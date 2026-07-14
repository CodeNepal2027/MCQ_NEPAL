import React from 'react';
import './assets/css/About.css';

import {
    About_Hero,
    About_Mission,
    About_Team,
    About_Timeline
} from "./About_Import"

const About = () => {
    return (
        <div className="about-page">
            <About_Hero />
            <About_Mission />
            <About_Team />
            <About_Timeline />
        </div>
    );
};

export default About;
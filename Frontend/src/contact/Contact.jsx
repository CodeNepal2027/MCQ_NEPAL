import React from 'react';

import { 
    Contact_Info, 
    Contact_Form, 
    Contact_FAQ 
} from './Contact_Import';

import './assets/css/Contact.css';

const Contact = () => {
    return (
        <div className="contact-page">
            <div className="contact-grid-container">
                <Contact_Info />
                <Contact_Form />
            </div>
            <Contact_FAQ />
        </div>
    );
};

export default Contact;
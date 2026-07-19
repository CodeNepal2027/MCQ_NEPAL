import React from 'react';
import { MCQProvider } from './MCQ_API_Context';

const MCQ_API_Provider = ({ children }) => {
    return (
        <MCQProvider>
            {children}
        </MCQProvider>
    );
};

// Helper function to clear MCQ state (useful for logout or reset)
export const clearMCQState = () => {
    localStorage.removeItem('mcq_state');
};

export default MCQ_API_Provider;
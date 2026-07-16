import React from 'react';
import { MCQProvider } from './MCQ_API_Context';

const MCQ_API_Provider = ({ children }) => {
    return (
        <MCQProvider>
            {children}
        </MCQProvider>
    );
};

export default MCQ_API_Provider;
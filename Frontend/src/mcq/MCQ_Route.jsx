import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MCQ, MCQ_API_Provider } from './MCQ_Import';

const MCQ_Route = () => {
    return (
        <MCQ_API_Provider>
            <Routes>
                <Route path="/" element={<MCQ />} />
                {/* <Route path="/" element={<School />}>
                    <Route index element={<Navigate to="syllabus" replace />} />
                    <Route path="class" element={<School_Class />} />
                    <Route path="syllabus" element={<School_Syllabus />} />
                    <Route path="student" element={<School_Student />} />
                    <Route path="billing" element={<School_Billing />} />
                    <Route path="notice" element={<School_Notice />} />
                    <Route path="contact" element={<School_Contact />} />
                </Route> */}
            </Routes>
        </MCQ_API_Provider>
    );
};

export default MCQ_Route;
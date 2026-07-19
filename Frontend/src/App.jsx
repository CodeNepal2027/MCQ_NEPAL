import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Navbar from './global/Navbar'
import Footer from "./global/Footer"
import { Home } from './home/Home_Import'
import { About } from './about/About_Import'
import { Contact } from './contact/Contact_Import'
import { MCQ_Route } from './mcq/MCQ_Import'

function App() {
    return(
        <BrowserRouter>
                <div className="app-container">
                    <Navbar />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            
                            <Route path="/mcq/*" element={<MCQ_Route />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </BrowserRouter>
    )
}

export default App

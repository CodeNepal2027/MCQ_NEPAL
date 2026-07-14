import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Navbar from './global/Navbar'
import Footer from "./global/Footer"

function App() {
  return(
    <BrowserRouter>
            <div className="app-container">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        {/* <Route path="/" element={<div>Home Page</div>} />
                        <Route path="/categories" element={<div>Categories Page</div>} />
                        <Route path="/about" element={<div>About Page</div>} />
                        <Route path="/contact" element={<div>Contact Page</div>} /> */}
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
  )
}

export default App

import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Navbar from './global/Navbar'
import Footer from "./global/Footer"

function App() {
  return(
    <BrowserRouter>
      <Navbar />
      <Footer />
    </BrowserRouter>
  )
}

export default App

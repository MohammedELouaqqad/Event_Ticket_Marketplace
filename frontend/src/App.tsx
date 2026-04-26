import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Authenticate from './pages/Authenticate';

import Acceuil from './pages/Acceuil';
import Card from './pages/Card';
import Register from './pages/Register';

function App() {
  

  return (
    <BrowserRouter>
      <Routes>

        <Route path='/' element={<Authenticate/>}/>
        <Route path='/Register' element={<Register/>}/>
        <Route path='/Acceuil' element={<Acceuil/>}/>
        <Route path='/Card' element={<Card/>}/>


      </Routes>
    </BrowserRouter>
  )
}

export default App

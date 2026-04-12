import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './pages/Login';
import SignUp from './pages/SignUp';

import Acceuil from './pages/Acceuil';
import Cart from './pages/Cart';

function App() {
  

  return (
    <BrowserRouter>
      <Routes>

        <Route path='/' element={<Login/>}/>
        <Route path='/SignUp' element={<SignUp/>}/>
        <Route path='/Acceuil' element={<Acceuil/>}/>
        <Route path='/Card' element={<Cart/>}/>

      </Routes>
    </BrowserRouter>
  )
}

export default App

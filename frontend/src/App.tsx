import { useState } from 'react'
import * as React from 'react'
import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'
import Authenticate from './pages/Authenticate';

import Events from './pages/Events';
import Card from './pages/Card';
import Register from './pages/Register';
import { UserContext } from './context/UserContext';

import {type UserRegister} from "./types/index"
import * as ReactDOM from 'react-dom/client';
import AuthProvider from './Components/AuthProvider';
import ProtectedRoute from './Components/ProtectedRoute';



function App() {

  // const router =createBrowserRouter([
  //   {
  //     path:'/',
  //     element:<Authenticate/>
  //   },
  //   {
  //     path:'/register',
  //     element:<Register/>
  //   },
  //   {
  //     path:'/events',
  //     element:<ProtectedRoute>
  //               <Events/>
  //             </ProtectedRoute>
  //   },
  //   {
  //     path:'/card',
  //     element:<ProtectedRoute>
  //               <Card/>
  //             </ProtectedRoute>
  //   }
  // ])

  const [userConnected, setUserConnected]= useState<UserRegister>()

  return(
    <UserContext.Provider value={{userConnected, setUserConnected}}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Authenticate/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/events' element={<Events/>}/>
          <Route path='/card' element={<Card/>}/>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  )

  

    // ReactDOM.createRoot(document.getElementById('root')!).render(
    //   <React.StrictMode>
    //     <AuthProvider isAuthenticated={false}>
    //       <RouterProvider router={router} />
    //     </AuthProvider>
    //   </React.StrictMode>
    // )
  
}

export default App

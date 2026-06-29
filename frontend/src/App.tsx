import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Authenticate from "./pages/Authenticate";
import Events from "./pages/Events";
import Card from "./pages/Card";
import Register from "./pages/Register";
import { UserContext } from "./context/UserContext";
import { type UserRegister } from "./types/index";

function App() {
  const [userConnected, setUserConnected] = useState<UserRegister | null>(null);

  return (
    <UserContext.Provider value={{ userConnected, setUserConnected }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Authenticate />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<Events />} />
          <Route path="/card" element={<Card />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;

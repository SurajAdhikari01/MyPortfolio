// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./App.scss";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="App bg-gray-800">
      <Router>
        <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <Routes>
          <Route exact path="/" element={<Home isMenuOpen={isMenuOpen} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GameHub from "./components/GameHub";
import App from "./App"; // your existing 500-line Poker code
import Blackjack from "./components/Blackjack";
import Roulette from "./components/Roulette";

function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GameHub />} />
        <Route path="/poker" element={<App />} />        {/* Poker game */}
        <Route path="/blackjack" element={<Blackjack />} />
        <Route path="/roulette" element={<Roulette />} />
      </Routes>
    </Router>
  );
}

export default Main;

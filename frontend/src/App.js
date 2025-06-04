// frontend/src/App.js

import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import FortunePage from "./pages/FortunePage";
import TarotGalleryPage from "./pages/TarotGalleryPage";
import MawangGalleryPage from "./pages/MawangGalleryPage";
import RequestPage from "./pages/RequestPage";

function App() {
  return (
    <div className="App">
      {/* 상단 네비게이션 */}
      <nav
        className="main-nav"
        style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}
      >
        <Link to="/" style={{ marginRight: "1rem" }}>
          🔮 타로 운세 보기 🔮
        </Link>
        <Link to="/tarot-gallery" style={{ marginRight: "1rem" }}>
          🃏 타로카드 갤러리 🃏
        </Link>
        <Link to="/mawang-gallery" style={{ marginRight: "1rem" }}>
          ❤️ 마왕 갤러리 ❤️
        </Link>
        <Link to="/request" style={{ marginRight: "1rem" }}>
          ✉️ 개발자에게 요청하기 ✉️
        </Link>
      </nav>

      {/* Route 설정 */}
      <Routes>
        <Route path="/" element={<FortunePage />} />
        <Route path="/tarot-gallery" element={<TarotGalleryPage />} />
        <Route path="/mawang-gallery" element={<MawangGalleryPage />} />
        <Route path="/request" element={<RequestPage />} />
      </Routes>
    </div>
  );
}

export default App;


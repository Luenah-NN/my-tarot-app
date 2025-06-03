// frontend/src/App.js

import React, { useState } from "react";
import axios from "axios";
import Card from "./components/Card";
import { tarotCards } from "./utils/tarotData";
import "./App.css";

function App() {
  // 상태(state) 정의
  const [selectedCards, setSelectedCards] = useState([]);   // 뽑힌 카드 3장 정보 배열
  const [interpretation, setInterpretation] = useState(""); // ChatGPT 해석문
  const [loading, setLoading] = useState(false);            // 로딩 여부

  // 1) 무작위 3장 뽑기 함수 (역방향 기능 포함)
  const drawThreeCards = () => {
    // 1-1) tarotCards 배열을 무작위로 섞음
    const shuffled = [...tarotCards].sort(() => 0.5 - Math.random());

    // 1-2) 앞에서부터 3개만 가져옴
    const picked3 = shuffled.slice(0, 3);

    // 1-3) 각 카드마다 50% 확률로 역위치(reversed) 지정
    const withOrientation = picked3.map(card => {
      // 0~1 사이 랜덤 숫자. <0.5면 역위치, 아니면 정위치
      const isReversed = Math.random() < 0.5;

      return {
        ...card,
        orientation: isReversed ? "reversed" : "upright"
      };
    });

    // 상태에 저장
    setSelectedCards(withOrientation);
    // 이전 해석문 초기화
    setInterpretation("");
  };

  // 2) ChatGPT 해석 요청 함수 (역방향 정보 포함)
  const getInterpretation = async () => {
    if (selectedCards.length !== 3) {
      alert("먼저 3장의 카드를 뽑아주세요.");
      return;
    }

    try {
      setLoading(true);
      // 백엔드 주소 (환경변수에서 읽어옴)
      const API_URL = process.env.REACT_APP_API_URL;

      // 프론트 → 백엔드로 카드 정보 전송
      //   cards 배열에 { name_en, name_kr, filename, orientation } 포함
      const response = await axios.post(`${API_URL}/api/interpret`, {
        cards: selectedCards.map(c => ({
          name_en: c.name_en,
          name_kr: c.name_kr,
          filename: c.filename,
          orientation: c.orientation
        })),
      });

      // 백엔드에서 돌려준 해석문
      const { interpretation: text } = response.data;
      setInterpretation(text);
    } catch (error) {
      console.error("Error fetching interpretation:", error);
      alert("운세 해석을 가져오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App" style={{ maxWidth: "600px", margin: "30px auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>🔮 뫙넴이 뽑아주는 타로 오늘의 운세 🔮 </h1>

      {/* 1) 카드 뽑기 버튼 */}
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <button
          onClick={drawThreeCards}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "6px",
            backgroundColor: "#6f4e37",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          카드 뽑기
        </button>
      </div>

      {/* 2) 뽑힌 카드 3장 보여주기 */}
      {selectedCards.length === 3 && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          {selectedCards.map(card => (
            <Card 
              key={card.id} 
              filename={card.filename} 
              nameKr={card.name_kr} 
              orientation={card.orientation} // 역방향 여부 전달
            />
          ))}
        </div>
      )}

      {/* 3) 해석 요청 버튼 (3장 뽑힌 이후에만 보임) */}
      {selectedCards.length === 3 && (
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <button
            onClick={getInterpretation}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              borderRadius: "6px",
              backgroundColor: "#b23737",
              color: "white",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? "해석 중…" : "해석받기"}
          </button>
        </div>
      )}

      {/* 4) 로딩 스피너 */}
      {loading && (
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          {/* public 폴더에 저장된 spinner.png를 불러와서 회전 애니메이션 적용 */}
          <img
            src={process.env.PUBLIC_URL + "/spinner.png"}
            alt="로딩 중"
            className="spinner-img"
          />
          <p style={{ marginTop: "10px" }}>뫙넴이 운세를 해석 중입니다…</p>
        </div>
      )}

      {/* 5) ChatGPT 해석 결과 및 뽑힌 카드 이미지 다시 보여주기 */}
      {interpretation && (
        <div
          className="fade-in"
          style={{
            backgroundColor: "#f5f5f5",
            padding: "20px",
            borderRadius: "8px",
            lineHeight: "1.6",
            whiteSpace: "pre-wrap",
          }}
        >
          <h2 style={{ marginTop: 0 }}>🔮 오늘의 운세 해석</h2>

          {/* 해석문 위에 다시 뽑힌 카드 3장 보여주기 */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
            {selectedCards.map(card => (
              <Card 
                key={card.id} 
                filename={card.filename} 
                nameKr={card.name_kr} 
                orientation={card.orientation}  // 다시 orientation 전달
              />
            ))}
          </div>

          <p>{interpretation}</p>
        </div>
      )}
    </div>
  );
}

export default App;

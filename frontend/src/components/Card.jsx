// frontend/src/components/Card.jsx

import React from "react";

// Card 컴포넌트: 
//   filename: 이미지 파일명 (예: "00_Fool.jpg")
//   nameKr: 카드 한국어 이름 (예: "광대")
//   orientation: "upright" 또는 "reversed"
const Card = ({ filename, nameKr, orientation }) => {
  // public/cards/폴더 안에 저장된 이미지 경로
  const imageUrl = process.env.PUBLIC_URL + "/cards/" + filename;

  // 역위치(reversed)일 때 이미지를 180도 뒤집기 위한 CSS
  const rotateStyle = orientation === "reversed"
    ? { transform: "rotate(180deg)" }
    : {};

  return (
    <div style={{ textAlign: "center", margin: "0 10px" }}>
      <img
        src={imageUrl}
        alt={nameKr}
        style={{
          width: "200px",
          height: "auto",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          ...rotateStyle  // orientation이 "reversed"면 회전 적용
        }}
      />
      {/* 만약 역위치라면 카드 아래 이름 옆에 (역방향) 텍스트를 작게 표시해도 좋습니다 */}
      <div style={{ marginTop: "5px", fontWeight: "bold" }}>
        {nameKr} {orientation === "reversed" && "(역방향)"}
      </div>
    </div>
  );
};

export default Card;


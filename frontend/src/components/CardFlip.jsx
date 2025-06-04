// frontend/src/components/CardFlip.jsx
import React, { useState } from 'react';
import './CardFlip.css';

/**
 * props:
 *  - frontImage: 카드 앞면 이미지 URL (예: "/cards/TheFool.jpg")
 *  - backImage: 카드 뒷면 공통 이미지 URL (예: "/cards/back.jpg")
 *  - onClick: 카드가 완전히 뒤집힌 뒤 호출되는 콜백 (선택된 카드 처리)
 */
function CardFlip({ frontImage, backImage, onClick }) {
  const [flipped, setFlipped] = useState(false);

  const handleCardClick = () => {
    if (flipped) return;
    setFlipped(true);
    // 카드 뒤집힘 애니메이션(0.5초) + 안정적인 호출을 위해 약간의 딜레이
    setTimeout(() => {
      if (onClick) onClick();
    }, 500);
  };

  return (
    <div className={`card-flip ${flipped ? 'flipped' : ''}`} onClick={handleCardClick}>
      <div className="card-back">
        <img src={backImage} alt="back" className="card-image" />
      </div>
      <div className="card-front">
        <img src={frontImage} alt="front" className="card-image" />
      </div>
    </div>
  );
}

export default CardFlip;

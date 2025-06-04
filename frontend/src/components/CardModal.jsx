// frontend/src/components/CardModal.jsx
import React from 'react';
import './CardModal.css';

/**
 * props:
 *  - isOpen: boolean (모달 열기/닫기)
 *  - imageUrl: 보여줄 이미지 URL (ex: "/cards/TheFool.jpg" 또는 "/mawang/mawang1.jpg")
 *  - interpretation: 이미지 아래에 보여줄 텍스트 (해석 또는 설명)
 *  - onClose: 모달 닫기 함수
 */
function CardModal({ isOpen, imageUrl, interpretation, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt="modal" className="modal-card-image" />
        {interpretation && (
          <div className="modal-interpretation">
            {interpretation}
          </div>
        )}
        <button className="modal-close-btn" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}

export default CardModal;

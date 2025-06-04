// frontend/src/pages/TarotGalleryPage.jsx

import React, { useState } from "react";
import tarotInterpretations from "../data/tarotInterpretations";
import cardsData from "../data/cardsData"; // cardsData에서 한글 이름과 파일명을 가져옵니다
import "./TarotGalleryPage.css"; // 아래 CSS를 이 파일에 넣어주세요

// tarotInterpretations의 키(예: "TheFool", "TheMagician" 등) 목록
const ALL_CARD_KEYS = Object.keys(tarotInterpretations);

function TarotGalleryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCardKey, setModalCardKey] = useState("");

  // 카드 클릭 시 모달 열기
  const openModal = (cardKey) => {
    setModalCardKey(cardKey);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setModalCardKey("");
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>🃏 타로카드 갤러리 🃏</h2>
      <div
        className="card-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "25px",
        }}
      >
        {ALL_CARD_KEYS.map((cardKey) => {
          // cardsData에서 filename(baseName)과 일치하는 항목을 찾습니다.
          const cardMeta = cardsData.find(
            (c) => c.filename.replace(".jpg", "") === cardKey
          );

          // 파일명이 cardsData에 있으면 cardMeta.filename, 없으면 기본값
          const filename = cardMeta ? cardMeta.filename : `${cardKey}.jpg`;

          // 한글 이름이 있으면 cardMeta.name_kr, 없으면 영어 키 그대로 표시
          const displayName = cardMeta ? cardMeta.name_kr : cardKey;

          return (
            <div
              key={cardKey}
              className="card-item"
              style={{ textAlign: "center", cursor: "pointer" }}
              onClick={() => openModal(cardKey)}
            >
              <img
                src={`/cards/${filename}`}
                alt={cardKey}
                style={{
                  width: "250px",
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: "4px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                }}
              />
              <div style={{ marginTop: "4px", fontSize: "20px" }}>
                {displayName}
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && modalCardKey && (
        <>
          {/* 반투명 배경 */}
          <div className="overlay-background" onClick={closeModal} />

          {/* 모달 콘텐츠: 이미지 왼쪽, 텍스트 오른쪽 */}
          <div className="modal-content-horizontal animate-modal-horizontal">
            {/* 왼쪽: 이미지 */}
            <div className="modal-image-horizontal">
              <img
                src={`/cards/${
                  (() => {
                    const cardMeta = cardsData.find(
                      (c) => c.filename.replace(".jpg", "") === modalCardKey
                    );
                    return cardMeta ? cardMeta.filename : `${modalCardKey}.jpg`;
                  })()
                }`}
                alt={modalCardKey}
              />
            </div>

            {/* 오른쪽: 한글 이름 + general 해석 */}
            <div className="modal-description-horizontal">
              <h3>
                {(() => {
                  const cardMeta = cardsData.find(
                    (c) => c.filename.replace(".jpg", "") === modalCardKey
                  );
                  return cardMeta ? cardMeta.name_kr : modalCardKey;
                })()}
              </h3>
              <p>{tarotInterpretations[modalCardKey].general}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TarotGalleryPage;



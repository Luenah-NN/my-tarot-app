// frontend/src/pages/MawangGalleryPage.jsx

import React, { useState } from "react";
import mawangData from "../data/mawangData";
import "./MawangGalleryPage.css"; // 아래 CSS를 이 파일에 넣어주세요

function MawangGalleryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMawang, setSelectedMawang] = useState(null);

  const openModal = (mawangObj) => {
    setSelectedMawang(mawangObj);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMawang(null);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>❤️ 마왕 갤러리 ❤️</h2>
      <div
        className="mawang-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "25px",
        }}
      >
        {mawangData.map((mw) => (
          <div
            key={mw.id}
            style={{ textAlign: "center", cursor: "pointer" }}
            onClick={() => openModal(mw)}
          >
            <img
              src={mw.imageUrl}
              alt={mw.name}
              style={{
                width: "250px",
                height: "auto",
                objectFit: "cover",
                borderRadius: "4px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              }}
            />
            <div style={{ marginTop: "4px", fontSize: "20px" }}>
              {mw.name}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedMawang && (
        <>
          {/* 반투명 배경 */}
          <div className="overlay-background" onClick={closeModal} />

          {/* 모달 콘텐츠: 이미지 왼쪽, 텍스트 오른쪽 */}
          <div className="modal-content-horizontal animate-modal-horizontal">
            {/* 왼쪽: 이미지 */}
            <div className="modal-image-horizontal">
              <img
                src={selectedMawang.imageUrl}
                alt={selectedMawang.name}
              />
            </div>

            {/* 오른쪽: 설명 */}
            <div className="modal-description-horizontal">
              <h3>{selectedMawang.name}</h3>
              <p>{selectedMawang.description}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MawangGalleryPage;



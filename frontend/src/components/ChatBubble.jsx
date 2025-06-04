// frontend/src/components/ChatBubble.jsx

import React from "react";
import "./ChatBubble.css";

/**
 * props:
 *  - sender: "user" 또는 "mawang"
 *  - text: 표시할 문자열 (여러 문단은 "\n\n"으로 구분)
 *  - avatarUrl: (옵션) 발신자 프로필 이미지 주소
 */
function ChatBubble({ sender, text, avatarUrl }) {
  // "\n\n" 기준으로 나누어 각 문단을 <p>로 렌더링
  const paragraphs = text.split("\n\n");

  return (
    <div className={`chat-bubble ${sender === "mawang" ? "left" : "right"}`}>
      {sender === "mawang" && avatarUrl && (
        <img src={avatarUrl} alt="mawang" className="avatar" />
      )}
      <div className="bubble">
        {paragraphs.map((para, idx) => (
          <p key={idx} className="bubble-text">
            {para}
          </p>
        ))}
      </div>
      {sender === "user" && avatarUrl && (
        <img src={avatarUrl} alt="user" className="avatar" />
      )}
    </div>
  );
}

export default ChatBubble;


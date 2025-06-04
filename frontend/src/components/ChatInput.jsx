// frontend/src/components/ChatInput.jsx
import React, { useState } from 'react';
import './ChatInput.css';

/**
 * props:
 *  - onSend: (text: string) => void
 *  - placeholder: 입력란 placeholder 텍스트
 */
function ChatInput({ onSend, placeholder = "메시지를 입력하세요..." }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chat-input-container">
      <input
        type="text"
        className="chat-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
      />
      <button className="chat-send-btn" onClick={handleSend}>
        전송
      </button>
    </div>
  );
}

export default ChatInput;

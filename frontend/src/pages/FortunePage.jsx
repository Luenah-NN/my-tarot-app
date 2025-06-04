// frontend/src/pages/FortunePage.jsx

import React, { useState, useEffect, useRef } from "react";
import ChatBubble from "../components/ChatBubble";
import ChatInput from "../components/ChatInput";
import cardsData from "../data/cardsData";

// 4개의 스피너 이미지를 assets 폴더에 넣고 import
import spinner1 from "../assets/spinner1.png";
import spinner2 from "../assets/spinner2.png";
import spinner3 from "../assets/spinner3.png";
import spinner4 from "../assets/spinner4.png";

import "./FortunePage.css";

function FortunePage() {
  // 1) 채팅 메시지 배열
  const [messages, setMessages] = useState([]);
  // 2) 단계 관리: 
  // 'start' → 'waitingTopic' → 'awaitCustomQuestion' → 'showCards' →
  // 'waitingInterpret' → 'postInterpret' → 'done'
  const [stage, setStage] = useState("start");
  // 3) 로딩 중 여부
  const [loading, setLoading] = useState(false);
  // 4) 사용자가 선택한 topic
  const [selectedTopic, setSelectedTopic] = useState("");
  // 5) 사용자 커스텀 질문
  const [customQuestion, setCustomQuestion] = useState("");
  // 6) 뽑힌 카드 3장 정보
  const [pickedCards, setPickedCards] = useState([]);
  // 7) 카드 확대 모달 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [modalStyleRotate, setModalStyleRotate] = useState("none");
  const [modalInterpretation, setModalInterpretation] = useState("");
  // 8) 채팅창 자동 스크롤
  const chatEndRef = useRef(null);

  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  // 첫 진입
  useEffect(() => {
    if (stage === "start") {
      addMessage({ sender: "mawang", text: "ㅇㄴㅅㅇ?" });
      setStage("waitingTopic");
    }
  }, [stage]);

  // topic 선택
  const handleTopicClick = (topicKey) => {
    if (topicKey === "custom") {
      setSelectedTopic("custom");
      addMessage({ sender: "user", text: "자유 질문" });
      addMessage({ sender: "mawang", text: "어떤 질문이든 입력해 주세요." });
      setStage("awaitCustomQuestion");
      return;
    }

    let topicKr = "";
    switch (topicKey) {
      case "love":
        topicKr = "연애";
        break;
      case "health":
        topicKr = "건강";
        break;
      case "relationship":
        topicKr = "인간관계";
        break;
      case "academic":
        topicKr = "학업";
        break;
      case "daily":
        topicKr = "오늘의 운세";
        break;
      case "work":
        topicKr = "직장";
        break;
      case "money":
        topicKr = "금전";
        break;
    }

    setSelectedTopic(topicKey);
    addMessage({ sender: "user", text: topicKr });
    addMessage({ sender: "mawang", text: "카드를 뽑아볼게요..." });
    setStage("showCards");
  };

  // 커스텀 질문 처리
  const handleCustomSubmit = (text) => {
    const question = text.trim();
    if (!question) {
      addMessage({ sender: "user", text: "" });
      addMessage({ sender: "mawang", text: "질문을 입력해 주세요." });
      return;
    }
    setCustomQuestion(question);
    addMessage({ sender: "user", text: question });
    addMessage({ sender: "mawang", text: "카드를 뽑아볼게요..." });
    setStage("showCards");
  };

  // 카드 뽑기
  useEffect(() => {
    if (stage === "showCards") {
      const shuffled = [...cardsData].sort(() => 0.5 - Math.random());
      const three = shuffled.slice(0, 3);
      const threeWithOrientation = three.map((card) => ({
        ...card,
        orientation: Math.random() < 0.5 ? "reversed" : "upright",
      }));
      setPickedCards(threeWithOrientation);

      addMessage({
        sender: "mawang",
        text: "",
        isCardGroup: true,
        cards: threeWithOrientation.map((cardObj) => ({
          imageUrl: `/cards/${cardObj.filename}`,
          styleRotate:
            cardObj.orientation === "reversed" ? "rotate(180deg)" : "none",
          name_en: cardObj.name_en,
          name_kr: cardObj.name_kr,
          orientation: cardObj.orientation,
        })),
      });

      setTimeout(() => {
        setStage("waitingInterpret");
      }, 500);
    }
  }, [stage]);

  // 해석 요청
  useEffect(() => {
    if (stage === "waitingInterpret") {
      setLoading(true);

      const payload = {
        topic: selectedTopic,
        cards: pickedCards.map((c) => ({
          name_en: c.name_en,
          name_kr: c.name_kr,
          filename: c.filename,
          orientation: c.orientation,
        })),
      };
      if (selectedTopic === "custom") {
        payload.customQuestion = customQuestion;
      }

      fetch(`${process.env.REACT_APP_API_URL}/api/interpret`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          addMessage({ sender: "mawang", text: data.interpretation });
          // 해석 후 추가 질문 묻기
          addMessage({ sender: "mawang", text: "추가적인 질문이 있나요?" });
          setStage("postInterpret");
        })
        .catch((err) => {
          console.error(err);
          addMessage({
            sender: "mawang",
            text: "죄송합니다. 해석 중 오류가 발생했습니다.",
          });
          addMessage({ sender: "mawang", text: "추가적인 질문이 있나요?" });
          setStage("postInterpret");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [stage]);

  // 추가 질문 응답
  const handleAdditionalChoice = (choice) => {
    if (choice === "yes") {
      addMessage({ sender: "user", text: "있습니다" });
      addMessage({ sender: "mawang", text: "어떤 주제로 다시 보시겠어요?" });
      setStage("waitingTopic");
    } else {
      addMessage({ sender: "user", text: "없습니다" });
      addMessage({ sender: "mawang", text: "그럼... 빠잇!!!" });
      setStage("done");
    }
  };

  // 카드 클릭 모달
  const handleCardClick = (msgObj) => {
    if (msgObj.isCard) {
      setModalImageUrl(msgObj.imageUrl);
      setModalStyleRotate(msgObj.styleRotate || "none");
      const oText = msgObj.orientation === "reversed" ? "역방향" : "정위치";
      setModalInterpretation(`${msgObj.name_kr} (${oText})`);
      setIsModalOpen(true);
    }
  };

  // 자동 스크롤
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="fortune-page" style={{ padding: "1rem" }}>
      <h2>🔮 타로 운세 보기 🔮</h2>

      <div className="chat-window-container">
        <div
          className={`chat-window${loading ? " blur" : ""}`}
          style={{
            border: "1px solid #ccc",
            height: "60vh",
            overflowY: "auto",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          {messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: "8px" }}>
              {msg.isCardGroup ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    gap: "8px",
                  }}
                >
                  {msg.cards.map((card, i) => (
                    <img
                      key={i}
                      src={card.imageUrl}
                      alt={card.name_en}
                      style={{
                        width: "200px",
                        height: "auto",
                        objectFit: "cover",
                        transform: card.styleRotate,
                        cursor: "pointer",
                        borderRadius: "4px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                        marginLeft: i === 0 ? "80px" : "0",
                      }}
                      onClick={() =>
                        handleCardClick({
                          isCard: true,
                          imageUrl: card.imageUrl,
                          styleRotate: card.styleRotate,
                          name_en: card.name_en,
                          name_kr: card.name_kr,
                          orientation: card.orientation,
                        })
                      }
                    />
                  ))}
                </div>
              ) : msg.isCard ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.sender === "mawang" ? "flex-start" : "flex-end",
                  }}
                >
                  <img
                    src={msg.imageUrl}
                    alt={msg.name_en}
                    style={{
                      width: "80px",
                      height: "120px",
                      objectFit: "cover",
                      transform: msg.styleRotate,
                      cursor: "pointer",
                      borderRadius: "4px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    }}
                    onClick={() => handleCardClick(msg)}
                  />
                </div>
              ) : (
                <ChatBubble
                  sender={msg.sender}
                  text={msg.text}
                  avatarUrl={
                    msg.sender === "mawang"
                      ? "/images/mawang_profile.jpg"
                      : "/images/user_avatar.png"
                  }
                />
              )}
            </div>
          ))}
          <div ref={chatEndRef} />

          {/* 추가 질문 "있습니다"/"없습니다" 버튼 (postInterpret 단계) */}
          {stage === "postInterpret" && (
            <div className="chat-bubble-buttons">
              <button onClick={() => handleAdditionalChoice("yes")}>
                있습니다
              </button>
              <button onClick={() => handleAdditionalChoice("no")}>
                없습니다
              </button>
            </div>
          )}

          {/* topic 선택 버튼 (waitingTopic 단계) */}
          {stage === "waitingTopic" && (
            <div className="topic-buttons chat-bubble-buttons">
              <button onClick={() => handleTopicClick("love")}>연애</button>
              <button onClick={() => handleTopicClick("health")}>건강</button>
              <button onClick={() => handleTopicClick("relationship")}>
                인간관계
              </button>
              <button onClick={() => handleTopicClick("academic")}>학업</button>
              <button onClick={() => handleTopicClick("daily")}>오늘의 운세</button>
              <button onClick={() => handleTopicClick("work")}>직장</button>
              <button onClick={() => handleTopicClick("money")}>금전</button>
              <button onClick={() => handleTopicClick("custom")}>자유 질문</button>
            </div>
          )}

          {/* 커스텀 질문 입력 대기 (awaitCustomQuestion 단계) */}
          {stage === "awaitCustomQuestion" && (
            <ChatInput
              onSend={handleCustomSubmit}
              placeholder="여기에 자유 질문을 입력하세요"
            />
          )}
        </div>

        {loading && (
          <div className="spinner-overlay">
            <div className="spinner-group">
              <img src={spinner1} alt="spinner1" className="spinner" />
              <img src={spinner2} alt="spinner2" className="spinner" />
              <img src={spinner3} alt="spinner3" className="spinner" />
              <img src={spinner4} alt="spinner4" className="spinner" />
            </div>
          </div>
        )}
      </div>

      {/* 카드 확대 모달 */}
      {isModalOpen && (
        <>
          <div
            className="overlay-background"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="modal-content animate-modal-vertical">
            <div className="modal-image-vertical">
              <img
                src={modalImageUrl}
                alt="타로카드"
                style={{ transform: modalStyleRotate }}
              />
            </div>
            <div className="modal-description-vertical">
              <p>{modalInterpretation}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default FortunePage;




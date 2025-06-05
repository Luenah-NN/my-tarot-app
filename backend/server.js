// backend/server.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error("⚠️ OPENAI_API_KEY가 설정되지 않았습니다. backend/.env 파일을 확인하세요.");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// ──────────────────────────────────────────────────────────────────────────
//  /api/interpret 핸들러: topic(운세 주제) + cards(3장) + customQuestion(선택) 받아서 OpenAI로 해석 요청
// ──────────────────────────────────────────────────────────────────────────
app.post("/api/interpret", async (req, res) => {
  try {
    // ← 기존에는 { cards, topic }만 받아왔습니다. customQuestion도 함께 읽어옵니다.
    const { cards, topic, customQuestion } = req.body;  // ← 수정된 부분

    // cards 검증
    if (!cards || !Array.isArray(cards) || cards.length !== 3) {
      return res.status(400).json({ error: "cards 배열이 정확히 3개여야 합니다." });
    }
    // topic 검증
    if (!topic || typeof topic !== "string") {
      return res.status(400).json({ error: "topic 필드는 문자열이어야 합니다." });
    }

    // 카드별 "(역방향)" 여부를 붙여서 프롬프트에 사용할 문자열 생성
    const cardDescriptions = cards.map((c) => {
      const orientText = c.orientation === "reversed" ? " (역방향)" : " (정위치)";
      return `${c.name_en}${orientText}`;
    });
    // 한글 이름에도 동일하게 "(역방향)" 또는 "(정위치)"를 붙임
    const cardDescriptionsKr = cards.map((c) => {
      const orientText = c.orientation === "reversed" ? " (역방향)" : " (정위치)";
      return `${c.name_kr}${orientText}`;
    });

    // topic을 한글로 변환
    let topicKr;
    switch (topic) {
      case "love":
        topicKr = "연애";
        break;
      case "health":
        topicKr = "건강";
        break;
      case "relationship":
        topicKr = "인간관계";
        break;
      case "custom":
        topicKr = "자유 주제";
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
      default:
        topicKr = "일반";
    }

    // ChatGPT 시스템 프롬프트
    if (topic === "custom" && typeof customQuestion === "string" && customQuestion.trim() !== "") {
      // ───── "custom" 주제이면서 customQuestion이 있을 때 ─────
      systemPrompt = 
        "당신은 전문 타로 리더입니다. 사용자의 질문에 맞춰, " +
        "세 개의 타로 카드 이름(정위치 또는 역위치 포함)을 바탕으로 상세히 한국어로 대답해 주세요.";

      userPrompt =
        `뽑힌 세 장의 타로 카드는 다음과 같습니다:\n` +
        `영문: ${cardDescriptions.join(", ")}\n` +
        `한글: ${cardDescriptionsKr.join(", ")}\n` +
        `그리고 질문은 "${customQuestion.trim()}" 입니다.\n\n` +
        `${customQuestion.trim()}라는 질문에 대해 카드 3장의 결과를 종합해서 ` +
        `3~5문단 분량의 한국어로 대답해주세요.`;
      
      // OpenAI ChatGPT API 호출
      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.8
      });


    } else {
      // ───── "custom"이 아니거나 customQuestion이 없을 때 ─────
      systemPrompt =
        `당신은 전문 타로 리더입니다. 사용자가 선택한 주제("${topicKr}")에 맞춰, ` +
        `세 개의 타로 카드 이름(정위치 또는 역위치 포함)을 바탕으로 상세히 한국어로 해석해 주세요.`;

      userPrompt =
        `뽑힌 세 장의 타로 카드는 다음과 같습니다:\n` +
        `영문: ${cardDescriptions.join(", ")}\n` +
        `한글: ${cardDescriptionsKr.join(", ")}\n` +
        `그리고 주제는 "${topicKr}" 입니다.\n\n` +
        // 필요하다면 else 블록에도 추가 안내 문구를 넣을 수 있습니다.
        `각각의 카드는 "${topicKr}"라는 주제와 관련하여 어떤 의미를 갖는지 1문단, ` +
        `카드 3장의 결과를 종합해서 또 1문단 분량의 한국어로 알려주세요.`;

      // OpenAI ChatGPT API 호출
      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-nano",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 1000,
        temperature: 0.8
      });
    
    }

    const interpretation = completion.choices[0].message.content.trim();

    // 클라이언트로 결과 전송
    res.json({
      interpretation,
      selectedCards: cards
    });
  } catch (err) {
    console.error("Error in /api/interpret:", err);
    res.status(500).json({ error: "서버 내부 오류가 발생했습니다." });
  }
});

// ──────────────────────────────────────────────────────────────────────────
//  서버 실행
// ──────────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Backend 서버가 실행 중입니다 → http://localhost:${PORT}`);
});


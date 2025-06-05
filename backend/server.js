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

app.post("/api/interpret", async (req, res) => {
  try {
    const { cards, topic, customQuestion } = req.body;

    // ── 입력 검증 ──
    if (!cards || !Array.isArray(cards) || cards.length !== 3) {
      return res.status(400).json({ error: "cards 배열이 정확히 3개여야 합니다." });
    }
    if (!topic || typeof topic !== "string") {
      return res.status(400).json({ error: "topic 필드는 문자열이어야 합니다." });
    }

    // ── 카드 문자열 생성 ──
    const cardDescriptions = cards.map((c) => {
      const orientText = c.orientation === "reversed" ? " (역방향)" : " (정위치)";
      return `${c.name_en}${orientText}`;
    });
    const cardDescriptionsKr = cards.map((c) => {
      const orientText = c.orientation === "reversed" ? " (역방향)" : " (정위치)";
      return `${c.name_kr}${orientText}`;
    });

    // ── topic 한글 변환 ──
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

    // ── 변수를 미리 선언 ──
    let systemPrompt;
    let userPrompt;
    let completion;

    if (topic === "custom" && typeof customQuestion === "string" && customQuestion.trim() !== "") {
      // ── custom 질문이 있을 때 ──
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

      completion = await openai.chat.completions.create({
        model: "gpt-4.1-mini",      
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.8
      });
    } else {
      // ── 일반 주제 또는 customQuestion이 없을 때 ──
      systemPrompt =
        `당신은 전문 타로 리더입니다. 사용자가 선택한 주제("${topicKr}")에 맞춰, ` +
        `세 개의 타로 카드 이름(정위치 또는 역위치 포함)을 바탕으로 상세히 한국어로 해석해 주세요.`;

      userPrompt =
        `뽑힌 세 장의 타로 카드는 다음과 같습니다:\n` +
        `영문: ${cardDescriptions.join(", ")}\n` +
        `한글: ${cardDescriptionsKr.join(", ")}\n` +
        `그리고 주제는 "${topicKr}" 입니다.\n\n` +
        `각각의 카드는 "${topicKr}"라는 주제와 관련하여 어떤 의미를 갖는지 1문단, ` +
        `카드 3장의 결과를 종합해서 또 1문단 분량의 한국어로 알려주세요.`;

      completion = await openai.chat.completions.create({
        model: "gpt-4.1-nano",     
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 1000,
        temperature: 0.8
      });
    }

    // ── completion이 반드시 할당되었으므로 안전하게 결과를 뽑아 전송 ──
    const interpretation = completion.choices[0].message.content.trim();
    res.json({
      interpretation,
      selectedCards: cards
    });
  } catch (err) {
    console.error("Error in /api/interpret:", err);
    res.status(500).json({ error: "서버 내부 오류가 발생했습니다." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend 서버가 실행 중입니다 → http://localhost:${PORT}`);
});

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
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// "/api/interpret" 엔드포인트
app.post("/api/interpret", async (req, res) => {
  try {
    const { cards } = req.body;
    // cards: [{ name_en, name_kr, filename, orientation }, …]

    if (!cards || !Array.isArray(cards) || cards.length !== 3) {
      return res.status(400).json({ error: "cards 배열이 정확히 3개여야 합니다." });
    }

    // *1) 카드별로 "역방향" 여부를 포함하여 프롬프트 문장에 추가하기 위해,
    //    각 카드 객체를 순회하며 "(역방향)" 텍스트를 붙입니다.
    //    예: "Fool (역방향)", "Magician (정위치)", ...
    const cardDescriptions = cards.map(c => {
      // orientation이 reversed면 "(역방향)" 붙이고, 아니면 "(정위치)" 붙이기
      const orientText = c.orientation === "reversed" ? " (역방향)" : " (정위치)";
      // ex: "Fool (역방향)"
      return `${c.name_en}${orientText}`;
    });

    // *2) 한글 이름에도 동일하게 표기해 줍니다 (선택사항)
    const cardDescriptionsKr = cards.map(c => {
      const orientText = c.orientation === "reversed" ? " (역방향)" : " (정위치)";
      return `${c.name_kr}${orientText}`;
    });

    // ChatGPT 프롬프트 구성
    const systemPrompt = "당신은 전문 타로 리더입니다. 세 개의 타로 카드 이름(정위치 또는 역위치 포함)을 바탕으로 사용자의 오늘 운세를 상세히 한국어로 해석해 주세요.";

    // 예시 프롬프트: "오늘 뽑힌 카드는 다음과 같습니다: 영문: Fool (역방향), Magician (정위치), High Priestess (역방향). 한글: 광대 (역방향), 마술사 (정위치), 여교황 (역방향)."
    const userPrompt =
      `오늘 뽑힌 세 장의 타로 카드는 다음과 같습니다:\n` +
      `영문: ${cardDescriptions.join(", ")}\n` +
      `한글: ${cardDescriptionsKr.join(", ")}\n\n` +
      `이 세 카드가 정위치인지 역위치인지를 고려하여 각각의 의미를 설명하고, ` +
      `연애/금전/건강/업무 등 전반적인 오늘 운세를 3~5문단 분량의 한국어로 알려주세요.`;

    // ChatGPT API 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 700,
      temperature: 0.8
    });

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

// 서버 실행
app.listen(PORT, () => {
  console.log(`✅ Backend 서버가 실행 중입니다 → http://localhost:${PORT}`);
});

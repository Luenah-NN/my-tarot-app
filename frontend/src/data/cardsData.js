// frontend/src/data/cardsData.js

/**
 * Major Arcana 전체 22장 카드 정보 목록
 * - name_en: 백엔드에 보낼 때 사용할 영어 카드 이름
 * - name_kr: 백엔드에도 보여줄 때 사용할 한국어 카드 이름
 * - filename: public/cards/ 폴더 안의 이미지 파일명 ("/cards/파일명"으로 불러옴)
 *
 * ※ public/cards/ 폴더에 실제로 다음 파일들이 있어야 합니다.
 *    TheFool.jpg, TheMagician.jpg, TheHighPriestess.jpg, TheEmpress.jpg, TheEmperor.jpg,
 *    TheHierophant.jpg, TheLovers.jpg, TheChariot.jpg, Strength.jpg, TheHermit.jpg,
 *    WheelOfFortune.jpg, Justice.jpg, TheHangedMan.jpg, Death.jpg, Temperance.jpg,
 *    TheDevil.jpg, TheTower.jpg, TheStar.jpg, TheMoon.jpg, TheSun.jpg, Judgement.jpg, TheWorld.jpg
 */
const cardsData = [
  {
    name_en: "The Fool",
    name_kr: "바보",
    filename: "TheFool.jpg"
  },
  {
    name_en: "The Magician",
    name_kr: "마법사",
    filename: "TheMagician.jpg"
  },
  {
    name_en: "The High Priestess",
    name_kr: "여사제",
    filename: "TheHighPriestess.jpg"
  },
  {
    name_en: "The Empress",
    name_kr: "황후",
    filename: "TheEmpress.jpg"
  },
  {
    name_en: "The Emperor",
    name_kr: "황제",
    filename: "TheEmperor.jpg"
  },
  {
    name_en: "The Hierophant",
    name_kr: "교황",
    filename: "TheHierophant.jpg"
  },
  {
    name_en: "The Lovers",
    name_kr: "연인",
    filename: "TheLovers.jpg"
  },
  {
    name_en: "The Chariot",
    name_kr: "전차",
    filename: "TheChariot.jpg"
  },
  {
    name_en: "Strength",
    name_kr: "힘",
    filename: "Strength.jpg"
  },
  {
    name_en: "The Hermit",
    name_kr: "은둔자",
    filename: "TheHermit.jpg"
  },
  {
    name_en: "Wheel of Fortune",
    name_kr: "운명의 수레바퀴",
    filename: "WheelOfFortune.jpg"
  },
  {
    name_en: "Justice",
    name_kr: "정의",
    filename: "Justice.jpg"
  },
  {
    name_en: "The Hanged Man",
    name_kr: "매달린 사람",
    filename: "TheHangedMan.jpg"
  },
  {
    name_en: "Death",
    name_kr: "죽음",
    filename: "Death.jpg"
  },
  {
    name_en: "Temperance",
    name_kr: "절제",
    filename: "Temperance.jpg"
  },
  {
    name_en: "The Devil",
    name_kr: "악마",
    filename: "TheDevil.jpg"
  },
  {
    name_en: "The Tower",
    name_kr: "탑",
    filename: "TheTower.jpg"
  },
  {
    name_en: "The Star",
    name_kr: "별",
    filename: "TheStar.jpg"
  },
  {
    name_en: "The Moon",
    name_kr: "달",
    filename: "TheMoon.jpg"
  },
  {
    name_en: "The Sun",
    name_kr: "태양",
    filename: "TheSun.jpg"
  },
  {
    name_en: "Judgement",
    name_kr: "심판",
    filename: "Judgement.jpg"
  },
  {
    name_en: "The World",
    name_kr: "세계",
    filename: "TheWorld.jpg"
  }
];

export default cardsData;

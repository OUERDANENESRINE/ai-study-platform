"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { generateFlashcards, reviewFlashcard } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

type Card = {
  id: number;
  front: string;
  back: string;
};

export default function FlashcardsPage() {
  const params = useParams();
  const courseId = Number(params.courseId);
  const { t } = useLanguage();

  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadCards = () => {
    setLoading(true);
    setCurrentIndex(0);
    setFlipped(false);
    generateFlashcards(courseId)
      .then((data) => setCards(data.flashcards))
      .catch((err) => {
        console.error("Failed to load flashcards:", err);
        setCards([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!courseId || isNaN(courseId)) return;
    loadCards();
  }, [courseId]);

  const currentCard = cards[currentIndex];
  const isLastCard = currentIndex === cards.length - 1;

  const goNext = () => {
    setFlipped(false);
    setCurrentIndex((i) => Math.min(i + 1, cards.length - 1));
  };

  const goPrevious = () => {
    setFlipped(false);
    setCurrentIndex((i) => Math.max(i - 1, 0));
  };

  const handleDifficulty = async (difficulty: string) => {
    if (!currentCard) return;
    try {
      await reviewFlashcard(currentCard.id, difficulty);
    } catch (err) {
      console.error("Failed to save review:", err);
    }
    if (!isLastCard) goNext();
    else setFlipped(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F4E9F8] flex items-center justify-center">
        <p className="text-gray-600">{t("generatingFlashcards")}</p>
      </main>
    );
  }

  if (!currentCard) {
    return (
      <main className="min-h-screen bg-[#F4E9F8] flex items-center justify-center">
        <p className="text-gray-600">{t("noFlashcards")}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4E9F8] flex justify-center p-6">
      <div className="w-full max-w-xl flex flex-col items-center">
        <span className="text-sm font-medium text-gray-500 mb-6">
          {t("flashcards")}
        </span>

        <div
          onClick={() => setFlipped((f) => !f)}
          className="w-full max-w-sm h-64 cursor-pointer"
          style={{ perspective: "1000px" }}
        >
          <div
            className="relative w-full h-full transition-transform duration-500"
            style={{
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            <div
              className="absolute inset-0 bg-[#B15FCB] rounded-2xl flex items-center justify-center p-6 text-white text-center font-semibold"
              style={{ backfaceVisibility: "hidden" }}
            >
              {currentCard.front}
            </div>
            <div
              className="absolute inset-0 bg-white border-2 border-[#B15FCB] rounded-2xl flex items-center justify-center p-6 text-gray-800 text-center"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              {currentCard.back}
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-3">{t("clickToFlip")}</p>

        {flipped && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => handleDifficulty("difficult")}
              className="bg-white rounded-full px-4 py-2 text-sm shadow-sm"
            >
              😕 {t("difficultBtn")}
            </button>
            <button
              onClick={() => handleDifficulty("good")}
              className="bg-white rounded-full px-4 py-2 text-sm shadow-sm"
            >
              🙂 {t("goodBtn")}
            </button>
            <button
              onClick={() => handleDifficulty("easy")}
              className="bg-white rounded-full px-4 py-2 text-sm shadow-sm"
            >
              😎 {t("easyBtn")}
            </button>
          </div>
        )}

        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={goPrevious}
            disabled={currentIndex === 0}
            className="text-sm text-gray-500 disabled:opacity-30"
          >
            ← {t("previousBtn")}
          </button>
          <span className="text-sm text-gray-500">
            {currentIndex + 1} / {cards.length}
          </span>
          <button
            onClick={goNext}
            disabled={isLastCard}
            className="text-sm text-gray-500 disabled:opacity-30"
          >
            {t("nextBtn")} →
          </button>
        </div>

        {isLastCard && (
          <button
            onClick={loadCards}
            className="mt-8 bg-[#B15FCB] text-white rounded-full px-6 py-3 text-sm font-medium"
          >
            {t("generateNewFlashcards")}
          </button>
        )}
      </div>
    </main>
  );
}
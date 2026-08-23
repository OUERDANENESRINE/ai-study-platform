"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { generateFlashcards, reviewFlashcard } from "@/lib/api";

type Card = {
  id: number;
  front: string;
  back: string;
};

export default function FlashcardsPage() {
  const params = useParams();
  const courseId = Number(params.courseId);

  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateFlashcards(courseId)
      .then((data) => setCards(data.flashcards))
      .finally(() => setLoading(false));
  }, [courseId]);

  const currentCard = cards[currentIndex];

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
    await reviewFlashcard(currentCard.id, difficulty);
    goNext();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F4E9F8] flex items-center justify-center">
        <p className="text-gray-600">Génération des flashcards...</p>
      </main>
    );
  }

  if (!currentCard) {
    return (
      <main className="min-h-screen bg-[#F4E9F8] flex items-center justify-center">
        <p className="text-gray-600">Aucune flashcard disponible.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4E9F8] flex justify-center p-6">
      <div className="w-full max-w-xl flex flex-col items-center">
        {/* Navbar */}
        <div className="flex items-center justify-between w-full mb-10">
          <span className="text-sm font-medium text-gray-500">Flashcards</span>
          <div className="bg-white rounded-full px-5 py-2 shadow-sm">
            <span className="text-sm font-semibold text-gray-800">
              My Course AI
            </span>
          </div>
          <button className="bg-white rounded-full px-4 py-2 shadow-sm text-sm text-gray-600">
            Fr ▾
          </button>
        </div>

        {/* Carte flip */}
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
            {/* Recto */}
            <div
              className="absolute inset-0 bg-[#B15FCB] rounded-2xl flex items-center justify-center p-6 text-white text-center font-semibold"
              style={{ backfaceVisibility: "hidden" }}
            >
              {currentCard.front}
            </div>
            {/* Verso */}
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

        <p className="text-xs text-gray-400 mt-3">Click to flip</p>

        {/* Boutons difficulté (visibles seulement une fois retournée) */}
        {flipped && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => handleDifficulty("difficult")}
              className="bg-white rounded-full px-4 py-2 text-sm shadow-sm"
            >
               Difficult
            </button>
            <button
              onClick={() => handleDifficulty("good")}
              className="bg-white rounded-full px-4 py-2 text-sm shadow-sm"
            >
               Good
            </button>
            <button
              onClick={() => handleDifficulty("easy")}
              className="bg-white rounded-full px-4 py-2 text-sm shadow-sm"
            >
               Easy
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={goPrevious}
            disabled={currentIndex === 0}
            className="text-sm text-gray-500 disabled:opacity-30"
          >
            ← Previous
          </button>
          <span className="text-sm text-gray-500">
            {currentIndex + 1} / {cards.length}
          </span>
          <button
            onClick={goNext}
            disabled={currentIndex === cards.length - 1}
            className="text-sm text-gray-500 disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      </div>
    </main>
  );
}
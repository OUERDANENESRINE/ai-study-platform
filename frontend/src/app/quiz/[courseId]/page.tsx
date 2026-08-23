"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { generateQuiz, submitQuiz } from "@/lib/api";

type Question = {
  id: number;
  question: string;
  options: string[];
};

export default function QuizPage() {
  const params = useParams();
  const courseId = Number(params.courseId);

  const [quizId, setQuizId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    generateQuiz(courseId)
      .then((data) => {
        setQuizId(data.quiz_id);
        setQuestions(data.questions);
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  const currentQuestion = questions[currentIndex];

  const handleSelect = (option: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }));
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      return;
    }

    // Dernière question → soumettre le quiz
    if (!quizId) return;
    setSubmitting(true);
    const formattedAnswers = Object.entries(answers).map(
      ([question_id, selected_option]) => ({
        question_id: Number(question_id),
        selected_option,
      })
    );
    const data = await submitQuiz(quizId, formattedAnswers);
    setResult(data);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F4E9F8] flex items-center justify-center">
        <p className="text-gray-600">Génération du quiz...</p>
      </main>
    );
  }

  if (result) {
    const percentage = Math.round((result.score / result.total) * 100);
    return (
      <main className="min-h-screen bg-[#F4E9F8] flex justify-center p-6">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-800 mb-2">
              🎉 Ton résultat
            </p>
            <p className="text-3xl font-bold text-[#B15FCB] mb-6">
              {result.score} / {result.total} — {percentage}%
            </p>
            {result.weak_topics.length > 0 && (
              <div className="text-left bg-[#EAD4F0] rounded-xl p-4">
                <p className="font-semibold text-gray-700 mb-2">
                  Tu devrais revoir :
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {result.weak_topics.map((topic: string) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4E9F8] flex justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Navbar */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-sm font-medium text-gray-500">QCM</span>
          <div className="bg-white rounded-full px-5 py-2 shadow-sm">
            <span className="text-sm font-semibold text-gray-800">
              My Course AI
            </span>
          </div>
          <button className="bg-white rounded-full px-4 py-2 shadow-sm text-sm text-gray-600">
            Fr ▾
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-3">
          Question {currentIndex + 1} / {questions.length}
        </p>

        {/* Question */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="font-semibold text-gray-800 mb-4">
            {currentQuestion.question}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentQuestion.id] === option;
              return (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`text-left px-4 py-3 rounded-xl text-sm transition-colors ${
                    isSelected
                      ? "bg-[#B15FCB] text-white"
                      : "bg-[#F4E9F8] text-gray-700 hover:bg-[#EAD4F0]"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bouton suivant */}
        <button
          onClick={handleNext}
          disabled={!answers[currentQuestion.id] || submitting}
          className="mt-4 w-full bg-[#B15FCB] text-white rounded-full py-3 text-sm font-medium disabled:opacity-40"
        >
          {submitting
            ? "Correction..."
            : currentIndex < questions.length - 1
            ? "Suivant →"
            : "Terminer le quiz"}
        </button>
      </div>
    </main>
  );
}
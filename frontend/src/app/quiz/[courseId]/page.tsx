"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { generateQuiz, submitQuiz } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

type Question = {
  id: number;
  question: string;
  options: string[];
};

export default function QuizPage() {
  const params = useParams();
  const courseId = Number(params.courseId);
  const { t } = useLanguage();

  const [quizId, setQuizId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadQuiz = () => {
    setLoading(true);
    setResult(null);
    setAnswers({});
    generateQuiz(courseId)
      .then((data) => {
        setQuizId(data.quiz_id);
        setQuestions(data.questions);
      })
      .catch((err) => {
        console.error("Failed to load quiz:", err);
        setQuestions([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!courseId || isNaN(courseId)) return;
    loadQuiz();
  }, [courseId]);

  const handleSelect = (questionId: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    if (!quizId) return;
    setSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(
        ([question_id, selected_option]) => ({
          question_id: Number(question_id),
          selected_option,
        })
      );
      const data = await submitQuiz(quizId, formattedAnswers);
      setResult(data);
    } catch (err) {
      console.error("Failed to submit quiz:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const allAnswered = questions.length > 0 && questions.every((q) => answers[q.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F4E9F8] flex items-center justify-center">
        <p className="text-gray-600">{t("generatingQuiz")}</p>
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
              {t("yourResult")}
            </p>
            <p className="text-3xl font-bold text-[#B15FCB] mb-6">
              {result.score} / {result.total} — {percentage}%
            </p>
            {result.weak_topics.length > 0 && (
              <div className="text-left bg-[#EAD4F0] rounded-xl p-4 mb-6">
                <p className="font-semibold text-gray-700 mb-2">
                  {t("youShouldReview")}
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {result.weak_topics.map((topic: string) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
              </div>
            )}
            <button
              onClick={loadQuiz}
              className="bg-[#B15FCB] text-white rounded-full px-6 py-3 text-sm font-medium"
            >
              {t("generateNewQuestions")}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4E9F8] flex justify-center p-6">
      <div className="w-full max-w-2xl pb-24">
        <span className="text-sm font-medium text-gray-500 block mb-4">
          {t("quiz")} — {questions.length} questions
        </span>

        <div className="flex flex-col gap-4">
          {questions.map((q, index) => (
            <div key={q.id} className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="font-semibold text-gray-800 mb-4">
                Q{index + 1}: {q.question}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {q.options.map((option) => {
                  const isSelected = answers[q.id] === option;
                  return (
                    <button
                      key={option}
                      onClick={() => handleSelect(q.id, option)}
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
          ))}
        </div>

        <div className="fixed bottom-6 left-0 right-0 flex justify-center px-6">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            className="bg-[#B15FCB] text-white rounded-full px-8 py-3 text-sm font-medium shadow-lg disabled:opacity-40"
          >
            {submitting
              ? t("submitting")
              : allAnswered
              ? t("submitQuizBtn")
              : `${t("answerAllQuestions")} (${Object.keys(answers).length}/${questions.length})`}
          </button>
        </div>
      </div>
    </main>
  );
}
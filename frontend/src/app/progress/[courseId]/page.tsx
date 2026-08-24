"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProgress, getRecommendation } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

type ProgressData = {
  overall_progress: number;
  quiz_score_percent: number | null;
  flashcard_score_percent: number | null;
  weak_topics: string[];
};

function ProgressBar({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>{label}</span>
        <span>{value !== null ? `${value}%` : "—"}</span>
      </div>
      <div className="w-full h-2 bg-white rounded-full overflow-hidden">
        <div
          className="h-full bg-[#B15FCB] rounded-full transition-all"
          style={{ width: `${value ?? 0}%` }}
        />
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const params = useParams();
  const courseId = Number(params.courseId);
  const { t } = useLanguage();

  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId || isNaN(courseId)) return;

    setLoading(true);
    Promise.all([getProgress(courseId), getRecommendation(courseId)])
      .then(([progressData, recData]) => {
        setProgress(progressData);
        setRecommendation(recData.recommendation);
      })
      .catch((err) => {
        console.error("Failed to load progress:", err);
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading || !progress) {
    return (
      <main className="min-h-screen bg-[#F4E9F8] flex items-center justify-center">
        <p className="text-gray-600">{t("loadingProgress")}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4E9F8] flex justify-center p-6">
      <div className="w-full max-w-3xl">
        <div className="bg-[#EAD4F0] rounded-2xl p-6 mb-6">
          <p className="text-sm text-gray-600 mb-1">{t("overallProgress")}</p>
          <p className="text-3xl font-bold text-[#B15FCB]">
            {progress.overall_progress}%
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <ProgressBar label={t("quiz")} value={progress.quiz_score_percent} />
          <ProgressBar label={t("flashcards")} value={progress.flashcard_score_percent} />
        </div>

        {progress.weak_topics.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <p className="font-semibold text-gray-700 mb-3">{t("needsReview")}</p>
            <div className="flex flex-wrap gap-2">
              {progress.weak_topics.map((topic) => (
                <span
                  key={topic}
                  className="bg-[#F4E9F8] text-gray-700 text-sm px-3 py-1 rounded-full"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {recommendation && (
          <div className="bg-[#EAD4F0] rounded-2xl p-6">
            <p className="font-semibold text-gray-700 mb-2">
              🧠 {t("aiRecommendation")}
            </p>
            <p className="text-sm text-gray-700">{recommendation}</p>
          </div>
        )}
      </div>
    </main>
  );
}
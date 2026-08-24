"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProgress, getRecommendation } from "@/lib/api";

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

  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProgress(courseId), getRecommendation(courseId)])
      .then(([progressData, recData]) => {
        setProgress(progressData);
        setRecommendation(recData.recommendation);
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading || !progress) {
    return (
      <main className="min-h-screen bg-[#F4E9F8] flex items-center justify-center">
        <p className="text-gray-600">Chargement de ta progression...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4E9F8] flex justify-center p-6">
      <div className="w-full max-w-2xl">
       

        {/* Progression globale */}
        <div className="bg-[#EAD4F0] rounded-2xl p-6 mb-6">
          <p className="text-sm text-gray-600 mb-1">Overall progress</p>
          <p className="text-3xl font-bold text-[#B15FCB]">
            {progress.overall_progress}%
          </p>
        </div>

        {/* Barres détaillées */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <ProgressBar label="Quiz" value={progress.quiz_score_percent} />
          <ProgressBar label="Flashcards" value={progress.flashcard_score_percent} />
        </div>

        {/* Sujets à revoir */}
        {progress.weak_topics.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <p className="font-semibold text-gray-700 mb-3">Needs review</p>
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

        {/* Recommandation IA */}
        {recommendation && (
          <div className="bg-[#EAD4F0] rounded-2xl p-6">
            <p className="font-semibold text-gray-700 mb-2">
              🧠 AI Study Recommendation
            </p>
            <p className="text-sm text-gray-700">{recommendation}</p>
          </div>
        )}
      </div>
    </main>
  );
}
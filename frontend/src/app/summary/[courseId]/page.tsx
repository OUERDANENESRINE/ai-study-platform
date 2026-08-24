"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSummary } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import { useLanguage } from "@/context/LanguageContext";

export default function SummaryPage() {
  const params = useParams();
  const courseId = Number(params.courseId);
  const { t } = useLanguage();

  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState("medium");

  useEffect(() => {
    setLoading(true);
    getSummary(courseId, level)
      .then((data) => setSummary(data.summary))
      .finally(() => setLoading(false));
  }, [courseId, level]);

  const handleDownload = () => {
    if (!summary) return;
    const blob = new Blob([summary], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `summary-${level}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const levels = [
    { key: "short", label: t("levelShort") },
    { key: "medium", label: t("levelMedium") },
    { key: "detailed", label: t("levelDetailed") },
  ];

  return (
    <main className="min-h-screen bg-[#F4E9F8] flex justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Niveau de détail + téléchargement */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {levels.map((l) => (
              <button
                key={l.key}
                onClick={() => setLevel(l.key)}
                className={`px-4 py-2 rounded-full text-sm capitalize ${
                  level === l.key
                    ? "bg-[#B15FCB] text-white"
                    : "bg-white text-gray-600"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {summary && !loading && (
            <button
              onClick={handleDownload}
              className="bg-white rounded-full px-4 py-2 shadow-sm text-sm text-gray-600 hover:bg-[#EAD4F0]"
            >
              {t("downloadSummary")}
            </button>
          )}
        </div>

        {/* Contenu */}
        <div className="bg-[#EAD4F0] rounded-2xl p-6 max-h-[500px] overflow-y-auto">
          {loading ? (
            <p className="text-gray-600">{t("generatingSummary")}</p>
          ) : (
            <div className="prose prose-sm max-w-none text-gray-800">
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
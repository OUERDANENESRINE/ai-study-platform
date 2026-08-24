"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSummary } from "@/lib/api";
import ReactMarkdown from "react-markdown";

export default function SummaryPage() {
  const params = useParams();
  const courseId = Number(params.courseId);

  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState("medium");

  useEffect(() => {
    setLoading(true);
    getSummary(courseId, level)
      .then((data) => setSummary(data.summary))
      .finally(() => setLoading(false));
  }, [courseId, level]);

  return (
    <main className="min-h-screen bg-[#F4E9F8] flex justify-center p-6">
      <div className="w-full max-w-3xl">
       
       

        {/* Niveau de détail */}
        <div className="flex gap-2 mb-4">
          {["short", "medium", "detailed"].map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`px-4 py-2 rounded-full text-sm ${
                level === l
                  ? "bg-[#B15FCB] text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Contenu */}
        <div className="bg-[#EAD4F0] rounded-2xl p-6 max-h-[500px] overflow-y-auto">
          {loading ? (
            <p className="text-gray-600">Génération du résumé...</p>
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
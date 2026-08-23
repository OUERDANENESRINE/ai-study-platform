"use client";

import { useState } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { uploadCourse } from "@/lib/api";

type CourseInfo = {
  filename: string;
  num_pages: number;
  word_count: number;
};

export default function UploadCourse() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [course, setCourse] = useState<CourseInfo | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const data = await uploadCourse(file);
      setCourse(data);
    } catch (err) {
      setError("Échec de l'upload. Réessaie.");
    } finally {
      setLoading(false);
    }
  };

  if (course) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <p className="font-semibold text-gray-800">{course.filename}</p>
        <p className="text-sm text-gray-600 mt-1">
          {course.num_pages} pages · {course.word_count} mots
        </p>
        <p className="text-sm text-[#B15FCB] font-medium mt-2"> Ready to study</p>
      </div>
    );
  }

  return (
    <label className="bg-white rounded-2xl p-5 shadow-sm flex flex-col items-center gap-1 cursor-pointer border-2 border-dashed border-[#EAD4F0] hover:border-[#B15FCB] transition-colors">
      {loading ? (
        <Loader2 className="w-8 h-8 text-[#B15FCB] animate-spin" />
      ) : (
        <FileUp className="w-8 h-8 text-[#B15FCB]" />
      )}
      <span className="text-sm text-gray-600">
        {loading ? "Analyse en cours..." : "Upload your course (PDF)"}
      </span>
      <input
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFileChange}
        disabled={loading}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </label>
  );
}
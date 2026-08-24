"use client";

import { FileText, Sparkles, MessagesSquare, BookOpen, ScrollText, Layers } from "lucide-react";
import UploadCourse from "@/components/UploadCourse";
import Link from "next/link";
import { useCourse } from "@/context/CourseContext";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { course } = useCourse();
  const { t } = useLanguage();

  const steps = [
    { icon: FileText, label: t("uploadPrompt") },
    { icon: Sparkles, label: t("generatingSummary") },
    { icon: BookOpen, label: t("progress") },
  ];

  const features = [
    {
      key: "qa",
      icon: MessagesSquare,
      title: t("qa"),
      subtitle: t("qaAskTitle"),
    },
    {
      key: "resume",
      icon: ScrollText,
      title: t("resume"),
      subtitle: t("resumeTitle"),
    },
    {
      key: "quiz",
      icon: Sparkles,
      title: t("quiz"),
      subtitle: t("quizTitle"),
    },
    {
      key: "flashcards",
      icon: Layers,
      title: t("flashcards"),
      subtitle: t("flashcardsTitle"),
    },
  ];

  return (
    <main className="min-h-screen bg-[#F4E9F8] flex justify-center p-6">
      <div className="w-full max-w-6xl">
        {/* Stepper */}
        <div className="flex items-start justify-between mb-10 px-4 max-w-2xl mx-auto">
  {steps.map((step, i) => (
    <div key={step.label} className="flex items-center flex-1">
      <div className="flex flex-col items-center gap-2 flex-1 text-center">
        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
          <step.icon className="w-5 h-5 text-[#B15FCB]" />
        </div>
        <span className="text-xs text-gray-500 text-center max-w-[110px] mx-auto">
          {step.label}
        </span>
      </div>
      {i < steps.length - 1 && (
        <div className="h-px bg-gray-300 flex-1 -mt-6 shrink-0" />
      )}
    </div>
  ))}
</div>

        {/* Hero card */}
        <div className="bg-[#EAD4F0] rounded-2xl p-6 flex items-center justify-between mb-6">
          <div>
            <p className="font-semibold text-gray-800 mb-1">{t("heroTitle")}</p>
            <p className="text-sm text-gray-600">{t("heroSubtitle")}</p>
          </div>
          <UploadCourse />
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 gap-4">
          {features.map((f) => (
            <Link
              key={f.key}
              href={
                course
                  ? f.key === "resume"
                    ? `/summary/${course.id}`
                    : f.key === "qa"
                    ? `/qa/${course.id}`
                    : f.key === "quiz"
                    ? `/quiz/${course.id}`
                    : f.key === "flashcards"
                    ? `/flashcards/${course.id}`
                    : "#"
                  : "#"
              }
              className="bg-white rounded-2xl p-5 shadow-sm flex items-start gap-3 hover:shadow-md transition-shadow text-left"
            >
              <f.icon className="w-5 h-5 text-[#B15FCB] mt-1" />
              <div>
                <p className="font-semibold text-gray-800">{f.title}</p>
                <p className="text-sm text-gray-500">{f.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
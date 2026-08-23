"use client";

import { FileText, Sparkles, MessagesSquare, BookOpen, ScrollText, Layers } from "lucide-react";
import UploadCourse from "@/components/UploadCourse";
import Link from "next/link";

const steps = [
  { icon: FileText, label: "Importez votre PDF" },
  { icon: Sparkles, label: "L'IA génère le résumé" },
  { icon: BookOpen, label: "Étudiez et suivez votre progression" },
];

const features = [
  {
    icon: MessagesSquare,
    title: "Q&A",
    subtitle: "Ask anything about your course",
  },
  {
    icon: ScrollText,
    title: "A resume",
    subtitle: "Understand the key concepts",
  },
  {
    icon: Sparkles,
    title: "Quiz (QCM)",
    subtitle: "Test your knowledge",
  },
  {
    icon: Layers,
    title: "Flashcards",
    subtitle: "Memorize faster",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F4E9F8] flex justify-center p-6">
      <div className="w-full max-w-3xl">
        {/* Navbar */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-sm font-medium text-gray-500">Home</span>
          <div className="bg-white rounded-full px-5 py-2 shadow-sm">
            <span className="text-sm font-semibold text-gray-800">
              My Course AI
            </span>
          </div>
          <button className="bg-white rounded-full px-4 py-2 shadow-sm text-sm text-gray-600">
            Fr ▾
          </button>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-10 px-4">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-[#B15FCB]" />
                </div>
                <span className="text-xs text-gray-500 text-center max-w-[100px]">
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="h-px bg-gray-300 flex-1 -mt-6" />
              )}
            </div>
          ))}
        </div>

        {/* Upload */}


        {/* Hero card */}
        <div className="bg-[#EAD4F0] rounded-2xl p-6 flex items-center justify-between mb-6">
          <div>
            <p className="font-semibold text-gray-800 mb-1">
              Quick and easy PDF summarization: Understand any content in
              seconds
            </p>
            <p className="text-sm text-gray-600">
              Our AI PDF summarizer provides clear summaries, Q&A, Quiz
              (QCM), Flashcards and Progression Dashboards
            </p>
          </div>
          <UploadCourse />
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 gap-4">
          {features.map((f) => (
           <Link
  key={f.title}
  href={
  f.title === "A resume"
    ? "/summary/3"
    : f.title === "Q&A"
    ? "/qa/3"
    : f.title === "Quiz (QCM)"
    ? "/quiz/3"
    : f.title === "Flashcards"
    ? "/flashcards/3"
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
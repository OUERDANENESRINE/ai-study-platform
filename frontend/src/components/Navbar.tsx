"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCourse } from "@/context/CourseContext";
import { useLanguage } from "@/context/LanguageContext";

const navItems = [
  { key: "home" as const, path: "/" },
  { key: "qa" as const, path: "/qa" },
  { key: "resume" as const, path: "/summary" },
  { key: "quiz" as const, path: "/quiz" },
  { key: "flashcards" as const, path: "/flashcards" },
  { key: "progress" as const, path: "/progress" },
];

export default function Navbar() {
  const { course } = useCourse();
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "fr" : "en");
  };

  return (
    <div className="flex justify-center bg-[#F4E9F8] pt-6 px-4">
      <div className="bg-white rounded-full shadow-sm px-3 py-2 flex items-center gap-2 max-w-full overflow-x-auto">
        {/* Liens de navigation */}
        {course ? (
          navItems.map((item) => {
            const href = item.path === "/" ? "/" : `${item.path}/${course.id}`;
            const isActive =
              item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                href={href}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-[#B15FCB] text-white"
                    : "text-gray-600 hover:bg-[#F4E9F8]"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })
        ) : (
          <span className="px-3 text-sm font-medium text-gray-500">
            {t("home")}
          </span>
        )}

        {/* Séparateur */}
        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* My Course AI */}
        <span className="px-3 text-sm font-semibold text-gray-800 whitespace-nowrap">
          My Course AI
        </span>

        {/* Séparateur */}
        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Langue */}
        <button
          onClick={toggleLanguage}
          className="px-3 py-1.5 rounded-full text-xs text-gray-600 hover:bg-[#F4E9F8] whitespace-nowrap"
        >
          {language === "en" ? "EN" : "FR"} ▾
        </button>
      </div>
    </div>
  );
}
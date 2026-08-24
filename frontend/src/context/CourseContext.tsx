"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type CourseInfo = {
  id: number;
  filename: string;
  num_pages: number;
  word_count: number;
} | null;

type CourseContextType = {
  course: CourseInfo;
  setCourse: (course: CourseInfo) => void;
};

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: ReactNode }) {
  const [course, setCourseState] = useState<CourseInfo>(null);

  useEffect(() => {
    const stored = localStorage.getItem("activeCourse");
    if (stored) setCourseState(JSON.parse(stored));
  }, []);

  const setCourse = (newCourse: CourseInfo) => {
    setCourseState(newCourse);
    if (newCourse) {
      localStorage.setItem("activeCourse", JSON.stringify(newCourse));
    } else {
      localStorage.removeItem("activeCourse");
    }
  };

  return (
    <CourseContext.Provider value={{ course, setCourse }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  const context = useContext(CourseContext);
  if (!context) throw new Error("useCourse must be used within CourseProvider");
  return context;
}
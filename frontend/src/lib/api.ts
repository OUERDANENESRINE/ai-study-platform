export async function checkHealth() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`);
  if (!res.ok) throw new Error("Backend not reachable");
  return res.json();
}
export async function uploadCourse(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}


export async function getSummary(courseId: number, level: string = "medium") {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/summary?level=${level}`
  );
  if (!res.ok) throw new Error("Failed to generate summary");
  return res.json();
}

export async function askQuestion(courseId: number, question: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/ask`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    }
  );
  if (!res.ok) throw new Error("Failed to get answer");
  return res.json();
}

export async function generateQuiz(courseId: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/quiz/generate`,
    { method: "POST" }
  );
  if (!res.ok) throw new Error("Failed to generate quiz");
  return res.json();
}

export async function submitQuiz(
  quizId: number,
  answers: { question_id: number; selected_option: string }[]
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/quiz/${quizId}/submit`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    }
  );
  if (!res.ok) throw new Error("Failed to submit quiz");
  return res.json();
}

export async function generateFlashcards(courseId: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/flashcards/course/${courseId}/generate`,
    { method: "POST" }
  );
  if (!res.ok) throw new Error("Failed to generate flashcards");
  return res.json();
}

export async function reviewFlashcard(flashcardId: number, difficulty: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/flashcards/${flashcardId}/review`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ difficulty }),
    }
  );
  if (!res.ok) throw new Error("Failed to save review");
  return res.json();
}

export async function getProgress(courseId: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/progress/course/${courseId}`
  );
  if (!res.ok) throw new Error("Failed to fetch progress");
  return res.json();
}

export async function getRecommendation(courseId: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/progress/course/${courseId}/recommendation`
  );
  if (!res.ok) throw new Error("Failed to fetch recommendation");
  return res.json();
}
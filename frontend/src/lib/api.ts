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
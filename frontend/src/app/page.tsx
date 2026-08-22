"use client";

import { useEffect, useState } from "react";
import { checkHealth } from "@/lib/api";

export default function Home() {
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    checkHealth()
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("Backend unreachable"));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold">AI Study Platform</h1>
      <p className="mt-4">Backend status: {status}</p>
    </main>
  );
}
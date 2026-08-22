export async function checkHealth() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`);
  if (!res.ok) throw new Error("Backend not reachable");
  return res.json();
}
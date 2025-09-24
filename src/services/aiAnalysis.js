// src/services/aiAnalysis.js

export async function generateAnalysis(scores) {
  const prompt = `
You are a clinical AI assistant.

The following percentages come from a single patient's self-reported screening questionnaire. 
Each percentage represents how strongly this individual’s answers align with the traits of that disorder.

Scores:
${Object.values(scores)
  .map((s) => `${s.name}: ${s.percent}% (${s.raw}/${s.max})`)
  .join("\n")}

⚠️ IMPORTANT: Return valid JSON ONLY with this exact structure:
{
  "summary": [
    "Point 1 in empathetic, supportive tone",
    "Point 2...",
    "Point 3..."
  ],
  "most_concerning": [
    {"condition": "ADHD", "percent": 73, "reason": "Short explanation"}
  ],
  "less_concerning": [
    {"condition": "Dementia", "percent": 12, "reason": "Short explanation"}
  ],
  "advice": [
    "Lifestyle / coping suggestion 1",
    "Lifestyle / coping suggestion 2",
    "Reminder it's a screening only, not a diagnosis"
  ]
}

Rules:
- The "summary" must be an ARRAY of 2–4 short paragraphs (each as a string).
- "most_concerning" and "less_concerning" must be arrays with clear explanations.
- "advice" must be 3–6 bullet-style suggestions.
- JSON only. No text outside JSON.
`;

  try {
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral",   // or the model you pulled
        prompt,
        stream: false,
        options: { num_predict: 500, temperature: 0.7 },
      }),
    });

    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();

    // Ollama response usually comes as { response: "..." }
    const raw = data.response?.trim();
    if (!raw) return { error: "No response from AI" };

    // Try to parse JSON
    try {
      const parsed = JSON.parse(raw);
      return parsed;
    } catch (e) {
      console.warn("AI did not return valid JSON:", raw);
      return { error: "AI returned invalid JSON", raw };
    }
  } catch (err) {
    console.error("AI analysis failed:", err);
    return { error: "AI analysis could not be generated." };
  }
}

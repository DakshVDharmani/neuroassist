import React, { useState, useMemo } from "react";
import { QUESTIONS, DISORDER_MAP } from "../../lib/questions";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../services/supabase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { generateAnalysis } from "../../services/aiAnalysis";


const LABELS = [
  { value: 0, label: "Never" },
  { value: 1, label: "Rarely" },
  { value: 2, label: "Often" },
  { value: 3, label: "Very often" },
];

const Assessment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [answers, setAnswers] = useState(() =>
    Array(QUESTIONS.length).fill(null)
  );
  const [saving, setSaving] = useState(false);

  const unansweredCount = useMemo(
    () => answers.filter((a) => a === null).length,
    [answers]
  );

  const setAnswer = (idx, value) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  };

  // compute scores
  const computeScores = (answersArr) => {
    const scores = {};
    for (const [id, def] of Object.entries(DISORDER_MAP)) {
      const qIdxs = def.questions;
      let raw = 0;
      let max = qIdxs.length * 3;
      for (const qi of qIdxs) {
        const v = answersArr[qi];
        raw += typeof v === "number" ? v : 0;
      }
      const percent = Math.round((raw / max) * 10000) / 100;
      scores[id] = { name: def.name, raw, max, percent };
    }
    return scores;
  };

  const handleSave = async () => {
    if (!user?.profile?.id) {
      toast.error("You must be logged in to save.");
      return;
    }
    setSaving(true);
    try {
      const scores = computeScores(answers);

      // Insert assessment
      const { data, error } = await supabase
        .from("assessments")
        .insert([
          {
            user_id: user.profile.id,
            answers: Object.fromEntries(
              answers.map((v, i) => [`q${i + 1}`, v === null ? 0 : v])
            ),
            scores,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success("Saved. Generating AI analysis…");

      // Generate AI analysis
      const ai = await generateAnalysis(scores, answers);

      // Update row with AI analysis
      if (data?.id) {
        await supabase
          .from("assessments")
          .update({ ai_analysis: ai })
          .eq("id", data.id);
      }

      navigate("/assessment/results", { state: { scores, answers, ai } });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Full Screening
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Unanswered: <strong>{unansweredCount}</strong>
        </div>
      </div>

      <div className="grid gap-4">
        {QUESTIONS.map((q, i) => (
          <div key={i} className="card p-4">
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              {i + 1}. {q}
            </div>
            <div className="flex gap-2">
              {LABELS.map((l) => {
                const selected = answers[i] === l.value;
                return (
                  <label
                    key={l.value}
                    className={`px-3 py-1 rounded-lg border cursor-pointer ${
                      selected
                        ? "bg-primary-600 text-white border-primary-600"
                        : "bg-transparent text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q${i}`}
                      checked={selected}
                      onChange={() => setAnswer(i, l.value)}
                      className="hidden"
                    />
                    <div className="text-xs">{l.label}</div>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => {
            setAnswers(Array(QUESTIONS.length).fill(null));
          }}
          className="btn-secondary"
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <span>{saving ? "Saving..." : "Submit & Analyze"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        <strong>Disclaimer:</strong> Screening only — not a clinical diagnosis.
      </div>
    </div>
  );
};

export default Assessment;

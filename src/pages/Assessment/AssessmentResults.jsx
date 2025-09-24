import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../services/supabase";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const severityLabel = (p) => {
  if (p >= 75) return "High likelihood";
  if (p >= 50) return "Moderate likelihood";
  if (p >= 25) return "Mild likelihood";
  return "Low likelihood";
};

const AssessmentResults = () => {
  const { state } = useLocation();
  const { user } = useAuth();
  const [scores, setScores] = useState(state?.scores || null);
  const [answers, setAnswers] = useState(state?.answers || null);
  const [ai, setAi] = useState(state?.ai || null);
  const containerRef = useRef();

  useEffect(() => {
    if (!scores && user?.profile?.id) {
      (async () => {
        try {
          const { data } = await supabase
            .from("assessments")
            .select("*")
            .eq("user_id", user.profile.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();
          if (data) {
            setScores(data.scores);
            setAnswers(data.answers);
            setAi(data.ai_analysis || null);
          }
        } catch (err) {
          console.error(err);
        }
      })();
    }
  }, [scores, user]);

  const handlePrint = async () => {
    if (!containerRef.current) return;
    const canvas = await html2canvas(containerRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("mindbridge-assessment.pdf");
  };

  if (!scores) return <div className="p-6">Loading results…</div>;

  const sorted = Object.entries(scores).sort(
    (a, b) => b[1].percent - a[1].percent
  );

  return (
    <div className="p-6" ref={containerRef}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Assessment Results
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          A screening summary computed from your answers.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="card p-4">
          <h3 className="text-lg font-medium mb-3">Top flags</h3>
          {sorted.slice(0, 6).map(([id, info]) => (
            <div key={id} className="py-2 border-b last:border-b-0">
              <div className="flex justify-between">
                <div className="font-medium text-gray-800 dark:text-gray-200">
                  {info.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {info.percent}%
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {severityLabel(info.percent)}
              </div>
            </div>
          ))}
        </div>

        <div className="card p-4">
          <h3 className="text-lg font-medium mb-3">Detailed Scores</h3>
          {Object.entries(scores).map(([id, info]) => (
            <div key={id} className="py-2">
              <div className="flex justify-between">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {info.name}
                </div>
                <div className="text-sm font-semibold">{info.percent}%</div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                raw {info.raw} / {info.max}
              </div>
            </div>
          ))}
        </div>
      </div>

      {ai && (
        <div className="card p-4 mb-6">
          <h3 className="text-lg font-medium mb-2">AI Analysis</h3>
          <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
            {ai.summary || JSON.stringify(ai, null, 2)}
          </pre>
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={handlePrint} className="btn-primary">
          Print / Export PDF
        </button>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 mt-6">
        <strong>Disclaimer:</strong> Not a medical diagnosis. For clinical
        decisions consult a professional.
      </div>
    </div>
  );
};

export default AssessmentResults;

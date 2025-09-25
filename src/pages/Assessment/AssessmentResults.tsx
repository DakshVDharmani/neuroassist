import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Bot, BrainCircuit, Download } from 'lucide-react';
import { generateAnalysis } from '../../services/aiAnalysis';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const AssessmentResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reportRef = useRef<HTMLDivElement>(null);
  const { scores } = location.state || {};
  
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(true);

  useEffect(() => {
    if (!scores) {
      navigate('/assessment');
      return;
    }
    
    const fetchAnalysis = async () => {
      setLoadingAi(true);
      const analysis = await generateAnalysis(scores);
      setAiAnalysis(analysis);
      setLoadingAi(false);
    };

    fetchAnalysis();
  }, [scores, navigate]);

  if (!scores) {
    return null; // Redirecting in useEffect
  }

  const sortedScores = Object.values(scores).sort((a: any, b: any) => b.percent - a.percent);

  const downloadPdf = () => {
    const input = reportRef.current;
    if (!input) return;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      const width = pdfWidth;
      const height = width / ratio;

      pdf.addImage(imgData, 'PNG', 0, 0, width, height > pdfHeight ? pdfWidth / ratio : height);
      pdf.save('assessment-results.pdf');
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div ref={reportRef} className="p-4 bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Screening Results</h1>
          <p className="text-muted-foreground">This is a screening tool, not a diagnosis. Please consult a healthcare professional.</p>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Your Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={sortedScores} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} unit="%" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} />
                <Bar dataKey="percent">
                  {sortedScores.map((entry: any, index) => (
                    <Cell key={`cell-${index}`} fill={entry.percent > 60 ? 'hsl(var(--destructive))' : entry.percent > 30 ? 'hsl(var(--primary))' : 'hsl(var(--secondary))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot /> AI-Powered Analysis
            </CardTitle>
            <CardDescription>Powered by local AI. This is for informational purposes only.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingAi ? (
              <div className="flex items-center gap-2 text-muted-foreground"><BrainCircuit className="animate-spin" /> Generating analysis...</div>
            ) : aiAnalysis?.error ? (
              <div className="text-destructive flex items-center gap-2"><AlertTriangle /> {aiAnalysis.error}</div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Summary</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {aiAnalysis.summary?.map((item: string, i: number) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Areas of Potential Concern</h3>
                  <div className="space-y-2">
                    {aiAnalysis.most_concerning?.map((item: any, i: number) => (
                      <p key={i} className="text-sm"><strong className="text-destructive">{item.condition} ({item.percent}%):</strong> {item.reason}</p>
                    ))}
                  </div>
                </div>
                 <div>
                  <h3 className="font-semibold mb-2">Next Steps & Advice</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {aiAnalysis.advice?.map((item: string, i: number) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={downloadPdf}><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    </div>
  );
};

export default AssessmentResults;

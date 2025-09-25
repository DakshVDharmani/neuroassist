import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { QUESTIONS, DISORDER_MAP } from '../../lib/questions';
import toast from 'react-hot-toast';

const Assessment = () => {
  const [answers, setAnswers] = useState<number[]>(Array(QUESTIONS.length).fill(-1));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const navigate = useNavigate();

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = parseInt(value, 10);
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (answers[currentQuestionIndex] === -1) {
      toast.error('Please select an answer.');
      return;
    }
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const scores: Record<string, { name: string; raw: number; max: number; percent: number }> = {};
    
    for (const key in DISORDER_MAP) {
      const disorder = DISORDER_MAP[key as keyof typeof DISORDER_MAP];
      const relevantAnswers = disorder.questions.map(qIndex => answers[qIndex]);
      const rawScore = relevantAnswers.reduce((sum, ans) => sum + (ans > 0 ? ans : 0), 0);
      const maxScore = disorder.questions.length * 3; // Assuming max value is 3
      
      scores[key] = {
        name: disorder.name,
        raw: rawScore,
        max: maxScore,
        percent: maxScore > 0 ? Math.round((rawScore / maxScore) * 100) : 0
      };
    }
    
    navigate('/assessment/results', { state: { scores } });
  };

  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;
  const options = [
    { value: 0, label: "Not at all" },
    { value: 1, label: "Several days" },
    { value: 2, label: "More than half the days" },
    { value: 3, label: "Nearly every day" },
  ];

  return (
    <div className="flex items-center justify-center min-h-full">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Mental Wellness Screening</CardTitle>
          <CardDescription>Over the last 2 weeks, how often have you been bothered by the following problems?</CardDescription>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        <CardContent>
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <p className="text-lg font-medium">{currentQuestionIndex + 1}. {QUESTIONS[currentQuestionIndex]}</p>
            <RadioGroup
              value={answers[currentQuestionIndex]?.toString() ?? ""}
              onValueChange={handleAnswer}
              className="space-y-2"
            >
              {options.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value.toString()} id={`q${currentQuestionIndex}-o${option.value}`} />
                  <Label htmlFor={`q${currentQuestionIndex}-o${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </motion.div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={currentQuestionIndex === 0}>Back</Button>
          <Button onClick={handleNext}>
            {currentQuestionIndex === QUESTIONS.length - 1 ? 'Finish & See Results' : 'Next'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Assessment;

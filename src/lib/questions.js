// src/lib/questions.js

// One common pool of questions (keep concise)
export const QUESTIONS = [
  "I have trouble paying attention to details or make careless mistakes.",
  "I have difficulty sustaining attention on tasks or play activities.",
  "I often fidget or feel restless.",
  "I interrupt others or have trouble waiting my turn.",
  "I prefer routines and get upset when they change.",
  "I find social interactions confusing (reading tone/facial expressions).",
  "I have unusual, distressing memories, flashbacks or nightmares.",
  "I avoid reminders of a traumatic event.",
  "I have acted cruelly or aggressively toward others.",
  "I have trouble controlling anger or have frequent temper outbursts.",
  "I experience intense mood swings or emotional instability.",
  "I feel unusually high/energetic for periods of time.",
  "I feel down, depressed, or hopeless; loss of interest in activities.",
  "I have persistent suspiciousness or distrust of others.",
  "I have unusual perceptions (hear/see things others do not).",
  "I have memory problems that interfere with daily life.",
  "I have difficulty planning, organizing, or finishing tasks.",
  "I lie, manipulate, or exploit others for personal gain.",
  "I often need admiration or feel more important than others.",
  "I have been repeatedly disobedient to authority figures.",
  "I deliberately destroy property or behave destructively.",
  "I feel very anxious, shocked or disconnected after a traumatic event.",
  "I have trouble organizing my thoughts or speech.",
  "I have difficulty forming or keeping relationships.",
  "I have sleeping problems linked to mood or stress.",
  "I have strong, rigid, or long-standing beliefs that others intend harm.",
  "I take actions that risk my own safety or others' safety impulsively."
];

// The mapping shows, for each disorder id, which question indexes (0-based) contribute.
// Optional: weights array same length as indexes to tune importance.
export const DISORDER_MAP = {
  adhd: { name: "ADHD", questions: [0,1,2,3,16] },
  asd: { name: "ASD", questions: [4,5,22,23] },
  ptsd: { name: "PTSD", questions: [6,7,21,22] },
  aspd: { name: "ASPD", questions: [8,17,26] },
  bpd: { name: "BPD", questions: [10,11,23] },
  npd: { name: "NPD", questions: [18,17] },
  paranoid_pd: { name: "Paranoid PD", questions: [13,24,25] },
  schizophrenia: { name: "Schizophrenia", questions: [14,22,23] },
  bipolar: { name: "Bipolar", questions: [11,12,24] },
  depression: { name: "Depression", questions: [12,24] },
  odd: { name: "ODD", questions: [19,8,20] },
  conduct: { name: "Conduct Disorder", questions: [20,8,21] },
  acute_stress: { name: "Acute Stress Disorder", questions: [21,6,22] },
  dementia: { name: "Dementia", questions: [15,16,23] }
};

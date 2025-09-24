import { faker } from '@faker-js/faker';

// Mock patient data
export const mockPatients = Array.from({ length: 25 }, (_, index) => ({
  id: `patient-${index + 1}`,
  name: faker.person.fullName(),
  email: faker.internet.email(),
  age: faker.number.int({ min: 18, max: 80 }),
  gender: faker.person.sex(),
  phone: faker.phone.number(),
  avatar: faker.image.avatar(),
  diagnosisStatus: faker.helpers.arrayElement(['pending', 'in-progress', 'completed']),
  riskLevel: faker.helpers.arrayElement(['low', 'medium', 'high']),
  lastActivity: faker.date.recent({ days: 30 }),
  joinedDate: faker.date.past({ years: 2 }),
  sessionsCompleted: faker.number.int({ min: 0, max: 20 }),
  assessmentScore: faker.number.int({ min: 0, max: 100 }),
  notes: faker.lorem.paragraph(),
  conditions: faker.helpers.arrayElements([
    'Anxiety', 'Depression', 'PTSD', 'ADHD', 'Bipolar', 'OCD'
  ], { min: 1, max: 3 })
}));

// Mock assessment data
export const mockAssessments = [
  {
    id: 'phq9',
    title: 'Patient Health Questionnaire (PHQ-9)',
    description: 'Depression screening questionnaire',
    questions: [
      {
        id: 'q1',
        text: 'Little interest or pleasure in doing things',
        type: 'likert',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 'q2',
        text: 'Feeling down, depressed, or hopeless',
        type: 'likert',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 'q3',
        text: 'Trouble falling or staying asleep, or sleeping too much',
        type: 'likert',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      }
    ]
  },
  {
    id: 'gad7',
    title: 'Generalized Anxiety Disorder (GAD-7)',
    description: 'Anxiety screening questionnaire',
    questions: [
      {
        id: 'q1',
        text: 'Feeling nervous, anxious, or on edge',
        type: 'likert',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 'q2',
        text: 'Not being able to stop or control worrying',
        type: 'likert',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      }
    ]
  }
];

// Mock analytics data
export const mockAnalytics = {
  patientGrowth: Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
    patients: faker.number.int({ min: 50, max: 200 }),
    sessions: faker.number.int({ min: 100, max: 500 })
  })),
  assessmentResults: Array.from({ length: 7 }, (_, i) => ({
    date: faker.date.recent({ days: 7 - i }).toLocaleDateString(),
    depression: faker.number.int({ min: 5, max: 25 }),
    anxiety: faker.number.int({ min: 3, max: 20 }),
    ptsd: faker.number.int({ min: 1, max: 15 })
  })),
  userEngagement: {
    dailyActive: faker.number.int({ min: 150, max: 300 }),
    weeklyActive: faker.number.int({ min: 500, max: 800 }),
    monthlyActive: faker.number.int({ min: 1200, max: 2000 }),
    avgSessionDuration: faker.number.float({ min: 15, max: 45, fractionDigits: 1 })
  }
};

// Mock chat messages
export const mockChatMessages = [
  {
    id: '1',
    senderId: 'patient-1',
    senderName: 'John Patient',
    message: 'Hello, I had a great session today!',
    timestamp: faker.date.recent({ days: 1 }),
    type: 'message'
  },
  {
    id: '2',
    senderId: 'doctor-1',
    senderName: 'Dr. Sarah Wilson',
    message: 'That\'s wonderful to hear! How are you feeling?',
    timestamp: faker.date.recent({ days: 1 }),
    type: 'message'
  }
];

// Mock community posts
export const mockCommunityPosts = Array.from({ length: 10 }, (_, index) => ({
  id: `post-${index + 1}`,
  author: faker.person.fullName(),
  avatar: faker.image.avatar(),
  title: faker.lorem.sentence(),
  content: faker.lorem.paragraphs(2),
  timestamp: faker.date.recent({ days: 7 }),
  likes: faker.number.int({ min: 0, max: 50 }),
  comments: faker.number.int({ min: 0, max: 20 }),
  tags: faker.helpers.arrayElements(['support', 'anxiety', 'depression', 'wellness', 'therapy'], { min: 1, max: 3 })
}));

// Mock resources
export const mockResources = [
  {
    id: '1',
    title: 'Understanding Anxiety',
    description: 'Learn about anxiety disorders and coping strategies',
    type: 'article',
    url: '#',
    thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
    category: 'anxiety',
    readTime: '5 min read'
  },
  {
    id: '2',
    title: 'Mindfulness Meditation',
    description: 'Guided meditation for mental wellness',
    type: 'video',
    url: '#',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
    category: 'wellness',
    duration: '10 minutes'
  },
  {
    id: '3',
    title: 'Cognitive Behavioral Therapy Workbook',
    description: 'Downloadable CBT exercises and worksheets',
    type: 'pdf',
    url: '#',
    thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
    category: 'therapy',
    pages: '24 pages'
  }
];

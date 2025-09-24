import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Calendar, 
  TrendingUp, 
  Heart, 
  Gamepad2, 
  MessageSquare,
  Clock,
  Award,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';

const PatientDashboard = () => {
  const { user } = useAuth();

  // Mock data for charts
  const moodData = [
    { date: 'Mon', mood: 7 },
    { date: 'Tue', mood: 6 },
    { date: 'Wed', mood: 8 },
    { date: 'Thu', mood: 7 },
    { date: 'Fri', mood: 9 },
    { date: 'Sat', mood: 8 },
    { date: 'Sun', mood: 7 }
  ];
  
  const assessmentData = [
    { name: 'Completed', value: 85, color: '#10B981' },
    { name: 'Pending', value: 15, color: '#F59E0B' }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Wilson',
      date: '2025-07-28',
      time: '10:00 AM',
      type: 'Therapy Session'
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      date: '2025-08-04',
      time: '2:00 PM',
      type: 'Follow-up'
    }
  ];

  const quickActions = [
    {
      title: 'Start Assessment',
      description: 'Complete your daily mood assessment',
      icon: Brain,
      link: '/diagnosis',
      color: 'bg-blue-500'
    },
    {
      title: 'Play Cognitive Game',
      description: 'Exercise your mind with brain games',
      icon: Gamepad2,
      link: '/cognitive-game',
      color: 'bg-purple-500'
    },
    {
      title: 'Wellness Check',
      description: 'Track your wellness journey',
      icon: Heart,
      link: '/wellness',
      color: 'bg-green-500'
    },
    {
      title: 'Chat Support',
      description: 'Connect with our support team',
      icon: MessageSquare,
      link: '/chat',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's your mental health progress overview.
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span className="text-gray-600 dark:text-gray-400">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Current Streak', value: '7 days', icon: TrendingUp, color: 'text-green-600' },
          { label: 'Sessions Completed', value: '12', icon: CheckCircle, color: 'text-blue-600' },
          { label: 'Mood Score', value: '8.2/10', icon: Heart, color: 'text-pink-600' },
          { label: 'Next Appointment', value: '3 days', icon: Clock, color: 'text-purple-600' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Tracking Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Weekly Mood Tracking
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line type="monotone" dataKey="mood" stroke="#0ea5e9" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Assessment Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Assessment Progress
          </h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={assessmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  paddingAngle={5}
                >
                  {assessmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            {assessmentData.map((item) => (
              <div key={item.name} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {item.name}: {item.value}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Upcoming Appointments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Upcoming Appointments
        </h3>
        <ul className="space-y-4">
          {upcomingAppointments.map(appt => (
            <li key={appt.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">{appt.type}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">with {appt.doctor}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-800 dark:text-gray-200">{new Date(appt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{appt.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default PatientDashboard;

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  Heart,
  CheckCircle,
  Clock,
  Calendar,
  ArrowRight,
  BrainCircuit,
  Gamepad2,
  MessageSquare
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const PatientDashboard = () => {
  const { user } = useAuth();
  const displayName = user?.profile?.display_name || user?.email?.split('@')[0] || 'User';

  // Mock data for UI
  const quickStats = [
    { label: 'Practice Streak', value: '7 days', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Sessions Done', value: '12', icon: CheckCircle, color: 'text-blue-500' },
    { label: 'Avg. Mood', value: '8.2/10', icon: Heart, color: 'text-pink-500' },
    { label: 'Next Appointment', value: '3 days', icon: Clock, color: 'text-purple-500' }
  ];

  const moodData = [
    { date: 'Mon', mood: 7 }, { date: 'Tue', mood: 6 }, { date: 'Wed', mood: 8 },
    { date: 'Thu', mood: 7 }, { date: 'Fri', mood: 9 }, { date: 'Sat', mood: 8 }, { date: 'Sun', mood: 7 }
  ];

  const assessmentData = [
    { name: 'Completed', value: 85, color: '#10B981' },
    { name: 'Pending', value: 15, color: '#F59E0B' }
  ];

  const quickActions = [
    { title: 'Take Assessment', description: 'Check in with a quick survey', icon: BrainCircuit, link: '/assessment', color: 'bg-blue-500' },
    { title: 'Train Your Brain', description: 'Play a cognitive game', icon: Gamepad2, link: '/cognitive-games', color: 'bg-purple-500' },
    { title: 'Track Wellness', description: 'Log your daily wellness goals', icon: Heart, link: '/wellness', color: 'bg-green-500' },
    { title: 'Message Support', description: 'Connect with your care team', icon: MessageSquare, link: '/chat', color: 'bg-orange-500' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {displayName}!</h1>
          <p className="text-muted-foreground mt-1">Here's your mental wellness overview.</p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Mood Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis domain={[0, 10]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                  <Line type="monotone" dataKey="mood" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Assessment Progress</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={assessmentData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={5}>
                    {assessmentData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                {assessmentData.map((item) => (
                  <div key={item.name} className="flex items-center text-sm">
                    <div className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}: {item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map(action => (
              <Link to={action.link} key={action.title}>
                <div className="p-4 border rounded-lg hover:bg-muted transition-colors h-full flex flex-col">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${action.color}`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold">{action.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 flex-1">{action.description}</p>
                  <Button variant="link" className="p-0 h-auto mt-2 self-start">
                    Start Now <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default PatientDashboard;

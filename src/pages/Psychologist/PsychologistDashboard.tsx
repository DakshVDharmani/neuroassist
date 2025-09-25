import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Users, BarChart, MessageSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { mockPatients } from '@/services/mockData'; // Using mock data for now
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

const PsychologistDashboard = () => {
  const { user } = useAuth();
  const displayName = user?.profile?.display_name || user?.email?.split('@')[0] || 'Clinician';

  // Mock data processing
  const highRiskPatients = mockPatients.filter(p => p.riskLevel === 'high').slice(0, 5);
  const recentActivity = mockPatients.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime()).slice(0, 5);

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
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold">Welcome, {displayName}</h1>
        <p className="text-muted-foreground mt-1">Here's a summary of your patients and activities.</p>
      </motion.div>

      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockPatients.length}</div>
              <p className="text-xs text-muted-foreground">+2 this month</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">High-Risk Alerts</CardTitle>
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{highRiskPatients.length}</div>
              <p className="text-xs text-muted-foreground">Immediate attention needed</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Assessments</CardTitle>
                <BarChart className="w-5 h-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{mockPatients.filter(p => p.diagnosisStatus === 'pending').length}</div>
                <p className="text-xs text-muted-foreground">Awaiting patient completion</p>
                </CardContent>
            </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">From 5 patients</p>
                </CardContent>
            </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>High-Risk Patients</CardTitle>
              <Button variant="link" asChild><Link to="/patients?risk=high">View All <ArrowRight className="w-4 h-4 ml-1" /></Link></Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {highRiskPatients.map(patient => (
                    <TableRow key={patient.id} className="cursor-pointer hover:bg-muted" onClick={() => window.location.href = `/patients/${patient.id}`}>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell><Badge variant="destructive">{patient.riskLevel}</Badge></TableCell>
                      <TableCell>{patient.lastActivity.toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Recent Patient Activity</CardTitle>
              <Button variant="link" asChild><Link to="/patients">View All <ArrowRight className="w-4 h-4 ml-1" /></Link></Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map(patient => (
                  <div key={patient.id} className="flex items-center">
                    <img src={patient.avatar} alt={patient.name} className="w-10 h-10 rounded-full" />
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">Completed 'PHQ-9' assessment</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{patient.lastActivity.toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PsychologistDashboard;

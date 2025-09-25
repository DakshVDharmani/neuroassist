import React from 'react';
import { useParams } from 'react-router-dom';
import { mockPatients } from '@/services/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Activity, BrainCircuit, Gamepad2, MessageSquare } from 'lucide-react';
import ErrorPage from '../Error/ErrorPage';

const PatientDetailsView = () => {
  const { patientId } = useParams();
  const patient = mockPatients.find(p => p.id === patientId);

  if (!patient) {
    return <ErrorPage message="Patient not found." />;
  }

  const getRiskVariant = (level: string) => {
    switch (level) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img src={patient.avatar} alt={patient.name} className="w-20 h-20 rounded-full" />
            <div>
              <CardTitle className="text-3xl">{patient.name}</CardTitle>
              <p className="text-muted-foreground">{patient.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Risk Level</p>
              <Badge variant={getRiskVariant(patient.riskLevel) as any} className="text-lg">{patient.riskLevel}</Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Assessment Score</p>
              <p className="text-2xl font-bold">{patient.assessmentScore}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview"><User className="w-4 h-4 mr-2" />Overview</TabsTrigger>
          <TabsTrigger value="assessments"><BrainCircuit className="w-4 h-4 mr-2" />Assessments</TabsTrigger>
          <TabsTrigger value="games"><Gamepad2 className="w-4 h-4 mr-2" />Games</TabsTrigger>
          <TabsTrigger value="activity"><Activity className="w-4 h-4 mr-2" />Activity</TabsTrigger>
          <TabsTrigger value="notes"><MessageSquare className="w-4 h-4 mr-2" />Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader><CardTitle>Patient Overview</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p>This is the overview tab. Detailed charts and summaries of the patient's progress will be displayed here.</p>
              <p><strong>Age:</strong> {patient.age}</p>
              <p><strong>Gender:</strong> {patient.gender}</p>
              <p><strong>Conditions:</strong> {patient.conditions.join(', ')}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="assessments">
          <Card>
            <CardHeader><CardTitle>Assessment History</CardTitle></CardHeader>
            <CardContent>
              <p>A table or chart showing all historical assessment results (e.g., PHQ-9, GAD-7 scores over time) will be here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="games">
          <Card>
            <CardHeader><CardTitle>Cognitive Game Performance</CardTitle></CardHeader>
            <CardContent>
              <p>Detailed analytics on performance in cognitive games (N-Back, Stroop, etc.), including reaction time, accuracy, and progress charts.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity">
          <Card>
            <CardHeader><CardTitle>Passive Observation Timeline</CardTitle></CardHeader>
            <CardContent>
              <p>A timeline view of passively collected data, such as inferred attention levels, emotional tone from speech, and activity patterns, will be shown here (with patient consent).</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notes">
          <Card>
            <CardHeader><CardTitle>Clinician Notes</CardTitle></CardHeader>
            <CardContent>
              <p>A secure area for you to write, view, and manage your private notes about this patient.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDetailsView;

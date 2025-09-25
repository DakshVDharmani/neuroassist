import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockPatients } from '@/services/mockData';
import { useNavigate } from 'react-router-dom';

const PatientsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredPatients = useMemo(() => {
    return mockPatients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const getRiskVariant = (level: string) => {
    switch (level) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Patients</CardTitle>
        <div className="mt-4">
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>Sessions</TableHead>
              <TableHead>Last Activity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.id} onClick={() => navigate(`/patients/${patient.id}`)} className="cursor-pointer">
                <TableCell className="font-medium flex items-center gap-3">
                    <img src={patient.avatar} alt={patient.name} className="w-8 h-8 rounded-full" />
                    {patient.name}
                </TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>
                  <Badge variant={getRiskVariant(patient.riskLevel) as any}>{patient.riskLevel}</Badge>
                </TableCell>
                <TableCell>{patient.sessionsCompleted}</TableCell>
                <TableCell>{patient.lastActivity.toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PatientsList;

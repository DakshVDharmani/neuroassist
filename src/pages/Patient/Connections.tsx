import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, MessageSquare, UserPlus } from 'lucide-react';
import { supabase } from '@/services/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface PsychologistProfile {
  user_id: string;
  display_name: string;
  contact_email: string;
  bio?: string;
  specialty?: string[];
}

const Connections = () => {
  const { user } = useAuth();
  const [psychologists, setPsychologists] = useState<PsychologistProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [connections, setConnections] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Fetch all psychologists
      const { data: profilesData, error: profilesError } = await supabase
        .from('psychologist_profiles')
        .select(`
          user_id,
          bio,
          specialty,
          profiles ( display_name, contact_email )
        `);

      if (profilesError) {
        console.error('Error fetching psychologists:', profilesError);
        toast.error('Failed to load clinicians.');
      } else {
        const formattedData = profilesData.map(p => ({
          user_id: p.user_id,
          display_name: (p.profiles as any).display_name,
          contact_email: (p.profiles as any).contact_email,
          bio: p.bio,
          specialty: p.specialty,
        }));
        setPsychologists(formattedData);
      }

      // Fetch existing connections for the current user
      if (user) {
        const { data: connectionsData, error: connectionsError } = await supabase
          .from('connections')
          .select('*')
          .eq('patient_id', user.id);
        
        if (connectionsError) {
          console.error('Error fetching connections:', connectionsError);
        } else {
          setConnections(connectionsData);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const handleConnect = async (psychologistId: string) => {
    if (!user) {
      toast.error('You must be logged in to connect.');
      return;
    }

    const { data, error } = await supabase
      .from('connections')
      .insert({
        patient_id: user.id,
        psychologist_id: psychologistId,
        status: 'pending'
      })
      .select();

    if (error) {
      toast.error(error.message.includes('duplicate key') ? 'Connection request already sent.' : 'Failed to send request.');
    } else if (data) {
      setConnections(prev => [...prev, data[0]]);
      toast.success('Connection request sent!');
    }
  };

  const getStatus = (psychologistId: string) => {
    const connection = connections.find(c => c.psychologist_id === psychologistId);
    if (!connection) return 'not_connected';
    return connection.status;
  };

  const filteredPsychologists = psychologists.filter(p =>
    p.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.specialty?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Find a Clinician</h1>
        <p className="text-muted-foreground mt-2">Search and connect with licensed psychologists.</p>
      </div>

      <div className="relative max-w-lg mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          placeholder="Search by name or specialty (e.g., 'Anxiety')"
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground">Loading clinicians...</div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {filteredPsychologists.map(psych => (
            <motion.div key={psych.user_id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              <Card className="h-full flex flex-col">
                <CardHeader className="flex-row items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(psych.display_name)}&background=random`} />
                    <AvatarFallback>{psych.display_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{psych.display_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{psych.contact_email}</p>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {psych.specialty?.slice(0, 3).map(spec => (
                      <Badge key={spec} variant="secondary">{spec}</Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">{psych.bio || 'No bio available.'}</p>
                </CardContent>
                <CardFooter>
                  {getStatus(psych.user_id) === 'accepted' ? (
                     <Button className="w-full" variant="outline">
                        <MessageSquare className="w-4 h-4 mr-2" /> Message
                    </Button>
                  ) : getStatus(psych.user_id) === 'pending' ? (
                    <Button className="w-full" disabled>Request Sent</Button>
                  ) : (
                    <Button className="w-full" onClick={() => handleConnect(psych.user_id)}>
                      <UserPlus className="w-4 h-4 mr-2" /> Connect
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Connections;

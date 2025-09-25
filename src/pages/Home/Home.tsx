import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BrainCircuit, 
  Users, 
  ShieldCheck, 
  Heart, 
  ArrowRight, 
  Star,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const Home = () => {
  // This page can serve as a public-facing homepage if needed, or a welcome screen for patients.
  // For now, it's a simple welcome page. The main patient content is in PatientDashboard.
  return (
    <div className="space-y-12">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-12"
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            Your Journey to Wellness Starts Here
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Explore personalized tools, track your progress, and connect with professionals to support your mental health.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/dashboard">
                Go to My Dashboard <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/assessment">
                Take an Assessment
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;

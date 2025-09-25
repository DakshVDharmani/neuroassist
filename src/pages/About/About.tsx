import React from 'react';
import { motion } from 'framer-motion';
import { Users, Brain, ShieldCheck, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  return (
    <div className="space-y-12">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4">About NeuroAssist</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          We are dedicated to revolutionizing mental healthcare through technology, providing accessible, intelligent, and compassionate support for everyone.
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl text-center">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                Our mission is to destigmatize mental health and make high-quality care universally accessible. We leverage cutting-edge AI to empower individuals and healthcare professionals with tools for early detection, personalized treatment, and continuous support. We believe in a future where mental wellness is prioritized, and everyone has the resources to thrive.
                </p>
            </CardContent>
        </Card>
      </motion.section>
    </div>
  );
};

export default About;

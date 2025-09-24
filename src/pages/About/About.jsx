import React from 'react';
import { motion } from 'framer-motion';
import { Users, Brain, ShieldCheck, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="space-y-12">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About MindBridge</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          We are dedicated to revolutionizing mental healthcare through technology, providing accessible, intelligent, and compassionate support for everyone.
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="card p-8"
      >
        <h2 className="text-2xl font-bold text-center mb-8">Our Mission</h2>
        <p className="text-center text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto">
          Our mission is to destigmatize mental health and make high-quality care universally accessible. We leverage cutting-edge AI to empower individuals and healthcare professionals with tools for early detection, personalized treatment, and continuous support. We believe in a future where mental wellness is prioritized, and everyone has the resources to thrive.
        </p>
      </motion.section>
    </div>
  );
};

export default About;

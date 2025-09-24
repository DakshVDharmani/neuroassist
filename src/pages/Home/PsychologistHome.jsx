import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users,
  ClipboardCheck,
  LineChart,
  Calendar,
  Shield,
  BookOpen,
  ArrowRight,
  Brain,
  Stethoscope
} from 'lucide-react';

const PsychologistHome = () => {
  const features = [
    {
      icon: ClipboardCheck,
      title: 'Patient Assessments',
      description: 'Access AI-powered diagnostics and review detailed patient assessments.'
    },
    {
      icon: Calendar,
      title: 'Schedule & Appointments',
      description: 'Manage appointments, reminders, and session notes seamlessly.'
    },
    {
      icon: LineChart,
      title: 'Progress Tracking',
      description: 'Monitor patient progress with visual analytics and outcome measures.'
    },
    {
      icon: BookOpen,
      title: 'Research Library',
      description: 'Stay updated with the latest clinical guidelines and research.'
    }
  ];

  const stats = [
    { label: 'Active Patients', value: '120', icon: Users },
    { label: 'Avg. Improvement Rate', value: '87%', icon: LineChart },
    { label: 'Sessions This Month', value: '340', icon: Calendar },
    { label: 'Global Network', value: '2,500+', icon: Stethoscope }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-12"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Welcome, Doctor
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
          >
            Empowering mental health professionals with AI-driven insights, patient management tools, and global collaboration.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/patients"
              className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-3"
            >
              <span>View Patients</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/research"
              className="btn-secondary inline-flex items-center space-x-2 text-lg px-8 py-3"
            >
              <span>Explore Research</span>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
            className="card p-6 text-center"
          >
            <stat.icon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Tools for Psychologists
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to deliver effective care, manage patients, and stay ahead in mental health research.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
              className="card p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="card p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            How the Platform Supports You
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Simplifying care delivery in three steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Access Patient Data',
              description: 'Review assessments, session notes, and progress reports in one place.'
            },
            {
              step: '02',
              title: 'Collaborate with AI',
              description: 'Get insights from AI diagnostics and personalize care plans.'
            },
            {
              step: '03',
              title: 'Deliver Better Outcomes',
              description: 'Track progress and adjust treatment to maximize patient well-being.'
            }
          ].map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 + index * 0.1, duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                {step.step}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="card p-8 bg-gradient-to-r from-primary-600 to-accent-600 text-white text-center"
      >
        <h2 className="text-3xl font-bold mb-4">
          Enhance Your Practice
        </h2>
        <p className="text-xl mb-6 opacity-90">
          Join our global network of psychologists delivering cutting-edge mental health care
        </p>
        <Link
          to="/patients"
          className="inline-flex items-center space-x-2 bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <span>Manage Patients</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.section>
    </div>
  );
};

export default PsychologistHome;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { FontSizeProvider } from './contexts/FontSizeContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import RoleBasedRoute from './components/Auth/RoleBasedRoute';

// Auth Pages
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import DefaultRedirect from './pages/Auth/DefaultRedirect';

// Public Pages
import Home from './pages/Home/Home';
import About from './pages/About/About';
import PsychologistHome from './pages/Home/PsychologistHome';

// Assessment Pages
import Assessment from './pages/Assessment/Assessment';
import AssessmentResults from './pages/Assessment/AssessmentResults';

// Patient Pages
import PatientDashboard from './pages/Patient/PatientDashboard';
import PatientProfile from './pages/Patient/PatientProfile'; 
import Diagnosis from './pages/Patient/Diagnosis';
import CognitiveGame from './pages/Patient/CognitiveGame';
import Wellness from './pages/Patient/Wellness';
import PatientProfileForm from './pages/Patient/PatientProfileForm';

// Psychologist Pages
import PsychologistDashboard from './pages/Psychologist/PsychologistDashboard';
import PsychologistProfile from './pages/Psychologist/PsychologistProfile'; 
import PsychologistProfileForm from './pages/Psychologist/PsychologistProfileForm';

// Shared Pages
import Community from './pages/Community/Community';
import Chat from './pages/Chat/Chat';
import Safety from './pages/Safety/Safety';
import Resources from './pages/Resources/Resources';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';

// Utility Pages
import ErrorPage from './pages/Error/ErrorPage';
import Loading from './pages/Loading/Loading';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <FontSizeProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Default route after login → role aware */}
              <Route index element={<DefaultRedirect />} />

              {/* Public-like but behind auth */}
              <Route path="home" element={<Home />} />
              <Route path="about" element={<About />} />

              {/* Psychologist Home */}
              <Route
                path="psychologist-home"
                element={
                  <RoleBasedRoute allowedRoles={['psychologist', 'admin']}>
                    <PsychologistHome />
                  </RoleBasedRoute>
                }
              />

              {/* Assessment Routes */}
              <Route path="assessment" element={<Assessment />} />
              <Route path="assessment/results" element={<AssessmentResults />} />

              {/* Patient Routes */}
              <Route
                path="diagnosis"
                element={
                  <RoleBasedRoute allowedRoles={['patient']}>
                    <Diagnosis />
                  </RoleBasedRoute>
                }
              />

              <Route 
                path="patientprofile"
                element={
                  <RoleBasedRoute allowedRoles={['patient']}>
                    <PatientProfile/>
                  </RoleBasedRoute>
                }
              />

              <Route
                path="cognitive-game"
                element={
                  <RoleBasedRoute allowedRoles={['patient']}>
                    <CognitiveGame />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="wellness"
                element={
                  <RoleBasedRoute allowedRoles={['patient']}>
                    <Wellness />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="patient-profile"
                element={
                  <RoleBasedRoute allowedRoles={['patient']}>
                    <PatientProfileForm />
                  </RoleBasedRoute>
                }
              />

              {/* Psychologist Routes */}
              <Route
                path="psychologist-profile"
                element={
                  <RoleBasedRoute allowedRoles={['psychologist']}>
                    <PsychologistProfileForm />
                  </RoleBasedRoute>
                }
              />

              <Route
                path="psychologistprofile"
                element={
                  <RoleBasedRoute allowedRoles={['psychologist']}>
                    <PsychologistProfile/>
                  </RoleBasedRoute>
                }
              />

              {/* Shared Routes */}
              <Route path="community" element={<Community />} />
              <Route path="chat" element={<Chat />} />
              <Route path="safety" element={<Safety />} />
              <Route path="resources" element={<Resources />} />

              {/* Admin Routes */}
              <Route
                path="admin"
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </RoleBasedRoute>
                }
              />

              {/* Utility Routes */}
              <Route path="loading" element={<Loading />} />
              <Route path="error" element={<ErrorPage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </FontSizeProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

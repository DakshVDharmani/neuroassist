import { Routes, Route, useLocation } from 'react-router-dom';
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

// Assessment Pages
import Assessment from './pages/Assessment/Assessment';
import AssessmentResults from './pages/Assessment/AssessmentResults';

// Patient Pages
import PatientDashboard from './pages/Patient/PatientDashboard';
import PatientProfile from './pages/Patient/PatientProfile';
import CognitiveGame from './pages/Patient/CognitiveGame';
import Wellness from './pages/Patient/Wellness';
import PatientProfileForm from './pages/Patient/PatientProfileForm';
import Connections from './pages/Patient/Connections';

// Psychologist Pages
import PsychologistDashboard from './pages/Psychologist/PsychologistDashboard';
import PsychologistProfile from './pages/Psychologist/PsychologistProfile';
import PsychologistProfileForm from './pages/Psychologist/PsychologistProfileForm';
import PatientsList from './pages/Psychologist/PatientsList';
import PatientDetailsView from './pages/Psychologist/PatientDetailsView';

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
import Settings from './pages/Settings/Settings';

function App() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
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

        {/* Patient Routes */}
        <Route
          path="dashboard"
          element={
            <RoleBasedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </RoleBasedRoute>
          }
        />
        <Route
          path="home"
          element={
            <RoleBasedRoute allowedRoles={['patient']}>
              <Home />
            </RoleBasedRoute>
          }
        />
        <Route path="assessment" element={<Assessment />} />
        <Route path="assessment/results" element={<AssessmentResults />} />
        <Route
          path="profile"
          element={
            <RoleBasedRoute allowedRoles={['patient', 'psychologist', 'admin']}>
              <PatientProfile />
            </RoleBasedRoute>
          }
        />
        <Route
          path="profile/edit"
          element={
            <RoleBasedRoute allowedRoles={['patient']}>
              <PatientProfileForm />
            </RoleBasedRoute>
          }
        />
        <Route
          path="cognitive-games"
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
          path="connections"
          element={
            <RoleBasedRoute allowedRoles={['patient']}>
              <Connections />
            </RoleBasedRoute>
          }
        />

        {/* Psychologist Routes */}
        <Route
          path="psychologist-dashboard"
          element={
            <RoleBasedRoute allowedRoles={['psychologist', 'admin']}>
              <PsychologistDashboard />
            </RoleBasedRoute>
          }
        />
        <Route
          path="psychologist-profile"
          element={
            <RoleBasedRoute allowedRoles={['psychologist']}>
              <PsychologistProfile />
            </RoleBasedRoute>
          }
        />
        <Route
          path="psychologist-profile/edit"
          element={
            <RoleBasedRoute allowedRoles={['psychologist']}>
              <PsychologistProfileForm />
            </RoleBasedRoute>
          }
        />
        <Route
          path="patients"
          element={
            <RoleBasedRoute allowedRoles={['psychologist', 'admin']}>
              <PatientsList />
            </RoleBasedRoute>
          }
        />
        <Route
          path="patients/:patientId"
          element={
            <RoleBasedRoute allowedRoles={['psychologist', 'admin']}>
              <PatientDetailsView />
            </RoleBasedRoute>
          }
        />

        {/* Shared Routes */}
        <Route path="about" element={<About />} />
        <Route path="community" element={<Community />} />
        <Route path="chat" element={<Chat />} />
        <Route path="safety" element={<Safety />} />
        <Route path="resources" element={<Resources />} />
        <Route path="settings" element={<Settings />} />

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
  );
}

export default App;

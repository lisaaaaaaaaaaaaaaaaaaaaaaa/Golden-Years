import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SignInForm } from './components/auth/SignInForm';
import { SignUpForm } from './components/auth/SignUpForm';
import { useAuth } from './contexts/AuthContext';
import { Suspense, lazy } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const PetProfile = lazy(() => import('./pages/PetProfile'));
const HealthTracking = lazy(() => import('./pages/HealthTracking'));
const Settings = lazy(() => import('./pages/Settings'));

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <>{children}</> : <Navigate to="/signin" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/signin" element={<SignInForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/pet/:id"
              element={
                <PrivateRoute>
                  <PetProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/health/:petId"
              element={
                <PrivateRoute>
                  <HealthTracking />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
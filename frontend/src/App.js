import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import Dashboard from './components/dashboard/Dashboard';
import TopicsIndex from './components/topics/TopicsIndex';
import LearningPage from './components/learn/LearningPage';
import ExercisePage from './components/exercise/ExercisePage';
import CrossTestPage from './components/exercise/CrossTestPage';
import CrossTestResultsPage from './components/exercise/CrossTestResultsPage';
import ResultsPage from './components/results/ResultsPage';
import ReviewMistakesPage from './components/mistakes/ReviewMistakesPage';
import ProgressPage from './components/progress/ProgressPage';
import PrivateRoute from './components/common/PrivateRoute';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/topics"
              element={
                <PrivateRoute>
                  <TopicsIndex />
                </PrivateRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <PrivateRoute>
                  <ProgressPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/learn/:lessonId"
              element={
                <PrivateRoute>
                  <LearningPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/exercise/:lessonId"
              element={
                <PrivateRoute>
                  <ExercisePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/results/:resultId"
              element={
                <PrivateRoute>
                  <ResultsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/mistakes/review/:lessonId"
              element={
                <PrivateRoute>
                  <ReviewMistakesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/cross-test"
              element={
                <PrivateRoute>
                  <CrossTestPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/cross-test/results"
              element={
                <PrivateRoute>
                  <CrossTestResultsPage />
                </PrivateRoute>
              }
            />

            {/* Redirect authenticated users to topics, otherwise to login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

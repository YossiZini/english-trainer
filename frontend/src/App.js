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
import MistakesListPage from './components/mistakes/MistakesListPage';
import ReviewMistakesPage from './components/mistakes/ReviewMistakesPage';
import ProgressPage from './components/progress/ProgressPage';
import AchievementsPage from './components/achievements/AchievementsPage';
import Navbar from './components/navigation/Navbar';
import PrivateRoute from './components/common/PrivateRoute';
import VocabularyHomePage from './components/vocabulary/VocabularyHomePage';
import VocabularyQuizPage from './components/vocabulary/VocabularyQuizPage';
import VocabularyQuizResults from './components/vocabulary/VocabularyQuizResults';
import VocabularyReviewIntro from './components/vocabulary/VocabularyReviewIntro';
import VocabularyReviewQuiz from './components/vocabulary/VocabularyReviewQuiz';
import VocabularyHistory from './components/vocabulary/VocabularyHistory';
import UnseenHomePage from './components/unseen/UnseenHomePage';
import UnseenReadingPage from './components/unseen/UnseenReadingPage';
import UnseenResults from './components/unseen/UnseenResults';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
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
              path="/mistakes"
              element={
                <PrivateRoute>
                  <MistakesListPage />
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
            <Route
              path="/achievements"
              element={
                <PrivateRoute>
                  <AchievementsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/vocabulary"
              element={
                <PrivateRoute>
                  <VocabularyHomePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/vocabulary/quiz/:sessionId"
              element={
                <PrivateRoute>
                  <VocabularyQuizPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/vocabulary/results/:sessionId"
              element={
                <PrivateRoute>
                  <VocabularyQuizResults />
                </PrivateRoute>
              }
            />
            <Route
              path="/vocabulary/review/intro"
              element={
                <PrivateRoute>
                  <VocabularyReviewIntro />
                </PrivateRoute>
              }
            />
            <Route
              path="/vocabulary/review/:sessionId"
              element={
                <PrivateRoute>
                  <VocabularyReviewQuiz />
                </PrivateRoute>
              }
            />
            <Route
              path="/vocabulary/history"
              element={
                <PrivateRoute>
                  <VocabularyHistory />
                </PrivateRoute>
              }
            />
            <Route
              path="/unseen"
              element={
                <PrivateRoute>
                  <UnseenHomePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/unseen/reading/:paragraphId"
              element={
                <PrivateRoute>
                  <UnseenReadingPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/unseen/results/:sessionId"
              element={
                <PrivateRoute>
                  <UnseenResults />
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

import React, { useState, useEffect } from 'react';
import { User, Exam, Attempt, Notification } from './types';
import {
  INITIAL_EXAMS,
  SAMPLE_USERS,
  INITIAL_ATTEMPTS,
  INITIAL_NOTIFICATIONS
} from './data/sampleData';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoginView from './views/LoginView';
import StudentDashboard from './views/StudentDashboard';
import ExamView from './views/ExamView';
import ResultView from './views/ResultView';
import AdminDashboard from './views/AdminDashboard';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('kpc_dark_mode');
    return saved === 'true';
  });

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Core synchronized persistent application states
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('kpc_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem('kpc_exams');
    return saved ? JSON.parse(saved) : INITIAL_EXAMS;
  });

  const [attempts, setAttempts] = useState<Attempt[]>(() => {
    const saved = localStorage.getItem('kpc_attempts');
    return saved ? JSON.parse(saved) : INITIAL_ATTEMPTS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('kpc_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Current sub-view node.
  // Options: "login", "student-dashboard", "student-results", "student-profile", "exam-session", "result-summary", "admin", "admin-exams", "admin-questions", "admin-results"
  const [currentView, setCurrentView] = useState<string>(() => {
    const saved = localStorage.getItem('kpc_current_user');
    if (saved) {
      const userObj = JSON.parse(saved);
      return userObj.role === 'admin' ? 'admin' : 'student-dashboard';
    }
    return 'login';
  });

  // Active Session context trackers
  const [activeExamSession, setActiveExamSession] = useState<Exam | null>(null);
  const [activeResultAttempt, setActiveResultAttempt] = useState<Attempt | null>(null);

  // Synchronize Dark / Light Mode HTML structure classes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('kpc_dark_mode', String(darkMode));
  }, [darkMode]);

  // Synchronize dynamic application state buffers to Local Storage on updates
  useEffect(() => {
    localStorage.setItem('kpc_exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('kpc_attempts', JSON.stringify(attempts));
  }, [attempts]);

  useEffect(() => {
    localStorage.setItem('kpc_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Handle successful login
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('kpc_current_user', JSON.stringify(user));
    
    const targetDefaultView = user.role === 'admin' ? 'admin' : 'student-dashboard';
    setCurrentView(targetDefaultView);

    // Push secure authentication notification
    const alertId = `notif-${Date.now()}`;
    const newAlert: Notification = {
      id: alertId,
      title: 'Portal Security Handshake',
      message: `Signed in successfully on candidate session. Authorized: ${user.name}.`,
      time: 'Just now',
      read: false,
      type: 'info',
    };
    setNotifications((prev) => [newAlert, ...prev]);
  };

  // Handle Session Logouts
  const handleLogout = () => {
    localStorage.removeItem('kpc_current_user');
    setCurrentUser(null);
    setCurrentView('login');
    setActiveExamSession(null);
    setActiveResultAttempt(null);
  };

  // Trigger proctored session startup
  const handleStartExam = (exam: Exam) => {
    setActiveExamSession(exam);
    setCurrentView('exam-session');
  };

  // Trigger finished examination metrics computations (The Exam Score Calculator Engine)
  const handleSubmitExamSolutions = (answers: Record<string, number>, flaggedQuestions: string[]) => {
    if (!activeExamSession || !currentUser) return;

    let pointsEarned = 0;
    let totalPointsPos = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let attemptedCountVal = 0;

    activeExamSession.questions.forEach((q) => {
      totalPointsPos += q.points;
      const chosenIdx = answers[q.id];
      if (chosenIdx !== undefined) {
        attemptedCountVal++;
        if (chosenIdx === q.correctOption) {
          pointsEarned += q.points;
          correctCount++;
        } else {
          wrongCount++;
        }
      } else {
        // Unanswered count as wrong/unattempted
        wrongCount++;
      }
    });

    const percent = totalPointsPos > 0 ? Math.round((pointsEarned / totalPointsPos) * 100) : 0;
    
    // Core Grade bounds mapping
    let letterGrade = 'F';
    let statusText: 'Pass' | 'Fail' = 'Fail';
    
    if (percent >= 90) letterGrade = 'A';
    else if (percent >= 80) letterGrade = 'B';
    else if (percent >= 70) letterGrade = 'C';
    else if (percent >= 60) letterGrade = 'D';

    if (percent >= 60) statusText = 'Pass';

    // Build the finalized official academic Attempt Record
    const attemptId = `att-${Date.now()}`;
    const assessmentResult: Attempt = {
      id: attemptId,
      studentUsername: currentUser.username,
      studentName: currentUser.name,
      examId: activeExamSession.id,
      examTitle: activeExamSession.title,
      courseCode: activeExamSession.courseCode,
      answers,
      flaggedQuestions,
      score: pointsEarned,
      totalPoints: totalPointsPos,
      percent,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      attemptedCount: attemptedCountVal,
      status: statusText,
      grade: letterGrade,
      timestamp: new Date().toISOString(),
    };

    // Prepend new attempt to historical attempts list
    setAttempts((prev) => [assessmentResult, ...prev]);

    // Push congratulations or fail notice alert
    const notifId = `n-${Date.now()}`;
    const completionAlert: Notification = {
      id: notifId,
      title: `Transcript Processed: ${activeExamSession.courseCode}`,
      message: `Exam complete in ${activeExamSession.title}. Final Aggregation Score: ${percent}% (Grade: ${letterGrade}). proctored secure verification passed.`,
      time: 'Just now',
      read: false,
      type: percent >= 60 ? 'success' : 'warning',
    };
    setNotifications((prev) => [completionAlert, ...prev]);

    // Set active transcript focus and navigate directly to Result Sheet
    setActiveResultAttempt(assessmentResult);
    setCurrentView('result-summary');
    setActiveExamSession(null);
  };

  // Exit proctored assessment earlier
  const handleCancelExam = () => {
    setActiveExamSession(null);
    setCurrentView(currentUser?.role === 'admin' ? 'admin' : 'student-dashboard');
  };

  // Inspect particular historic transcript
  const handleViewResultSheet = (attempt: Attempt) => {
    const examMatch = exams.find((e) => e.id === attempt.examId) || INITIAL_EXAMS[0];
    setActiveExamSession(examMatch);
    setActiveResultAttempt(attempt);
    setCurrentView('result-summary');
  };

  // Helper notice clear/read state management
  const handleMarkNotificationRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-indigo-600 to-sky-500 dark:from-slate-950 dark:via-indigo-950 dark:to-blue-900 text-slate-805 dark:text-slate-100 transition-all duration-350 overflow-x-hidden">
      
      {/* 1. PORTAL GATE (IF LOGGED OUT) */}
      {currentView === 'login' || !currentUser ? (
        <LoginView onLoginSuccess={handleLoginSuccess} users={SAMPLE_USERS} />
      ) : (
        
        /* 2. AUTHENTICATED PORTAL WORKSPACE */
        <div className="flex h-screen overflow-hidden">
          
          {/* Dynamic proctor supervision checks are bypassed on result displays to enable printing */}
          {currentView !== 'exam-session' && (
            <Sidebar
              currentUser={currentUser}
              currentView={currentView}
              setCurrentView={setCurrentView}
              onLogout={handleLogout}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          )}

          <div className="flex flex-1 flex-col overflow-hidden">
            {currentView !== 'exam-session' && (
              <Header
                currentUser={currentUser}
                onLogout={handleLogout}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                notifications={notifications}
                onMarkNotificationRead={handleMarkNotificationRead}
                onClearNotifications={handleClearNotifications}
                setCurrentView={setCurrentView}
              />
            )}

            {/* CORE VIEWPORT CONTROLLER ENGINE */}
            <main className="flex flex-1 overflow-hidden">
              
              {/* Node-A: Student available dashboards */}
              {(currentView === 'student-dashboard' ||
                currentView === 'student-results' ||
                currentView === 'student-profile') && (
                <StudentDashboard
                  currentUser={currentUser}
                  exams={exams}
                  attempts={attempts.filter((a) => a.studentUsername === currentUser.username)}
                  onStartExam={handleStartExam}
                  onViewResult={handleViewResultSheet}
                  currentView={currentView}
                  setCurrentView={setCurrentView}
                />
              )}

              {/* Node-B: Active Exam Session Canvas (Fullscreen focused style) */}
              {currentView === 'exam-session' && activeExamSession && (
                <ExamView
                  exam={activeExamSession}
                  onSubmitExam={handleSubmitExamSolutions}
                  onCancelExam={handleCancelExam}
                />
              )}

              {/* Node-C: Transcript Detailed Sheet */}
              {currentView === 'result-summary' && activeResultAttempt && activeExamSession && (
                <ResultView
                  attempt={activeResultAttempt}
                  exam={activeExamSession}
                  onBackToDashboard={() => {
                    setCurrentView(currentUser.role === 'admin' ? 'admin-results' : 'student-results');
                    setActiveResultAttempt(null);
                    setActiveExamSession(null);
                  }}
                />
              )}

              {/* Node-D: Faculty Admin workspaces */}
              {(currentView === 'admin' ||
                currentView === 'admin-exams' ||
                currentView === 'admin-questions' ||
                currentView === 'admin-results') && (
                <AdminDashboard
                  exams={exams}
                  setExams={setExams}
                  attempts={attempts}
                  users={SAMPLE_USERS}
                  currentSubView={currentView}
                />
              )}

            </main>
          </div>

        </div>
      )}

    </div>
  );
}

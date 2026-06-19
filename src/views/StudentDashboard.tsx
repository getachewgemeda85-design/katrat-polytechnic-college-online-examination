import React, { useState } from 'react';
import {
  BookOpen,
  Clock,
  AlertOctagon,
  Award,
  Search,
  Calendar,
  ChevronRight,
  TrendingUp,
  Activity,
  FileCheck2,
  Lock,
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  Building
} from 'lucide-react';
import { User, Exam, Attempt } from '../types';

interface StudentDashboardProps {
  currentUser: User;
  exams: Exam[];
  attempts: Attempt[];
  onStartExam: (exam: Exam) => void;
  onViewResult: (attempt: Attempt) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
}

export default function StudentDashboard({
  currentUser,
  exams,
  attempts,
  onStartExam,
  onViewResult,
  currentView,
  setCurrentView,
}: StudentDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPolicyChecked, setIsPolicyChecked] = useState(false);
  const [selectedExamForPolicy, setSelectedExamForPolicy] = useState<Exam | null>(null);

  // Filter exams based on Search
  const filteredExams = exams.filter(
    (exam) =>
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Compute key academic metrics
  const completedCount = attempts.length;
  const avgPercentage =
    completedCount > 0
      ? Math.round(attempts.reduce((sum, att) => sum + att.percent, 0) / completedCount)
      : 0;

  let gpaText = 'N/A';
  if (completedCount > 0) {
    if (avgPercentage >= 90) gpaText = '4.00 (Outstanding)';
    else if (avgPercentage >= 80) gpaText = '3.50 (Excellent)';
    else if (avgPercentage >= 70) gpaText = '3.00 (Very Good)';
    else if (avgPercentage >= 60) gpaText = '2.50 (Good)';
    else gpaText = '1.80 (Needs Improvement)';
  }

  // Pre-start policy validation check
  const handleOpenPolicyCheck = (exam: Exam) => {
    setSelectedExamForPolicy(exam);
    setIsPolicyChecked(false);
  };

  const handleConfirmStartExam = () => {
    if (selectedExamForPolicy && isPolicyChecked) {
      onStartExam(selectedExamForPolicy);
      setSelectedExamForPolicy(null);
    }
  };

  return (
    <div className="flex-1 space-y-6 overflow-y-auto p-4 md:p-6 transition-colors duration-150">
      
      {/* Dynamic Header Welcome Banner */}
      <div className="rounded-2xl border border-white/20 bg-white/15 backdrop-blur-xl p-6 md:p-8 text-white shadow-xl animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="rounded-md bg-blue-500/20 px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase border border-blue-400/25">
              Karat Academic Network
            </span>
            <h1 className="mt-2 text-2xl md:text-3xl font-black tracking-tight" id="student-welcome-msg">
              Welcome back, {currentUser.name}!
            </h1>
            <p className="mt-1.5 text-xs text-blue-200 font-sans leading-relaxed">
              Karat Polytechnic College examination servers are running securely. Select a syllabus below to start.
            </p>
          </div>
          <div className="flex gap-4 border-l border-white/20 pl-4 md:pl-6">
            <div className="text-left">
              <p className="text-[10px] font-mono tracking-widest text-blue-300 uppercase">My ID</p>
              <p className="font-mono text-xs font-bold mt-0.5">{currentUser.studentId || "KPC-2026"}</p>
            </div>
            <div className="text-left">
              <p className="text-[10px] font-mono tracking-widest text-blue-300 uppercase">Avg Grade</p>
              <p className="font-sans text-xs font-bold mt-0.5">
                {completedCount > 0 ? `${avgPercentage}% (${attempts[0]?.grade || 'A'})` : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RENDER VIEW: 1. Main Exam Hall Dashboard */}
      {currentView === 'student-dashboard' && (
        <div className="space-y-6">
          
          {/* Statistical Counter Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/20 bg-white/40 dark:border-white/10 dark:bg-slate-950/20 shadow-lg backdrop-blur-md p-4.5 flex items-center gap-3">
              <div className="rounded-lg bg-blue-50/20 p-2.5 text-white/90">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-white/70 uppercase tracking-widest font-bold">Available Exam Syllabus</p>
                <p className="text-lg font-black text-white">{exams.length}</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/20 bg-white/40 dark:border-white/10 dark:bg-slate-950/20 shadow-lg backdrop-blur-md p-4.5 flex items-center gap-3">
              <div className="rounded-lg bg-emerald-50/20 p-2.5 text-white/90">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-white/70 uppercase tracking-widest font-bold">Exams Completed</p>
                <p className="text-lg font-black text-white">{completedCount}</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/20 bg-white/40 dark:border-white/10 dark:bg-slate-950/20 shadow-lg backdrop-blur-md p-4.5 flex items-center gap-3">
              <div className="rounded-lg bg-amber-50/20 p-2.5 text-white/90">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-white/70 uppercase tracking-widest font-bold">GPA Estimate</p>
                <p className="text-xs font-bold text-white mt-0.5">{gpaText}</p>
              </div>
            </div>
          </div>

          {/* Exam Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
            <div>
              <h2 className="text-base font-black text-slate-800 dark:text-slate-100 font-sans tracking-tight">
                Scheduled Active Examinations
              </h2>
              <p className="text-xs text-slate-450 dark:text-slate-400 mt-0.5">
                Double-check your course codes before starting the countdown timer.
              </p>
            </div>
            
            <div className="relative w-full sm:w-72">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search by code or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/80 py-2 pl-9 pr-4 text-xs text-slate-900 outline-none focus:border-white focus:ring-2 focus:ring-white/40 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-100 font-medium"
                id="exam-search-input"
              />
            </div>
          </div>

          {/* Exams Grid */}
          {filteredExams.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 p-8 text-center bg-white dark:border-slate-800 dark:bg-slate-900">
              <AlertOctagon className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
              <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-450">No examinations found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2" id="exams-list">
              {filteredExams.map((exam) => {
                const alreadyTried = attempts.find((a) => a.examId === exam.id);
                return (
                  <div
                    key={exam.id}
                    className="flex flex-col rounded-2xl border border-white/20 bg-white/75 dark:border-white/10 dark:bg-slate-950/70 p-5 shadow-lg backdrop-blur-md hover:scale-[1.01] hover:bg-white/85 dark:hover:bg-slate-950/85 transition-all duration-300 relative overflow-hidden group"
                  >
                    {/* Status corner badge */}
                    <span className={`absolute top-0 right-0 py-1 px-3 text-[9px] font-mono font-bold uppercase rounded-bl-lg border-l border-b ${
                      alreadyTried 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30' 
                        : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30'
                    }`}>
                      {alreadyTried ? 'Completed ✓' : 'Eligible to Start'}
                    </span>

                    <div className="flex-1 space-y-3">
                      <div>
                        <span className="text-[10px] font-mono font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                          {exam.courseCode}
                        </span>
                        <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 mt-2 tracking-tight">
                          {exam.title}
                        </h3>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {exam.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-1.5 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-450 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {exam.durationMinutes} Minutes Time Allow
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          Questions: {exam.questions.length} (MCQs)
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      {alreadyTried ? (
                        <>
                          <span className="text-[10.5px] font-bold text-slate-400 flex items-center gap-1">
                            Score: <b className="text-slate-700 dark:text-slate-200">{alreadyTried.percent}%</b>
                          </span>
                          <button
                            onClick={() => onViewResult(alreadyTried)}
                            className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition"
                          >
                            <span>Detailed Performance Review</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-1 text-[10.5px] text-amber-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
                            <span>Unlocks strictly on start click</span>
                          </div>
                          
                          <button
                            onClick={() => handleOpenPolicyCheck(exam)}
                            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all duration-150 active:scale-95"
                          >
                            <span>Initialize Assessment</span>
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* PRE-EXAM POLICY CHECK DIALOG / MODAL */}
          {selectedExamForPolicy && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
              <div className="w-full max-w-lg rounded-2xl border border-white/25 bg-white/85 dark:border-white/10 dark:bg-slate-950/85 p-6 shadow-2xl backdrop-blur-xl animate-slide-up">
                
                <div className="flex items-start gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div className="rounded-full bg-amber-100 p-2 text-amber-600 dark:bg-amber-950/40">
                    <AlertOctagon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      Karat Integrity Supervised Proctor Agreement
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Academic Syllabus Code: <b className="font-mono text-blue-600 dark:text-blue-400">{selectedExamForPolicy.courseCode}</b>
                    </p>
                  </div>
                </div>

                <div className="my-4 space-y-3 rounded-xl bg-slate-50 p-4 text-xs dark:bg-slate-850/60 text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    Please read and accept the security supervision terms:
                  </p>
                  <ul className="list-disc pl-4 space-y-1.5 font-sans">
                    <li>This examination features a strict timer. Auto-submission initiates once time expires.</li>
                    <li>You must not consult paper documents, external search engines, or electronic tools.</li>
                    <li>Answers are saved automatically in real-time onto local college infrastructure.</li>
                    <li>Closing browser tabs or navigating back during active tests forfeits remaining eligibility.</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <label className="flex items-start gap-2.5 select-none text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <input
                      type="checkbox"
                      checked={isPolicyChecked}
                      onChange={(e) => setIsPolicyChecked(e.target.checked)}
                      className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 mt-0.5"
                      id="policy-accept-checkbox"
                    />
                    <span>
                      I certify that I am <b>{currentUser.name}</b> and I agree to KPC academic proctor guidelines and terms of integrity.
                    </span>
                  </label>

                  <div className="flex items-center justify-end gap-3.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => setSelectedExamForPolicy(null)}
                      className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition"
                    >
                      Cancel Access
                    </button>
                    <button
                      onClick={handleConfirmStartExam}
                      disabled={!isPolicyChecked}
                      className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all ${
                        isPolicyChecked
                          ? 'bg-blue-650 hover:bg-blue-700 shadow-blue-500/20 active:scale-95'
                          : 'bg-slate-300 cursor-not-allowed dark:bg-slate-800 text-slate-400'
                      }`}
                      id="proctor-start-btn"
                    >
                      <Lock className="h-4 w-4" />
                      <span>Release Questionnaire</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* RENDER VIEW: 2. Grades & Performance History */}
      {currentView === 'student-results' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight">
              Institutional Grading Report Card
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select one of your finalized examinations to inspect question breakdowns and correction keys.
            </p>
          </div>

          {attempts.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 p-10 text-center bg-white dark:border-slate-800 dark:bg-slate-900">
              <Award className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
              <h3 className="text-sm font-bold mt-3 text-slate-700 dark:text-slate-300">No Assessment Records Found</h3>
              <p className="text-xs text-slate-400 mt-1">Complete your scheduled syllabus exams to populate records.</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/20 bg-white/80 dark:border-white/10 dark:bg-slate-950/80 shadow-xl backdrop-blur-lg overflow-hidden" id="grades-log-panel">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 font-mono">
                    <th className="px-5 py-3">Code</th>
                    <th className="px-5 py-3">Assessment Title</th>
                    <th className="px-5 py-3">Completed Date</th>
                    <th className="px-5 py-3 text-center">Score</th>
                    <th className="px-5 py-3 text-center">Grade</th>
                    <th className="px-5 py-3 text-center">Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-705 dark:text-slate-300">
                  {attempts.map((attempt) => (
                    <tr
                      key={attempt.id}
                      className="hover:bg-slate-50/30 dark:hover:bg-slate-805/30 transition-all duration-150"
                    >
                      <td className="px-5 py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400 select-all">
                        {attempt.courseCode}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-slate-150 max-w-xs truncate">
                        {attempt.examTitle}
                      </td>
                      <td className="px-5 py-3.5 text-slate-450 dark:text-slate-400">
                        {new Date(attempt.timestamp).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono font-bold">
                        {attempt.score}/{attempt.totalPoints} ({attempt.percent}%)
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-flex rounded-md font-mono font-bold px-2.0 py-0.5 text-xs ${
                          attempt.status === 'Pass' 
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20' 
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/20'
                        }`}>
                          {attempt.grade}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          attempt.status === 'Pass'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-450'
                        }`}>
                          {attempt.status === 'Pass' ? 'PASS' : 'FAIL'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => onViewResult(attempt)}
                          className="rounded-lg bg-blue-50 px-3 py-1.5 font-bold text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-900/30 transition"
                        >
                          View Key Sheet
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* RENDER VIEW: 3. Student Profile Segment */}
      {currentView === 'student-profile' && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          
          {/* Identity Card Block */}
          <div className="rounded-2xl border border-white/20 bg-white/80 dark:border-white/10 dark:bg-slate-950/80 shadow-lg backdrop-blur-md p-6 space-y-4 md:col-span-1">
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-blue-550/30"
                />
                <span className="absolute bottom-1 right-2 inline-flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-500 font-bold text-white text-[9px] border-2 border-white dark:border-slate-900">
                  ✓
                </span>
              </div>
              <h3 className="mt-3 text-base font-black text-slate-800 dark:text-slate-100 tracking-tight">
                {currentUser.name}
              </h3>
              <p className="mt-1.5 text-xs text-blue-600 dark:text-blue-400 font-mono tracking-widest font-bold uppercase">
                {currentUser.studentId || 'KPC-24-CS-084'}
              </p>
              <span className="mt-1.5 inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
                ACTIVE STATUS
              </span>
            </div>

            <div className="space-y-3.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-350">
                <Building className="h-4.5 w-4.5 text-slate-400" />
                <span>{currentUser.department || 'Computer Technology Department'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-350">
                <Mail className="h-4.5 w-4.5 text-slate-400" />
                <span>aron.mukerji@katrat.edu</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-350">
                <Phone className="h-4.5 w-4.5 text-slate-400" />
                <span>+91 98450 12051</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-350">
                <MapPin className="h-4.5 w-4.5 text-slate-400" />
                <span>Karat Campus, Block 4B</span>
              </div>
            </div>
          </div>

          {/* Academic Analytics Profile Block */}
          <div className="rounded-2xl border border-white/20 bg-white/80 dark:border-white/10 dark:bg-slate-950/80 shadow-lg backdrop-blur-md p-6 space-y-6 md:col-span-2">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                Academic Performance Summary
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluated scores computed continuously across the 2026/27 semester.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-850/40 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2.5 text-blue-700 dark:bg-blue-900/30">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Attendance Rate</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">94.8% (Target Met)</p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-850/40 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="rounded-lg bg-emerald-100 p-2.5 text-emerald-700 dark:bg-emerald-900/30">
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Average Test Percent</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{completedCount > 0 ? `${avgPercentage}%` : 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono uppercase tracking-wider">
                Authorized Superproctor Keys
              </h4>

              <div className="rounded-lg border border-slate-150 p-3 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-sans">Proctor Signature Verification Status:</span>
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">VERIFIED</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Security Access Standard:</span>
                  <span className="font-mono text-[10px] text-slate-600 dark:text-slate-300">W3C Superviced Browser Token v4</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Exam Supervisor Board:</span>
                  <span className="text-slate-600 dark:text-slate-300">KPC Internal Board of Examiners</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

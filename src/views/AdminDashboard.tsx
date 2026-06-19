import React, { useState } from 'react';
import {
  Database,
  Plus,
  Trash2,
  Edit,
  Users,
  BarChart3,
  BookOpen,
  Award,
  Search,
  Save,
  AlertTriangle,
  PlusCircle,
  X,
  FileSpreadsheet,
  Check,
  CheckSquare
} from 'lucide-react';
import { Exam, Question, User, Attempt } from '../types';

interface AdminDashboardProps {
  exams: Exam[];
  setExams: (exams: Exam[]) => void;
  attempts: Attempt[];
  users: User[];
  currentSubView: string; // "admin", "admin-exams", "admin-questions", "admin-results"
}

export default function AdminDashboard({
  exams,
  setExams,
  attempts,
  users,
  currentSubView,
}: AdminDashboardProps) {
  // Modal controllers
  const [showExamModal, setShowExamModal] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<{ examId: string; question: Question } | null>(null);

  // Search filter
  const [resultsSearchQuery, setResultsSearchQuery] = useState('');

  // Exam Form state
  const [examTitle, setExamTitle] = useState('');
  const [examCode, setExamCode] = useState('');
  const [examDesc, setExamDesc] = useState('');
  const [examDur, setExamDur] = useState(15);

  // Question Form state
  const [targetExamId, setTargetExamId] = useState('');
  const [qText, setQText] = useState('');
  const [qOptA, setQOptA] = useState('');
  const [qOptB, setQOptB] = useState('');
  const [qOptC, setQOptC] = useState('');
  const [qOptD, setQOptD] = useState('');
  const [qCorrect, setQCorrect] = useState(0);
  const [qPoints, setQPoints] = useState(5);

  // Open Exam model for ADD
  const handleAddExamClick = () => {
    setEditingExam(null);
    setExamTitle('');
    setExamCode('');
    setExamDesc('');
    setExamDur(15);
    setShowExamModal(true);
  };

  // Open Exam model for EDIT
  const handleEditExamClick = (exam: Exam) => {
    setEditingExam(exam);
    setExamTitle(exam.title);
    setExamCode(exam.courseCode);
    setExamDesc(exam.description);
    setExamDur(exam.durationMinutes);
    setShowExamModal(true);
  };

  // Save Exam (Create / Update)
  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle.trim() || !examCode.trim()) {
      alert('Please fill out the Exam Title and Course Code fields.');
      return;
    }

    if (editingExam) {
      // Update
      const updated = exams.map((ex) =>
        ex.id === editingExam.id
          ? {
              ...ex,
              title: examTitle.trim(),
              courseCode: examCode.trim().toUpperCase(),
              description: examDesc.trim(),
              durationMinutes: Number(examDur),
            }
          : ex
      );
      setExams(updated);
    } else {
      // Insert
      const newExam: Exam = {
        id: `exam-${Date.now()}`,
        title: examTitle.trim(),
        courseCode: examCode.trim().toUpperCase(),
        description: examDesc.trim() || 'No description designated for this exam module.',
        durationMinutes: Number(examDur) || 15,
        questions: [],
        scheduledDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0] + 'T09:00:00',
        isActive: true,
      };
      setExams([...exams, newExam]);
    }

    setShowExamModal(false);
  };

  // Delete entire Exam
  const handleDeleteExam = (examId: string) => {
    if (confirm('Delete Exam Warning: This will permanently delete this exam and all embedded questions. Are you sure?')) {
      setExams(exams.filter((ex) => ex.id !== examId));
    }
  };

  // Open Question modal for ADD
  const handleAddQuestionClick = (defaultExamId = '') => {
    setEditingQuestion(null);
    setTargetExamId(defaultExamId || (exams[0]?.id || ''));
    setQText('');
    setQOptA('');
    setQOptB('');
    setQOptC('');
    setQOptD('');
    setQCorrect(0);
    setQPoints(5);
    setShowQuestionModal(true);
  };

  // Open Question modal for EDIT
  const handleEditQuestionClick = (examId: string, q: Question) => {
    setEditingQuestion({ examId, question: q });
    setTargetExamId(examId);
    setQText(q.text);
    setQOptA(q.options[0] || '');
    setQOptB(q.options[1] || '');
    setQOptC(q.options[2] || '');
    setQOptD(q.options[3] || '');
    setQCorrect(q.correctOption);
    setQPoints(q.points);
    setShowQuestionModal(true);
  };

  // Save Question (Create / Update)
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim() || !qOptA.trim() || !qOptB.trim()) {
      alert('Question text and at least options A & B are required.');
      return;
    }

    const options = [qOptA.trim(), qOptB.trim(), qOptC.trim() || 'N/A', qOptD.trim() || 'N/A'];

    const targetExam = exams.find((ex) => ex.id === targetExamId);
    if (!targetExam) return;

    if (editingQuestion) {
      // Update question under corresponding exam
      const updatedExams = exams.map((ex) => {
        if (ex.id === editingQuestion.examId) {
          return {
            ...ex,
            questions: ex.questions.map((q) =>
              q.id === editingQuestion.question.id
                ? {
                    ...q,
                    text: qText.trim(),
                    options,
                    correctOption: Number(qCorrect),
                    points: Number(qPoints),
                  }
                : q
            ),
          };
        }
        return ex;
      });
      setExams(updatedExams);
    } else {
      // Add new question to target exam
      const newQuestion: Question = {
        id: `q-${Date.now()}`,
        text: qText.trim(),
        options,
        correctOption: Number(qCorrect),
        points: Number(qPoints) || 5,
      };

      const updatedExams = exams.map((ex) => {
        if (ex.id === targetExamId) {
          return {
            ...ex,
            questions: [...ex.questions, newQuestion],
          };
        }
        return ex;
      });
      setExams(updatedExams);
    }

    setShowQuestionModal(false);
  };

  // Delete individual Question
  const handleDeleteQuestion = (examId: string, questionId: string) => {
    if (confirm('Delete Question Warning: Are you sure you want to delete this question?')) {
      const updated = exams.map((ex) => {
        if (ex.id === examId) {
          return {
            ...ex,
            questions: ex.questions.filter((q) => q.id !== questionId),
          };
        }
        return ex;
      });
      setExams(updated);
    }
  };

  // Calculations for Stats Overview
  const totalStudents = users.filter((u) => u.role === 'student').length;
  const examCount = exams.length;
  const completionsCount = attempts.length;
  const averagePercent =
    attempts.length > 0
      ? Math.round(attempts.reduce((sum, att) => sum + att.percent, 0) / attempts.length)
      : 0;

  // Grade counter stats
  const passCount = attempts.filter((a) => a.status === 'Pass').length;
  const failCount = completionsCount - passCount;

  // Filter student performance ledger
  const filteredAttempts = attempts.filter(
    (att) =>
      att.studentName.toLowerCase().includes(resultsSearchQuery.toLowerCase()) ||
      att.studentUsername.toLowerCase().includes(resultsSearchQuery.toLowerCase()) ||
      att.examTitle.toLowerCase().includes(resultsSearchQuery.toLowerCase()) ||
      att.courseCode.toLowerCase().includes(resultsSearchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-6 overflow-y-auto p-4 md:p-6 bg-transparent transition-all duration-350">
      
      {/* SECTION 1: OVERVIEW DASHBOARD */}
      {currentSubView === 'admin' && (
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight font-sans">
                Polytechnic Assessment Analytics
              </h2>
              <p className="text-xs text-slate-450 dark:text-slate-400 mt-1">
                Real-time tracking of proctored student submissions, grade metrics, and question bank statistics.
              </p>
            </div>
            
            <button
              onClick={handleAddExamClick}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
              id="admin-add-exam-quick-btn"
            >
              <Plus className="h-4.5 w-4.5" />
              <span>Deploy New Exam Syllabus</span>
            </button>
          </div>

          {/* Quick Metrics Bento Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            
            <div className="rounded-xl border border-white/20 bg-white/40 dark:border-white/10 dark:bg-slate-950/20 shadow-lg backdrop-blur-md p-4.5 flex items-center gap-3">
              <div className="rounded-lg bg-indigo-50/20 p-2.5 text-white/95">
                <Users className="h-5.5 w-5.5" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-white/70 uppercase tracking-widest font-bold">Students Enrolled</p>
                <p className="text-lg font-black text-white mt-0.5">{totalStudents}</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/20 bg-white/40 dark:border-white/10 dark:bg-slate-950/20 shadow-lg backdrop-blur-md p-4.5 flex items-center gap-3">
              <div className="rounded-lg bg-blue-50/20 p-2.5 text-white/95">
                <BookOpen className="h-5.5 w-5.5" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-white/70 uppercase tracking-widest font-bold">Active Exams</p>
                <p className="text-lg font-black text-white mt-0.5">{examCount}</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/20 bg-white/40 dark:border-white/10 dark:bg-slate-950/20 shadow-lg backdrop-blur-md p-4.5 flex items-center gap-3">
              <div className="rounded-lg bg-emerald-50/20 p-2.5 text-white/95">
                <CheckSquare className="h-5.5 w-5.5" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-white/70 uppercase tracking-widest font-bold">Submissions Logs</p>
                <p className="text-lg font-black text-white mt-0.5">{completionsCount}</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/20 bg-white/40 dark:border-white/10 dark:bg-slate-950/20 shadow-lg backdrop-blur-md p-4.5 flex items-center gap-3">
              <div className="rounded-lg bg-amber-50/20 p-2.5 text-white/95">
                <Award className="h-5.5 w-5.5" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-white/70 uppercase tracking-widest font-bold">Average Aggregate</p>
                <p className="text-lg font-black text-white mt-0.5">{averagePercent}%</p>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            
            {/* Visual Bar Summary cards of grade distribution */}
            <div className="rounded-2xl border border-white/20 bg-white/75 dark:border-white/10 dark:bg-slate-950/70 p-5 space-y-4 shadow-xl backdrop-blur-md lg:col-span-2">
              <div>
                <h3 className="text-xs font-black uppercase font-mono tracking-widest text-slate-450">
                  Submissions Performance Distribution
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Ratio of passing grades against failures.</p>
              </div>

              {completionsCount === 0 ? (
                <div className="h-44 flex flex-col justify-center items-center text-slate-400 text-xs">
                  <BarChart3 className="h-10 w-10 text-slate-300 mb-2" />
                  <span>No student performance curves computed yet</span>
                </div>
              ) : (
                <div className="space-y-4">
                  
                  {/* Visual percentage graph */}
                  <div className="h-6 w-full rounded-lg overflow-hidden flex font-mono text-[10px] font-bold text-white shadow-inner">
                    <div
                      className="bg-emerald-600 flex items-center justify-center transition-all duration-300"
                      style={{ width: `${Math.round((passCount/completionsCount)*100)}%` }}
                    >
                      {passCount > 0 && `Pass: ${Math.round((passCount/completionsCount)*100)}%`}
                    </div>
                    <div
                      className="bg-rose-500 flex items-center justify-center transition-all duration-300"
                      style={{ width: `${Math.round((failCount/completionsCount)*100)}%` }}
                    >
                      {failCount > 0 && `Fail: ${Math.round((failCount/completionsCount)*100)}%`}
                    </div>
                  </div>

                  {/* Summary Indicators */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="rounded-xl border border-slate-150 p-3 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/20">
                      <p className="text-slate-455 font-mono">Passed Attempts:</p>
                      <p className="text-lg font-black text-emerald-650 mt-1">{passCount} Students</p>
                    </div>
                    <div className="rounded-xl border border-slate-150 p-3 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/20">
                      <p className="text-slate-455 font-mono">Failed Attempts:</p>
                      <p className="text-lg font-black text-rose-650 mt-1">{failCount} Students</p>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Quick stats on exam volumes */}
            <div className="rounded-2xl border border-white/20 bg-white/75 dark:border-white/10 dark:bg-slate-950/70 p-5 space-y-4 shadow-xl backdrop-blur-md lg:col-span-1">
              <div>
                <h3 className="text-xs font-black uppercase font-mono tracking-widest text-slate-455">
                  Proctor Server Status
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Syllabus database overview.</p>
              </div>

              <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-850/40 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-505">Integrity Monitor:</span>
                  <span className="font-mono font-bold text-emerald-650 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" /> SECURE MATCH
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-505">Syllabus Exams:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{examCount} Syllabus</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-505">Question Assets:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {exams.reduce((sum, e) => sum + e.questions.length, 0)} MCQs total
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-505">Core Database Version:</span>
                  <span className="font-mono text-slate-455">NoSQL Local Persist v2.0</span>
                </div>
              </div>
            </div>

          </div>

          {/* Recent attempts ledger summary */}
          <div className="rounded-2xl border border-white/20 bg-white/75 dark:border-white/10 dark:bg-slate-950/70 p-5 space-y-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase font-mono tracking-widest text-slate-455">
                Latest Completed Exam Submissions
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-mono font-bold pb-2">
                    <th className="py-2.5">Student Candidate</th>
                    <th className="py-2.5">Syllabus / Exam</th>
                    <th className="py-2.5 text-center">Score</th>
                    <th className="py-2.5 text-center">Grade</th>
                    <th className="py-2.5 text-right">Completion Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {attempts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400">
                        No submissions logged in proctor node yet.
                      </td>
                    </tr>
                  ) : (
                    attempts.slice(0, 5).map((att) => (
                      <tr key={att.id}>
                        <td className="py-3.5 font-bold text-slate-800 dark:text-slate-200">
                          {att.studentName}
                        </td>
                        <td className="py-3.5 font-mono text-blue-600 dark:text-blue-400">
                          {att.courseCode} - {att.examTitle}
                        </td>
                        <td className="py-3.5 text-center font-mono font-black">
                          {att.percent}% ({att.score}/{att.totalPoints})
                        </td>
                        <td className="py-3.5 text-center">
                          <span className={`inline-block font-mono font-bold px-1.5 py-0.5 rounded text-[10.5px] ${
                            att.status === 'Pass' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/20'
                          }`}>
                            {att.grade}
                          </span>
                        </td>
                        <td className="py-3.5 text-right font-mono text-slate-400">
                          {new Date(att.timestamp).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SECTION 2: EXAMS SYLLABUS MANAGEMENT */}
      {currentSubView === 'admin-exams' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
            <div>
              <h2 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight font-sans">
                Syllabus & Exam Configurations
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Define course titles, code markers, point values, exam timing configurations, or deploy entire syllabus modules.
              </p>
            </div>
            
            <button
              onClick={handleAddExamClick}
              className="flex items-center gap-1 text-xs font-bold bg-blue-600 text-white rounded-xl px-4 py-2 hover:bg-blue-700 transition shadow-md shadow-blue-500/10"
              id="admin-create-exam-btn"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Exam Syllabus</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="rounded-2xl border border-white/20 bg-white/75 dark:border-white/10 dark:bg-slate-950/70 p-5 shadow-lg backdrop-blur-md flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-blue-600 bg-blue-105 px-2.5 py-0.5 rounded dark:text-blue-450 dark:bg-blue-950/40">
                      {exam.courseCode}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {exam.questions.length} Questions (MCQ)
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-855 dark:text-slate-100 tracking-tight">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-405 leading-relaxed line-clamp-3">
                    {exam.description}
                  </p>

                  <div className="text-[11px] font-mono text-slate-400 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span>Allowed duration: <b>{exam.durationMinutes} minutes</b></span>
                    <span>Proctor: Checked</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => handleAddQuestionClick(exam.id)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-755 hover:underline dark:text-blue-400 flex items-center gap-1"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Add question</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditExamClick(exam)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 transition"
                      title="Edit Syllabus"
                      id={`edit-exam-btn-${exam.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteExam(exam.id)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-slate-800 transition"
                      title="Delete Syllabus"
                      id={`delete-exam-btn-${exam.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* SECTION 3: QUESTION DATABASE */}
      {currentSubView === 'admin-questions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
            <div>
              <h2 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight font-sans">
                Master Question Warehouse
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Compile options, point distributions, and correct index flags down to specific examinations.
              </p>
            </div>
            
            <button
              onClick={() => handleAddQuestionClick()}
              className="flex items-center gap-1 text-xs font-bold bg-blue-600 text-white rounded-xl px-4 py-2 hover:bg-blue-700 transition shadow-md shadow-blue-500/10"
              id="admin-add-question-btn"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Question Item</span>
            </button>
          </div>

          <div className="space-y-8">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="rounded-2xl border border-white/20 bg-white/75 dark:border-white/10 dark:bg-slate-950/70 p-5 space-y-4 shadow-lg backdrop-blur-md"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div>
                    <span className="font-mono text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded mr-2 uppercase tracking-wide">
                      {exam.courseCode}
                    </span>
                    <b className="text-xs font-bold text-slate-800 dark:text-slate-100">{exam.title}</b>
                  </div>
                  <button
                    onClick={() => handleAddQuestionClick(exam.id)}
                    className="text-[11px] font-bold text-blue-600 hover:underline dark:text-blue-400"
                  >
                    + Add to this Exam
                  </button>
                </div>

                {exam.questions.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">
                    No questions deployed in this exam module yet.
                  </p>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-4">
                    {exam.questions.map((q, qIdx) => (
                      <div key={q.id} className="pt-4 first:pt-0 space-y-2 text-xs">
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-bold text-slate-850 dark:text-slate-250">
                            Q{qIdx + 1}: {q.text}
                          </p>
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="font-mono text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-800 px-2.0 py-0.5 rounded font-bold mr-1.5">
                              {q.points} pt
                            </span>
                            
                            <button
                              onClick={() => handleEditQuestionClick(exam.id, q)}
                              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition"
                              title="Edit Question"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(exam.id, q.id)}
                              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-rose-650 transition"
                              title="Delete Question"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Options preview */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-500 leading-relaxed font-sans mt-2 ml-1">
                          {q.options.map((opt, oIdx) => {
                            const isCorrect = oIdx === q.correctOption;
                            return (
                              <div
                                key={oIdx}
                                className={`flex items-start gap-1 p-2 border rounded-lg ${
                                  isCorrect
                                    ? 'border-emerald-300 bg-emerald-50/20 text-emerald-800 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-400'
                                    : 'border-slate-100 bg-slate-50/20 dark:border-slate-800/20'
                                }`}
                              >
                                {isCorrect && <Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-600" />}
                                <span>{opt}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      )}

      {/* SECTION 4: STUDENT RESULTS LEDGER */}
      {currentSubView === 'admin-results' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-205 pb-4 dark:border-slate-800">
            <div>
              <h2 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight font-sans">
                Student Answer Key Logs / Gradebooks
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit precise submissions, selected keys, accuracies, letter grades, and date metrics.
              </p>
            </div>
            
            <div className="relative w-full sm:w-72">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search by student name or code..."
                value={resultsSearchQuery}
                onChange={(e) => setResultsSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs text-slate-705 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-850 dark:bg-slate-900 dark:text-slate-300"
                id="results-search-ledger-input"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/80 dark:border-white/10 dark:bg-slate-950/80 shadow-xl backdrop-blur-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-455 font-mono font-bold dark:border-slate-800 dark:bg-slate-800/40">
                  <th className="px-5 py-3">Examinee Name</th>
                  <th className="px-5 py-3">Syllabus / Exam</th>
                  <th className="px-5 py-3 text-center">Score Ratio</th>
                  <th className="px-5 py-3 text-center">Accuracy %</th>
                  <th className="px-5 py-3 text-center">Grade</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-right">Completion Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-705 dark:text-slate-300">
                {filteredAttempts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-6 text-center text-slate-400">
                      No matching candidate response sheets logged on this filter.
                    </td>
                  </tr>
                ) : (
                  filteredAttempts.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50/25 dark:hover:bg-slate-805/30 transition">
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-850 dark:text-slate-100">{att.studentName}</p>
                        <p className="text-[10px] font-mono text-slate-450 mt-0.5">User: {att.studentUsername}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-805 dark:text-slate-200">{att.examTitle}</p>
                        <p className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 mt-0.5">{att.courseCode}</p>
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono">
                        {att.score} / {att.totalPoints}
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono font-bold">
                        {att.percent}%
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-block font-mono font-bold px-1.5 py-0.5 rounded text-[10.5px] ${
                          att.status === 'Pass' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/20'
                        }`}>
                          {att.grade}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[9.5px] font-bold ${
                          att.status === 'Pass'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-450'
                        }`}>
                          {att.status === 'Pass' ? 'PASS' : 'FAIL'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-slate-400">
                        {new Date(att.timestamp).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DIALOG 1: ADD / EDIT EXAM MODAL */}
      {showExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleSaveExam}
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-slide-up space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {editingExam ? 'Edit Syllabus Parameter' : 'Deploy New Syllabus'}
              </h3>
              <button
                type="button"
                onClick={() => setShowExamModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Examination Title
                </label>
                <input
                  type="text"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="e.g. Advanced Machine Learning Concepts"
                  className="w-full rounded-lg border border-slate-205 px-3 py-2 text-xs bg-white text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none dark:border-slate-7D0 dark:bg-slate-850 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Course Code ID
                  </label>
                  <input
                    type="text"
                    value={examCode}
                    onChange={(e) => setExamCode(e.target.value)}
                    placeholder="e.g. CS-401"
                    className="w-full rounded-lg border border-slate-205 px-3 py-2 text-xs bg-white text-slate-850 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none dark:border-slate-7D0 dark:bg-slate-850 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={examDur}
                    onChange={(e) => setExamDur(Number(e.target.value))}
                    min={5}
                    max={180}
                    className="w-full rounded-lg border border-slate-250 px-3 py-2 text-xs bg-white text-slate-850 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none dark:border-slate-7D0 dark:bg-slate-850 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Syllabus Description
                </label>
                <textarea
                  value={examDesc}
                  onChange={(e) => setExamDesc(e.target.value)}
                  placeholder="Enter deep syllabus rules, target metrics, or criteria..."
                  rows={3}
                  className="w-full rounded-lg border border-slate-205 px-3 py-2 text-xs bg-white text-slate-850 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none dark:border-slate-7D0 dark:bg-slate-850 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowExamModal(false)}
                className="rounded-lg px-4.5 py-1.5 text-xs font-semibold text-slate-550 hover:bg-slate-100"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition flex items-center gap-1 shadow shadow-blue-500/10"
              >
                <Save className="h-4 w-4" />
                <span>Save Syllabus Configuration</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DIALOG 2: ADD / EDIT QUESTION MODAL */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleSaveQuestion}
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-slide-up space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {editingQuestion ? 'Edit MCQ Question details' : 'Deploy New MCQ Question'}
              </h3>
              <button
                type="button"
                onClick={() => setShowQuestionModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-805"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              
              {/* Select Syllabus exam target */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-350 mb-1">
                  Target Exam Modules
                </label>
                <select
                  value={targetExamId}
                  onChange={(e) => setTargetExamId(e.target.value)}
                  className="w-full rounded-lg border border-slate-250 p-2 text-xs bg-white text-slate-800 dark:bg-slate-850 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
                  disabled={!!editingQuestion}
                  required
                >
                  {exams.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      ({ex.courseCode}) {ex.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Question text */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-350 mb-1">
                  Question Query Text
                </label>
                <input
                  type="text"
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder="e.g. Which of the following is an idempotent HTTP verb?"
                  className="w-full rounded-lg border border-slate-205 px-3 py-2 bg-white text-slate-850 focus:border-blue-505 outline-none dark:bg-slate-850 dark:text-white"
                  required
                />
              </div>

              {/* Options details */}
              <div className="space-y-2.5">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  Multiple Choice Options (Index key)
                </label>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono">Option A:</label>
                    <input
                      type="text"
                      value={qOptA}
                      onChange={(e) => setQOptA(e.target.value)}
                      placeholder="e.g. POST"
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 bg-white text-slate-800 dark:bg-slate-850 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono">Option B:</label>
                    <input
                      type="text"
                      value={qOptB}
                      onChange={(e) => setQOptB(e.target.value)}
                      placeholder="e.g. GET"
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 bg-white text-slate-800 dark:bg-slate-850 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono">Option C (Optional):</label>
                    <input
                      type="text"
                      value={qOptC}
                      onChange={(e) => setQOptC(e.target.value)}
                      placeholder="e.g. PATCH"
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 bg-white text-slate-800 dark:bg-slate-850 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono">Option D (Optional):</label>
                    <input
                      type="text"
                      value={qOptD}
                      onChange={(e) => setQOptD(e.target.value)}
                      placeholder="e.g. CONNECT"
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 bg-white text-slate-800 dark:bg-slate-850 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Correct answer and points weight selection */}
              <div className="grid grid-cols-2 gap-3.5 pt-1.5">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-350 mb-1">
                    Correct Option Index
                  </label>
                  <select
                    value={qCorrect}
                    onChange={(e) => setQCorrect(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-250 p-2 bg-white text-slate-800 dark:bg-slate-850 dark:text-white"
                    required
                  >
                    <option value={0}>Option A is Correct</option>
                    <option value={1}>Option B is Correct</option>
                    <option value={2}>Option C is Correct</option>
                    <option value={3}>Option D is Correct</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-350 mb-1">
                    Points Weighted
                  </label>
                  <input
                    type="number"
                    value={qPoints}
                    onChange={(e) => setQPoints(Number(e.target.value))}
                    min={1}
                    max={20}
                    className="w-full rounded-lg border border-slate-250 px-3 py-1.5 bg-white text-slate-850 dark:bg-slate-850 dark:text-white"
                    required
                  />
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-3.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowQuestionModal(false)}
                className="rounded-lg px-4.5 py-1.5 text-xs font-semibold text-slate-550 hover:bg-slate-100"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition flex items-center gap-1 shadow shadow-blue-500/10"
              >
                <Save className="h-4 w-4" />
                <span>Commit Question</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Flag,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Play,
  Save,
  CheckCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { Exam, Question } from '../types';

interface ExamViewProps {
  exam: Exam;
  onSubmitExam: (answers: Record<string, number>, flaggedQuestions: string[]) => void;
  onCancelExam: () => void;
}

export default function ExamView({ exam, onSubmitExam, onCancelExam }: ExamViewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<string[]>([]);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(exam.durationMinutes * 60);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [autoSavedFlash, setAutoSavedFlash] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved progress from localStorage if student refreshes or resumes unexpectedly
  useEffect(() => {
    const cacheKey = `kpc_exam_cache_${exam.id}`;
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.flaggedQuestions) setFlaggedQuestions(parsed.flaggedQuestions);
        if (parsed.timeLeftSeconds) setTimeLeftSeconds(parsed.timeLeftSeconds);
      } catch (e) {
        console.error('Error parsing exam cached recovery state:', e);
      }
    }
  }, [exam.id]);

  // Sync state changes with robust local storage for backup recovery (auto-save feature)
  useEffect(() => {
    const cacheKey = `kpc_exam_cache_${exam.id}`;
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        answers,
        flaggedQuestions,
        timeLeftSeconds,
      })
    );

    // Briefly flash a "saved" message to give peace of mind
    setAutoSavedFlash(true);
    const timeout = setTimeout(() => setAutoSavedFlash(false), 900);
    return () => clearTimeout(timeout);
  }, [answers, flaggedQuestions, timeLeftSeconds, exam.id]);

  // Timer implementation
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleAutoSubmit = () => {
    // Clear cache immediately on submit
    localStorage.removeItem(`kpc_exam_cache_${exam.id}`);
    alert('Time limit has expired! Your proctored answers are being automatically finalized and submitted.');
    onSubmitExam(answers, flaggedQuestions);
  };

  const handleManualSubmit = () => {
    localStorage.removeItem(`kpc_exam_cache_${exam.id}`);
    onSubmitExam(answers, flaggedQuestions);
  };

  const selectOption = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  // Format seconds to high precision stopwatch
  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQuestion = exam.questions[currentQuestionIndex];
  const attemptedCount = Object.keys(answers).length;
  const totalQuestions = exam.questions.length;
  const progressPercent = Math.round((attemptedCount / totalQuestions) * 100);

  // Time warnings
  const isTimeCritical = timeLeftSeconds < 120; // less than 2 mins

  return (
    <div className="flex flex-1 flex-col md:flex-row overflow-hidden h-[calc(100vh-4rem)] bg-transparent transition-all duration-300">
      
      {/* 1. MAIN TESTING CANVAS PANEL (LEFT/CENTER) */}
      <div className="flex flex-1 flex-col overflow-y-auto p-4 md:p-6 space-y-5">
        
        {/* Exam Dynamic Supervision Header */}
        <div className="rounded-2xl border border-white/20 bg-white/40 dark:border-white/10 dark:bg-slate-950/20 shadow-lg backdrop-blur-md p-4 transition-all duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-150 dark:bg-blue-905 px-2 py-0.5 text-[10px] font-mono font-bold text-blue-700 dark:text-blue-300">
                  {exam.courseCode} PROCTORED ACTIVE ASSESSMENT
                </span>
                {autoSavedFlash && (
                  <span className="text-[10px] text-emerald-500 font-mono animate-fade-in flex items-center gap-0.5">
                    <Save className="h-3 w-3" /> Auto-saved
                  </span>
                )}
              </div>
              <h2 className="mt-1 text-sm md:text-base font-black text-slate-900 dark:text-white tracking-tight">
                {exam.title}
              </h2>
            </div>

            {/* Countdown Clock Face */}
            <div className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 border font-mono font-bold transition-all duration-300 shadow-sm ${
              isTimeCritical
                ? 'bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950/20 dark:border-rose-800 dark:text-rose-450 animate-pulse'
                : 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/20 dark:border-indigo-850 dark:text-indigo-300'
            }`}>
              <Clock className={`h-4.5 w-4.5 ${isTimeCritical ? 'animate-spin' : ''}`} />
              <div className="text-right">
                <p className="text-[9px] uppercase tracking-wider text-slate-400">Timer Remaining</p>
                <p className="text-base font-black leading-none mt-0.5">{formatTime(timeLeftSeconds)}</p>
              </div>
            </div>
          </div>

          {/* Progress Tracker Bar */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span>Exam Progress Tracker</span>
              <span>{attemptedCount} of {totalQuestions} Answered ({progressPercent}%)</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* ACTIVE QUESTION PANEL CARD */}
        {currentQuestion ? (
          <div className="rounded-2xl border border-white/20 bg-white/75 dark:border-white/10 dark:bg-slate-950/70 p-6 shadow-xl backdrop-blur-md flex-1 flex flex-col justify-between space-y-6">
            
            <div className="space-y-5">
              
              {/* Question Indexing Metadata bar */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                  +{currentQuestion.points} Point Value
                </span>
              </div>

              {/* The Question Text */}
              <h3 className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-100 leading-relaxed font-sans">
                {currentQuestion.text}
              </h3>

              {/* Four MCQ options rendered as clickable panels */}
              <div className="space-y-3.5 pt-2" id="question-options-container">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = answers[currentQuestion.id] === index;
                  return (
                    <button
                      key={index}
                      onClick={() => selectOption(currentQuestion.id, index)}
                      className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left text-xs font-medium transition-all duration-150 hover:bg-slate-50 dark:hover:bg-slate-850/30 group ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-500/10 dark:border-blue-500 dark:bg-blue-950/20 dark:text-blue-200'
                          : 'border-slate-200 bg-transparent text-slate-700 dark:border-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {/* Check radio indicator */}
                      <span className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                        isSelected
                          ? 'border-blue-600 bg-blue-650 text-white dark:border-blue-500'
                          : 'border-slate-300 bg-white text-transparent group-hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800'
                      }`}>
                        {isSelected ? '✓' : ''}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Bottom Question Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-slate-100 dark:border-slate-800">
              
              {/* Flag / Review Switch */}
              <button
                onClick={() => toggleFlag(currentQuestion.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold tracking-wide transition-colors ${
                  flaggedQuestions.includes(currentQuestion.id)
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                    : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-850'
                }`}
                id="flag-question-btn"
              >
                <Flag className={`h-4 w-4 ${flaggedQuestions.includes(currentQuestion.id) ? 'fill-amber-505' : ''}`} />
                <span>{flaggedQuestions.includes(currentQuestion.id) ? 'Bookmarked for Review' : 'Mark for Review'}</span>
              </button>

              {/* Prev / Next navigation tabs */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className={`flex items-center gap-1 rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                    currentQuestionIndex === 0
                      ? 'text-slate-300 cursor-not-allowed dark:text-slate-705'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-350 dark:hover:bg-slate-800'
                  }`}
                  id="prev-question-btn"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                {currentQuestionIndex < totalQuestions - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="flex items-center gap-1 rounded-lg bg-blue-600 px-4.5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
                    id="next-question-btn"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-md shadow-emerald-500/20 active:scale-95 transition"
                    id="finish-exam-btn"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Finish Assessment</span>
                  </button>
                )}
              </div>

            </div>

          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
            <HelpCircle className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
            <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">Loading syllabus coordinates...</p>
          </div>
        )}

      </div>

      {/* 2. QUESTION NAV GRID BOARD (RIGHT SIDEBAR ON WEB, COLLAPSIBLE PANEL) */}
      <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-white/15 bg-white/10 dark:bg-slate-950/40 backdrop-blur-xl flex flex-col justify-between overflow-y-auto">
        
        {/* Sidebar Info Section */}
        <div className="p-4 md:p-5 space-y-5">
          
          <div>
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
              Exam Hall Board Key
            </h3>
            <p className="text-[10.5px] text-slate-450 dark:text-slate-400 mt-0.5 leading-relaxed">
              Navigate quickly to any question below to inspect or submit options.
            </p>
          </div>

          {/* Quick Info Grid Legend and Badges */}
          <div className="grid grid-cols-3 gap-2 text-[10px] font-medium text-slate-500">
            <div className="flex flex-col items-center rounded-lg border border-slate-100 p-1.5 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/20">
              <span className="h-2 w-2 rounded-full bg-blue-600 mb-1" />
              <span>Answered</span>
            </div>
            <div className="flex flex-col items-center rounded-lg border border-slate-100 p-1.5 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/20">
              <span className="h-2 w-2 rounded-full bg-amber-500 mb-1" />
              <span>Flagged</span>
            </div>
            <div className="flex flex-col items-center rounded-lg border border-slate-100 p-1.5 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/20">
              <span className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700 mb-1" />
              <span>Unvisited</span>
            </div>
          </div>

          {/* COLOR-CODED INTERACTIVE NUMERICAL DIALER PALETTE GRID */}
          <div className="space-y-2.5">
            <p className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400">
              Question Palette Canvas
            </p>
            <div className="grid grid-cols-5 gap-2.5" id="questions-palette-grid">
              {exam.questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isFlagged = flaggedQuestions.includes(q.id);
                const isActive = idx === currentQuestionIndex;

                let colorStyles = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700';
                if (isAnswered) {
                  colorStyles = 'bg-blue-600 text-white shadow-sm shadow-blue-500/10 font-bold';
                }
                if (isFlagged) {
                  colorStyles = 'bg-amber-500 text-white shadow-sm shadow-amber-500/10 font-bold';
                }
                if (isActive) {
                  colorStyles = 'bg-indigo-900 text-white ring-2 ring-indigo-455 font-black scale-105';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-mono transition-all ${colorStyles}`}
                    title={`Jump to Question ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Supervised proctor statement card */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3.5 dark:border-blue-900/30 dark:bg-blue-950/20">
            <div className="flex items-start gap-2.5 text-blue-800 dark:text-blue-300">
              <HelpCircle className="h-4.5 w-4.5 shrink-0 mt-0.5 text-blue-550" />
              <div className="text-[11px] leading-relaxed">
                <p className="font-bold">Proctored Sandbox Active</p>
                <p className="mt-0.5 text-slate-500 dark:text-slate-400">
                  Any navigation outside this window is logged. If you experience technical disruptions, local answers carry state recovery options.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar Footer Action */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col gap-2.5">
          <button
            onClick={() => setShowSubmitModal(true)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md shadow-emerald-500/10 hover:bg-emerald-700 transition active:scale-[0.99]"
            id="sidebar-finish-exam-btn"
          >
            <CheckCircle className="h-4.5 w-4.5" />
            <span>Finish Examination</span>
          </button>
          
          <button
            onClick={() => {
              if (confirm('Cancel Assessment Warning: Leaving early loses current session timer progress and terminates evaluation. Are you sure?')) {
                onCancelExam();
              }
            }}
            className="text-[11px] font-semibold text-slate-450 hover:text-rose-500 hover:underline transition self-center py-1"
          >
            Terminate & Back out
          </button>
        </div>

      </div>

      {/* CONFIRMATION SUBMIT DIALOG / MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-white/25 bg-white/85 dark:border-white/10 dark:bg-slate-950/85 p-6 shadow-2xl backdrop-blur-xl animate-slide-up">
            
            <div className="text-center space-y-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="mx-auto rounded-full bg-emerald-100 p-3 text-emerald-650 dark:bg-emerald-950/40 inline-flex">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Submit Online Academic Portfolio
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                You are about to transmit your answers to Katrat Polytechnic Evaluation Board. This is irreversible.
              </p>
            </div>

            <div className="my-4 py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-850 text-xs text-slate-650 dark:text-slate-350 space-y-2">
              <div className="flex items-center justify-between">
                <span>Total Exam MCQ Questions:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-white">{totalQuestions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Attempted Solutions:</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{attemptedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Flagged Unfinished Queries:</span>
                <span className="font-mono font-bold text-amber-500">{flaggedQuestions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Remaining Clock Time:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-white">{formatTime(timeLeftSeconds)}</span>
              </div>
            </div>

            {attemptedCount < totalQuestions && (
              <div className="flex items-start gap-2.5 rounded-lg bg-amber-50 p-3 text-xs text-amber-850 border border-amber-200/40 mb-4 dark:bg-amber-950/10 dark:text-amber-450">
                <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-amber-550 mt-0.5" />
                <p>
                  <b>Warning</b>: You have left <b>{totalQuestions - attemptedCount}</b> questions completely unanswered. Unanswered MCQs carry no partial points.
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:text-slate-400"
              >
                Go Back to Questions
              </button>
              <button
                onClick={handleManualSubmit}
                className="rounded-xl bg-emerald-650 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-705 active:scale-95 transition"
                id="modal-confirm-submit-btn"
              >
                Transmit & Logout Exam
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

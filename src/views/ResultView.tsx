import React, { useState } from 'react';
import {
  Award,
  ChevronLeft,
  Printer,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BookOpen,
  Calendar,
  Check,
  X,
  FileText
} from 'lucide-react';
import { Exam, Attempt } from '../types';

interface ResultViewProps {
  attempt: Attempt;
  exam: Exam; // Syllabus info to back out detailed reviews
  onBackToDashboard: () => void;
}

export default function ResultView({ attempt, exam, onBackToDashboard }: ResultViewProps) {
  const [showQuestionsReview, setShowQuestionsReview] = useState(true);

  // Trigger browser print dialog styled for paper layouts
  const handlePrint = () => {
    window.print();
  };

  const isPassed = attempt.status === 'Pass';

  return (
    <div className="flex-1 space-y-6 overflow-y-auto p-4 md:p-6 bg-transparent transition-all duration-300 print:bg-white print:p-0">
      
      {/* Printable Control bar */}
      <div className="flex items-center justify-between border-b border-white/15 pb-4 print:hidden">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-1 text-xs font-bold text-white hover:text-blue-100 transition"
          id="result-back-dashboard-btn"
        >
          <ChevronLeft className="h-4.5 w-4.5" />
          <span>Exit Transcript Report</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4.5 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition-all active:scale-95 shadow-sm"
          id="print-transcript-btn"
        >
          <Printer className="h-4 w-4" />
          <span>Print Formal Transcript</span>
        </button>
      </div>

      {/* TRANSCRIPT CARD LAYOUT */}
      <div className="rounded-2xl border border-white/20 bg-white/75 dark:border-white/10 dark:bg-slate-950/70 p-6 shadow-xl backdrop-blur-md transition-all duration-300 relative overflow-hidden print:border-0 print:shadow-none">
        
        {/* Collegiate watermark borders */}
        <div className={`absolute top-0 inset-x-0 h-2.5 ${isPassed ? 'bg-emerald-500' : 'bg-rose-500'}`} />

        {/* Certificate / Transcript Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1.5">
            <span className="rounded bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              OFFICIAL EXAMINATION TRANSCRIPT
            </span>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
              Katrat Polytechnic College Grade Sheet
            </h1>
            <p className="text-xs text-slate-450 dark:text-slate-400">
              Assessed via Computerized Supervision Proctor Code CS-2026.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center rounded-full p-2 ${
              isPassed ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/35' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/35'
            }`}>
              {isPassed ? <CheckCircle2 className="h-10 w-10 md:h-12 md:w-12" /> : <XCircle className="h-10 w-10 md:h-12 md:w-12" />}
            </div>
            
            <div>
              <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Proctor Status</p>
              <h3 className={`text-base md:text-lg font-black ${isPassed ? 'text-emerald-650' : 'text-rose-650'}`}>
                {isPassed ? 'PASSED' : 'FAILED'}
              </h3>
            </div>
          </div>
        </div>

        {/* Candidate Detail panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-5 border-b border-slate-100 dark:border-slate-800 text-xs">
          <div className="space-y-1.5">
            <p className="text-slate-400 font-mono tracking-widest uppercase text-[10px]">Examinee Candidate</p>
            <p className="font-bold text-slate-800 dark:text-slate-200">{attempt.studentName}</p>
            <p className="text-slate-500 font-mono text-[10.5px]">Username: {attempt.studentUsername}</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-slate-400 font-mono tracking-widest uppercase text-[10px]">Syllabus Assessment</p>
            <p className="font-bold text-slate-800 dark:text-slate-200">{attempt.examTitle}</p>
            <p className="text-slate-500 font-mono text-[10.5px]">Course Code: {attempt.courseCode}</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-slate-400 font-mono tracking-widest uppercase text-[10px]">Session Completed At</p>
            <p className="font-bold text-slate-800 dark:text-slate-200">
              {new Date(attempt.timestamp).toLocaleDateString(undefined, {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
            <p className="text-slate-500 font-mono text-[10.5px]">
              Time: {new Date(attempt.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* METRICS GRID SUMMARY */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 p-4 rounded-xl mt-5 dark:bg-slate-850/30">
          
          <div className="text-center md:border-r border-slate-150 dark:border-slate-750">
            <p className="text-[10px] font-mono tracking-widest text-slate-450 uppercase">Score Earned</p>
            <p className="text-lg font-black text-slate-800 dark:text-slate-100 mt-1 font-mono">
              {attempt.score} <span className="text-slate-400 text-xs font-normal">/ {attempt.totalPoints}</span>
            </p>
            <span className="text-[10px] text-slate-450">Points</span>
          </div>

          <div className="text-center md:border-r border-slate-150 dark:border-slate-750">
            <p className="text-[10px] font-mono tracking-widest text-slate-450 uppercase">Percent Score</p>
            <p className="text-lg font-black text-blue-600 dark:text-blue-400 mt-1 font-mono">
              {attempt.percent}%
            </p>
            <span className="text-[10px] text-slate-450">Aggregated Total</span>
          </div>

          <div className="text-center md:border-r border-slate-150 dark:border-slate-750">
            <p className="text-[10px] font-mono tracking-widest text-slate-450 uppercase">Earned Letter Grade</p>
            <p className={`text-lg font-black mt-1 font-mono ${isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
              {attempt.grade}
            </p>
            <span className="text-[10px] text-slate-450">Academic Scale</span>
          </div>

          <div className="text-center">
            <p className="text-[10px] font-mono tracking-widest text-slate-450 uppercase">Question Stats</p>
            <div className="flex justify-center gap-3 mt-1.5 text-xs font-bold shrink-0">
              <span className="text-emerald-600 dark:text-emerald-450" title="Correct">
                {attempt.correctAnswers}✓
              </span>
              <span className="text-rose-650" title="Wrong">
                {attempt.wrongAnswers}✗
              </span>
              <span className="text-slate-450" title="Attempted">
                {attempt.attemptedCount} / {exam.questions.length} Solved
              </span>
            </div>
            <span className="text-[9px] text-slate-400 uppercase font-mono block mt-1">Accuracy Audit</span>
          </div>

        </div>

        {/* TRANSCRIPT VERIFICATION FOOTER FOR PRINTING */}
        <div className="hidden print:flex flex-col items-end pt-12 pb-4 text-xs font-sans space-y-1.5 self-end">
          <div className="border-t border-slate-400 w-44 text-center pt-1 mt-4">
            <p className="font-bold">Prof. Helen Roberts</p>
            <p className="text-[10px] text-slate-500">Board Exam Superproctor</p>
          </div>
          <span className="text-[8px] text-slate-400 font-mono uppercase text-right">
            System verification Hash: SHA-256 KPC842-88B9AC9E881
          </span>
        </div>

      </div>

      {/* QUESTION BY QUESTION RETROSPECTIVE SHEET */}
      {showQuestionsReview && (
        <div className="rounded-2xl border border-white/20 bg-white/75 dark:border-white/10 dark:bg-slate-950/70 p-5 shadow-lg backdrop-blur-md space-y-4 print:mt-6">
          <div className="flex items-center gap-1.5 border-b border-slate-105 pb-3">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Candidate Response & Grading Breakdown keys
            </h3>
          </div>

          <div className="space-y-6 divide-y divide-slate-150 dark:divide-slate-800">
            {exam.questions.map((q, idx) => {
              const studentAnswerIdx = attempt.answers[q.id];
              const isAnswerCorrect = studentAnswerIdx === q.correctOption;
              const hasAttempted = studentAnswerIdx !== undefined;

              return (
                <div key={q.id} className={`pt-5 first:pt-0 space-y-3.5`}>
                  
                  {/* Title & Point weight info */}
                  <div className="flex items-start justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 font-bold font-mono text-slate-700 dark:text-slate-350">
                        Q{idx + 1}
                      </span>
                      
                      {hasAttempted ? (
                        isAnswerCorrect ? (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-650 bg-emerald-50 px-2 py-0.5 rounded dark:bg-emerald-950/20">
                            Correct (+{q.points} pt)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-650 bg-rose-50 px-2 py-0.5 rounded dark:bg-rose-950/20">
                            Wrong Option (0 pt)
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-slate-455 bg-slate-102 px-2 py-0.5 rounded">
                          Unanswered (0 pt)
                        </span>
                      )}
                    </div>

                    <span className="font-mono text-slate-400 block shrink-0">
                      Syllabus Point: {q.points} Points
                    </span>
                  </div>

                  {/* Question Text */}
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-150 leading-relaxed pl-1">
                    {q.text}
                  </h4>

                  {/* Render all options indicating performance key */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pl-1">
                    {q.options.map((option, opIdx) => {
                      const isOptionCorrect = opIdx === q.correctOption;
                      const isOptionStudentAnswer = opIdx === studentAnswerIdx;

                      let cellStyles = 'border-slate-150 dark:border-slate-800 bg-transparent text-slate-650 dark:text-slate-350';
                      if (isOptionCorrect) {
                        cellStyles = 'border-emerald-300 bg-emerald-50/40 text-emerald-900 dark:border-emerald-900/35 dark:bg-emerald-950/15 dark:text-emerald-300 font-bold';
                      }
                      if (isOptionStudentAnswer && !isAnswerCorrect) {
                        cellStyles = 'border-rose-200 bg-rose-50/40 text-rose-900 dark:border-rose-900/30 dark:bg-rose-950/15 dark:text-rose-400';
                      }

                      return (
                        <div
                          key={opIdx}
                          className={`flex items-start gap-2.5 rounded-lg border p-3 text-xs transition-all ${cellStyles}`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isOptionCorrect && (
                              <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-450 font-bold" />
                            )}
                            {isOptionStudentAnswer && !isAnswerCorrect && (
                              <X className="h-4 w-4 text-rose-600 dark:text-rose-450" />
                            )}
                            {!isOptionCorrect && (!isOptionStudentAnswer || isAnswerCorrect) && (
                              <span className="inline-block h-4 w-4 rounded-full border border-slate-300 dark:border-slate-800 text-[9px] text-center text-slate-400 pt-0.5 font-mono">
                                {String.fromCharCode(65 + opIdx)}
                              </span>
                            )}
                          </div>
                          
                          <div className="min-w-0">
                            <span className="leading-relaxed break-words">{option}</span>
                            {/* Tags showing matches */}
                            {isOptionStudentAnswer && (
                              <span className="block mt-1 text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest font-mono">
                                Your Chosen Response
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

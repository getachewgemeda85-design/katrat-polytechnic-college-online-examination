import React from 'react';
import {
  BookOpen,
  Award,
  User as UserIcon,
  Database,
  Users,
  BarChart3,
  LogOut,
  X,
  FileSignature,
  FileSpreadsheet
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  currentUser: User | null;
  currentView: string;
  setCurrentView: (view: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  currentUser,
  currentView,
  setCurrentView,
  onLogout,
  isOpen,
  onClose,
}: SidebarProps) {
  if (!currentUser) return null;

  const navigateTo = (viewName: string) => {
    setCurrentView(viewName);
    onClose(); // Self-close on mobile
  };

  const isSelected = (views: string[]) => views.includes(currentView);

  // Define Navigation Nodes of Student
  const studentNav = [
    {
      id: 'student-dashboard',
      label: 'Exam Hall',
      views: ['student-dashboard', 'exam-session'],
      icon: BookOpen,
    },
    {
      id: 'student-results',
      label: 'Performance / Grades',
      views: ['student-results', 'result-summary'],
      icon: Award,
    },
    {
      id: 'student-profile',
      label: 'Student Profile',
      views: ['student-profile'],
      icon: UserIcon,
    },
  ];

  // Define Navigation Nodes of Admin
  const adminNav = [
    {
      id: 'admin',
      label: 'Stats & Overview',
      views: ['admin'],
      icon: BarChart3,
    },
    {
      id: 'admin-exams',
      label: 'Manage Curriculums & Exams',
      views: ['admin-exams'],
      icon: FileSignature,
    },
    {
      id: 'admin-questions',
      label: 'Question Database',
      views: ['admin-questions'],
      icon: Database,
    },
    {
      id: 'admin-results',
      label: 'Student Answer Key Logs',
      views: ['admin-results'],
      icon: FileSpreadsheet,
    },
  ];

  const activeNav = currentUser.role === 'admin' ? adminNav : studentNav;

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/15 bg-white/10 text-white backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-slate-950/40 md:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header with college identity */}
        <div className="flex h-16 items-center justify-between border-b border-white/15 px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-inner">
              🎓
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">
                KPC Polytechnic
              </p>
              <p className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">
                Academic Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
            title="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="border-b border-white/15 bg-white/5 dark:bg-slate-950/30 p-4">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="h-9 w-9 rounded-full object-cover ring-2 ring-white/20"
            />
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-xs font-bold text-white">
                {currentUser.name}
              </h4>
              <p className="truncate text-[10px] font-mono text-white/70">
                {currentUser.studentId || (currentUser.role === 'admin' ? 'Faculty Admin' : 'Student')}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto">
          <p className="px-3.5 py-1 text-[9px] font-mono font-bold tracking-widest text-white/50 uppercase">
            Menu Navigation
          </p>
          {activeNav.map((item) => {
            const Icon = item.icon;
            const active = isSelected(item.views);
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-medium transition-all ${
                  active
                    ? 'bg-white text-blue-900 font-extrabold shadow-lg shadow-black/10'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 shrink-0 ${active ? 'text-blue-900' : 'text-white/60'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer/Logout Action */}
        <div className="border-t border-white/15 p-3 bg-white/5 dark:bg-slate-950/25">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-medium text-rose-300 hover:bg-rose-500/10 hover:text-rose-100 transition-all"
            id="sidebar-logout-btn"
          >
            <LogOut className="h-4.5 w-4.5 text-rose-300" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>
    </>
  );
}

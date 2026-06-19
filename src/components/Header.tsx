import React, { useState, useRef, useEffect } from 'react';
import { Bell, Sun, Moon, LogOut, Menu, User as UserIcon, ShieldAlert, Check } from 'lucide-react';
import { User, Notification } from '../types';
import Logo from './Logo';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
  onToggleSidebar: () => void;
  notifications: Notification[];
  onMarkNotificationRead: (id: string) => void;
  onClearNotifications: () => void;
  setCurrentView: (view: string) => void;
}

export default function Header({
  currentUser,
  onLogout,
  darkMode,
  setDarkMode,
  onToggleSidebar,
  notifications,
  onMarkNotificationRead,
  onClearNotifications,
  setCurrentView,
}: HeaderProps) {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Auto-close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-white/20 bg-white/10 px-4 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/45 transition-colors duration-200">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden transition-all"
          title="Toggle Sidebar"
          id="toggle-sidebar-mobile-btn"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Logo size="sm" className="hidden sm:flex" />
        {/* Shortened logo identity for ultra-slim viewports */}
        <div className="flex sm:hidden items-center gap-1.5 font-bold text-slate-900 dark:text-white">
          <span className="text-blue-600">KPC</span> Exam
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all duration-200"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          id="dark-mode-toggle-btn"
        >
          {darkMode ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-blue-600" />}
        </button>

        {/* Notifications Dropdown */}
        {currentUser && (
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                setShowProfileDropdown(false);
              }}
              className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all duration-200"
              title="View Alerts"
              id="notifications-bell-btn"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white animated pulse duration-1000 infinite">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2.5 w-80 rounded-xl border border-white/20 bg-white/85 dark:bg-slate-950/85 shadow-2xl backdrop-blur-xl overflow-hidden ring-1 ring-black/5 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Notifications
                  </h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={onClearNotifications}
                      className="text-xs font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400">
                      <Bell className="h-8 w-8 mb-2 opacity-40 text-slate-400" />
                      <p className="text-xs">No active notices</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3.5 transition-colors duration-150 ${
                          notif.read ? 'bg-transparent' : 'bg-blue-50/35 dark:bg-blue-900/10'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                            {notif.title}
                          </h4>
                          {!notif.read && (
                            <button
                              onClick={() => onMarkNotificationRead(notif.id)}
                              className="text-[10px] text-blue-600 hover:underline dark:text-blue-400 flex items-center gap-0.5"
                              title="Mark as Read"
                            >
                              <Check className="h-3 w-3" /> Mark
                            </button>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {notif.message}
                        </p>
                        <span className="mt-1.5 block text-[9px] font-mono text-slate-400">
                          {notif.time}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* User Profile / Menu */}
        {currentUser ? (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown);
                setShowNotifDropdown(false);
              }}
              className="flex items-center gap-2.5 rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-left"
              id="user-profile-menu-btn"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="h-8 w-8 rounded-full border border-slate-200 object-cover dark:border-slate-800"
              />
              <div className="hidden lg:block">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {currentUser.name}
                </p>
                <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 capitalize">
                  {currentUser.role}
                </p>
              </div>
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2.5 w-60 rounded-xl border border-white/20 bg-white/85 dark:bg-slate-950/85 p-2 shadow-2xl backdrop-blur-xl overflow-hidden ring-1 ring-black/5 animate-fade-in">
                <div className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg mb-1.5">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {currentUser.department || 'Katrat Technology Student'}
                  </p>
                  {currentUser.studentId && (
                    <p className="text-[9px] font-mono mt-1 text-blue-600 dark:text-blue-400 font-bold bg-blue-100/40 dark:bg-blue-900/40 px-1.5 py-0.5 rounded inline-block">
                      ID: {currentUser.studentId}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    setCurrentView(currentUser.role === 'admin' ? 'admin' : 'student-dashboard');
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                >
                  <UserIcon className="h-4 w-4" />
                  My Dashboard
                </button>

                <div className="my-1.5 border-t border-slate-100 dark:border-slate-850" />

                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    onLogout();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 transition-colors"
                  id="header-logout-btn"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg border border-blue-100/50 dark:border-blue-800/50">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 ring-2 ring-amber-200 dark:ring-amber-900" />
            <p className="text-[10.5px] font-medium text-blue-800 dark:text-blue-300 font-mono tracking-wider">
              PORTAL LOCKED
            </p>
          </div>
        )}
      </div>
    </header>
  );
}

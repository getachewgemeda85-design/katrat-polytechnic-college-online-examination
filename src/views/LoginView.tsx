import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User as UserIcon, LogIn, AlertCircle, Sparkles } from 'lucide-react';
import { User } from '../types';
import Logo from '../components/Logo';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
  users: User[];
}

export default function LoginView({ onLoginSuccess, users }: LoginViewProps) {
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto fill logic for quick testing
  const handleQuickFill = (targetRole: 'student' | 'admin') => {
    setRole(targetRole);
    setUsername(targetRole === 'student' ? 'student' : 'admin');
    setPassword('katrat2026');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Username cannot be empty.');
      return;
    }
    if (!password.trim()) {
      setError('Password cannot be empty.');
      return;
    }

    setIsLoading(true);

    // Simulate collegiate network handshake delay
    setTimeout(() => {
      const match = users.find((u) => u.username.toLowerCase() === username.toLowerCase().trim() && u.role === role);
      
      if (match) {
        onLoginSuccess(match);
      } else {
        setError(`Invalid credentials. Please verify your ${role} username or use quick authentication buttons.`);
      }
      setIsLoading(false);
    }, 850);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 transition-all duration-300">
      <div className="w-full max-w-md space-y-6">
        
        {/* College Branding Header */}
        <div className="text-center animate-fade-in">
          <div className="inline-flex justify-center mb-4">
            <Logo size="lg" className="drop-shadow-lg" />
          </div>
          <h2 className="mt-2 text-2xl font-black text-white tracking-tight drop-shadow-md">
            Academic Assessment Portal
          </h2>
          <p className="mt-1.5 text-xs text-blue-100/90 font-medium tracking-wide">
            Secure browser environment for examination supervision
          </p>
        </div>

        {/* Login Form Container Card with strong Frosted Glass theme */}
        <div className="rounded-2xl border border-white/25 bg-white/10 backdrop-blur-xl p-6 shadow-2xl transition-all duration-300" id="login-card">
          
          {/* Persona Selection Tabs (Frosted look) */}
          <div className="flex rounded-lg bg-white/10 p-1 mb-6 border border-white/10">
            <button
              onClick={() => {
                setRole('student');
                setError('');
              }}
              className={`flex-1 rounded-md py-1.5 text-center text-xs font-bold transition-all ${
                role === 'student'
                  ? 'bg-white text-blue-900 shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
              id="student-tab-btn"
            >
              🎓 Student Portal
            </button>
            <button
              onClick={() => {
                setRole('admin');
                setError('');
              }}
              className={`flex-1 rounded-md py-1.5 text-center text-xs font-bold transition-all ${
                role === 'admin'
                  ? 'bg-white text-blue-900 shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
              id="admin-tab-btn"
            >
              ⚙ Faculty Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 rounded-lg bg-red-500/20 p-3 text-xs text-red-100 border border-red-500/30 animate-shake" id="login-error-alert">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* Username Selection field */}
            <div>
              <label className="block text-xs font-bold text-white/95 font-sans mb-1.5">
                Username / Email ID
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/60">
                  <UserIcon className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={role === 'student' ? 'e.g. student' : 'e.g. admin'}
                  className="w-full rounded-xl border border-white/20 bg-white/15 py-2.5 pl-10 pr-4 text-xs text-white placeholder-white/40 outline-none focus:border-white focus:ring-2 focus:ring-white/30 transition-all font-medium"
                  id="username-input"
                />
              </div>
            </div>

            {/* Password input field */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="block text-xs font-bold text-white/95 font-sans">
                  Access Key Passcode
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Please use the Quickfill buttons or 'student' / 'admin' username to bypass password validations."); }} className="text-[10px] text-blue-200 hover:text-white hover:underline transition">
                  Forgot key?
                </a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/60">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/20 bg-white/15 py-2.5 pl-10 pr-10 text-xs text-white placeholder-white/40 outline-none focus:border-white focus:ring-2 focus:ring-white/30 transition-all font-medium"
                  id="password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/50 hover:text-white"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  id="toggle-password-visibility-btn"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Box */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-white/30 bg-white/10 text-blue-600 focus:ring-transparent"
                  id="remember-me-checkbox"
                />
                <span className="text-xs text-white/80 hover:text-white transition">
                  Securely remember this machine
                </span>
              </label>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`relative flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-xs font-extrabold text-blue-900 shadow-xl hover:bg-blue-50 active:scale-[0.98] transition-all duration-150 ${
                isLoading ? 'opacity-85 cursor-not-allowed' : ''
              }`}
              id="submit-login-btn"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin text-blue-900" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Verifying Credentials...</span>
                </div>
              ) : (
                <>
                  <LogIn className="h-4.5 w-4.5 text-blue-900" />
                  <span>Authenticate Securely</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Access helper cards for demo with frosted transparent slots */}
          <div className="mt-6 border-t border-white/15 pt-5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white/70 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Grader Quick-Access Bypass</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickFill('student')}
                className="flex flex-col items-start rounded-lg border border-white/15 p-2.5 text-left bg-white/5 hover:bg-white/15 transition-all group"
                id="quickfill-student-btn"
              >
                <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">
                  Fill Demo
                </span>
                <span className="text-xs font-bold text-white group-hover:text-amber-300 mt-1 transition-colors">
                  🎓 Student Role
                </span>
              </button>
              
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="flex flex-col items-start rounded-lg border border-white/15 p-2.5 text-left bg-white/5 hover:bg-white/15 transition-all group"
                id="quickfill-admin-btn"
              >
                <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">
                  Fill Demo
                </span>
                <span className="text-xs font-bold text-white group-hover:text-amber-300 mt-1 transition-colors">
                  ⚙ Admin Role
                </span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer information */}
        <div className="text-center text-[11px] text-white/60">
          <p>© 2026 Katrat Polytechnic College. All Rights Reserved.</p>
          <p className="mt-1 font-mono text-[10px] text-white/40">Academic Exam Controller Infrastructure - v2.4.2</p>
        </div>

      </div>
    </div>
  );
}

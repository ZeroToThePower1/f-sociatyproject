// /client/src/components/Login.js
import React, { useState } from 'react';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  User,
  ShieldCheck,
  Flame
} from './icons';
import { DEMO_ACCOUNTS } from '../utils/authService';

export default function Login({
  onLogin,
  onNavigate,
  initialEmail = ''
}) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle standard login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    try {
      setLoading(true);
      await onLogin({ email, password, rememberMe });
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick filler for demo accounts
  const handleQuickLogin = (demo) => {
    setEmail(demo.email);
    setPassword('password123');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-purple-100 selection:text-purple-900">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-2.5 cursor-pointer group mb-3"
          title="SkillPath Home"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-md shadow-purple-300 group-hover:scale-105 transition-transform">
            <GraduationCap size={26} strokeWidth={2.2} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                Skill<span className="text-purple-600">Path</span>
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                PW Ed
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-500 block -mt-1">
              Smart Course Recommender
            </span>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome Back, Learner! 👋
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">
          Sign in to access your personalized course recommendations and learning roadmap.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/90 shadow-xl space-y-6">
          {/* Error Message Alert */}
          {errorMessage && (
            <div
              className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in"
              role="alert"
            >
              <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-snug">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                Email Address <span className="text-purple-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Password Field with Show/Hide Toggle */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Password <span className="text-purple-600">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  className="text-xs font-bold text-purple-600 hover:text-purple-800 hover:underline transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 border-slate-300 focus:ring-purple-400"
                />
                <span className="text-xs font-medium text-slate-700">Remember Me</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl text-sm font-bold text-white shadow-md shadow-purple-300 transition-all flex items-center justify-center gap-2 ${
                loading
                  ? 'bg-purple-400 cursor-wait'
                  : 'bg-purple-600 hover:bg-purple-700 active:scale-98'
              }`}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Log In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts Selection */}
          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Quick Demo Sign-In:
              </span>
              <span className="text-[10px] text-purple-600 font-semibold bg-purple-50 px-2 py-0.5 rounded-full">
                PW Personas
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-left">
              {DEMO_ACCOUNTS.map((demo) => (
                <button
                  type="button"
                  key={demo.id}
                  onClick={() => handleQuickLogin(demo)}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 bg-slate-50/70 hover:bg-purple-50/40 text-left transition-all group"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-base">{demo.avatar}</span>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-purple-700">
                      {demo.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">
                    {demo.role}
                  </p>
                  <span className="text-[10px] text-purple-700 font-bold block mt-1">
                    Fill &rarr;
                  </span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 text-center">
              Demo password for both accounts: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-purple-700">password123</code>
            </p>
          </div>

          {/* Sign Up Link */}
          <div className="pt-2 text-center text-xs text-slate-600 border-t border-slate-100">
            Don't have an account yet?{' '}
            <button
              onClick={() => onNavigate('signup')}
              className="font-bold text-purple-600 hover:text-purple-800 hover:underline"
            >
              Sign Up for Free
            </button>
          </div>
        </div>

        {/* Security / Demo Disclosure Disclaimer */}
        <div className="mt-6 text-center text-[11px] text-slate-400 space-y-1">
          <p className="flex items-center justify-center gap-1">
            <ShieldCheck size={13} className="text-purple-500" />
            <span>Frontend-Only Demo Auth • Salted SHA-256 Hashing</span>
          </p>
          <p>
            Client-side localStorage demo. Not intended for production sensitive credentials.
          </p>
        </div>
      </div>
    </div>
  );
}
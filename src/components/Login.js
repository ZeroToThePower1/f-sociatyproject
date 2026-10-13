// /client/src/components/Login.jsx
import React, { useState } from 'react';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  User,
} from './icons';
import { supabase } from '../lib/supabaseClient';

export default function Login({ onLogin, onNavigate, initialEmail = '' }) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'

  // ---------- LOGIN ----------
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) return setErrorMessage('Please enter your email address.');
    if (!password) return setErrorMessage('Please enter your password.');

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      if (rememberMe) {
        localStorage.setItem('cc_remember_email', email.trim());
      } else {
        localStorage.removeItem('cc_remember_email');
      }

      setSuccessMessage('✅ Login successful! Redirecting...');

      // Parent ko batao (App.jsx)
      if (onLogin) await onLogin(data.user);
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // ---------- SIGNUP ----------
  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) return setErrorMessage('Please enter your email address.');
    if (!password) return setErrorMessage('Please enter a password.');
    if (password.length < 6) return setErrorMessage('Password must be at least 6 characters.');

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      // Agar "Confirm email" ON hai toh user ko email verify karna padega
      if (data.user && !data.session) {
        setSuccessMessage(
          '✅ Signup successful! Please check your email to confirm your account.'
        );
      } else {
        setSuccessMessage('✅ Signup successful! Logging you in...');
        if (onLogin && data.user) await onLogin(data.user);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  // ---------- FORGOT PASSWORD ----------
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) return setErrorMessage('Please enter your email address.');

    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSuccessMessage('✅ Password reset link sent! Check your email.');
    } catch (err) {
      setErrorMessage(err.message || 'Could not send reset link.');
    } finally {
      setLoading(false);
    }
  };

  // ---------- SUBMIT ROUTER ----------
  const handleSubmit = (e) => {
    if (mode === 'login') return handleLogin(e);
    if (mode === 'signup') return handleSignup(e);
    if (mode === 'forgot') return handleForgotPassword(e);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrorMessage('');
    setSuccessMessage('');
    setPassword('');
  };

  // ---------- UI ----------
  const headingText =
    mode === 'login'
      ? 'Welcome Back, Learner! 👋'
      : mode === 'signup'
      ? 'Create Your Account 🚀'
      : 'Reset Your Password 🔐';

  const subText =
    mode === 'login'
      ? 'Sign in to access your personalized course recommendations and learning roadmap.'
      : mode === 'signup'
      ? 'Join SkillPath and get a personalized learning path tailored to your goals.'
      : 'Enter your email and we will send you a reset link.';

  const buttonText =
    mode === 'login' ? 'Log In' : mode === 'signup' ? 'Sign Up' : 'Send Reset Link';

  const loadingText =
    mode === 'login' ? 'Signing In...' : mode === 'signup' ? 'Creating Account...' : 'Sending...';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-purple-100 selection:text-purple-900">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div
          onClick={() => onNavigate && onNavigate('dashboard')}
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
          {headingText}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">{subText}</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/90 shadow-xl space-y-6">
          {/* Error Alert */}
          {errorMessage && (
            <div
              className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5"
              role="alert"
            >
              <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-snug">{errorMessage}</div>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2.5">
              <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-snug">{successMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
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

            {/* Password (hidden in forgot mode) */}
            {mode !== 'forgot' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                  >
                    Password <span className="text-purple-600">*</span>
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-xs font-bold text-purple-600 hover:text-purple-800 hover:underline transition-colors"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    required
                    minLength={6}
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
                {mode === 'signup' && (
                  <p className="text-[10px] text-slate-400 pl-1">
                    Minimum 6 characters.
                  </p>
                )}
              </div>
            )}

            {/* Remember Me */}
            {mode === 'login' && (
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
            )}

            {/* Submit */}
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
                  <span>{loadingText}</span>
                </>
              ) : (
                <>
                  <span>{buttonText}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Toggle Login <-> Signup */}
          <div className="pt-2 text-center text-xs text-slate-600 border-t border-slate-100 space-y-2">
            {mode === 'login' && (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="font-bold text-purple-600 hover:text-purple-800 hover:underline"
                >
                  Sign Up for Free
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="font-bold text-purple-600 hover:text-purple-800 hover:underline"
                >
                  Log In
                </button>
              </p>
            )}
            {mode === 'forgot' && (
              <p>
                Remembered it?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="font-bold text-purple-600 hover:text-purple-800 hover:underline"
                >
                  Back to Login
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Security footer */}
        <div className="mt-6 text-center text-[11px] text-slate-400 space-y-1">
          <p className="flex items-center justify-center gap-1">
            <ShieldCheck size={13} className="text-purple-500" />
            <span>Secured by Supabase Auth</span>
          </p>
          <p>Your credentials are encrypted and stored securely.</p>
        </div>
      </div>
    </div>
  );
}
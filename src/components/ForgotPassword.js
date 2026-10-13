// /client/src/components/ForgotPassword.js
import React, { useState } from 'react';
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Info,
  Key
} from './icons';
import { requestPasswordReset, resetPasswordDemo } from '../utils/authService';

export default function ForgotPassword({
  onNavigate,
  onResetSuccess
}) {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resetState, setResetState] = useState(null); // { message, canResetDemo: boolean }
  const [resetCompleted, setResetCompleted] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setResetState(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your account email address.');
      return;
    }

    try {
      setLoading(true);
      const res = await requestPasswordReset(email.trim());
      setResetState(res);
    } catch (err) {
      setErrorMessage(err.message || 'Unable to find account with this email.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteDemoReset = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      await resetPasswordDemo(email.trim(), newPassword);
      setResetCompleted(true);
      if (onResetSuccess) {
        onResetSuccess(email.trim());
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update demo password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-purple-100 selection:text-purple-900">
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
          Reset Your Password 🔐
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">
          Enter your registered email address to recover your SkillPath account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/90 shadow-xl space-y-6">
          {/* Disclosure Banner: Stating email is unavailable in this frontend demo */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <Info size={17} className="text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Frontend Demo Notice:</strong> Sending a real reset email is unavailable in this frontend-only client demo. You can simulate resetting your demo password below.
            </div>
          </div>

          {errorMessage && (
            <div
              className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in"
              role="alert"
            >
              <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-snug">{errorMessage}</div>
            </div>
          )}

          {resetCompleted ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 size={26} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Password Updated Successfully!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Your new demo password is saved in local storage. You can now sign in with your updated credentials.
                </p>
              </div>
              <button
                onClick={() => onNavigate('login')}
                className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-purple-300"
              >
                Proceed to Log In
              </button>
            </div>
          ) : resetState ? (
            /* Step 2: Set New Demo Password */
            <form onSubmit={handleCompleteDemoReset} className="space-y-4">
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900">
                <p className="font-semibold">{resetState.message}</p>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="new-password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Set New Demo Password <span className="text-purple-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Key size={16} />
                  </div>
                  <input
                    id="new-password"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min. 6 chars)"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-300 transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Updating Password...' : 'Save New Demo Password'}
              </button>
            </form>
          ) : (
            /* Step 1: Enter email */
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="forgot-email"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Account Email Address <span className="text-purple-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. alex@skillpath.edu"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Tip: You can use pre-seeded demo accounts <code className="font-mono text-purple-700">alex@skillpath.edu</code> or <code className="font-mono text-purple-700">priya@skillpath.edu</code>.
                </p>
              </div>

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
                    <span>Verifying Account...</span>
                  </>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Back to Login Link */}
          <div className="pt-2 text-center text-xs text-slate-600 border-t border-slate-100">
            Remembered your credentials?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="font-bold text-purple-600 hover:text-purple-800 hover:underline"
            >
              Back to Log In
            </button>
          </div>
        </div>

        {/* Security / Demo Disclosure Disclaimer */}
        <div className="mt-6 text-center text-[11px] text-slate-400 space-y-1">
          <p className="flex items-center justify-center gap-1">
            <ShieldCheck size={13} className="text-purple-500" />
            <span>Frontend-Only Demo Auth</span>
          </p>
        </div>
      </div>
    </div>
  );
}
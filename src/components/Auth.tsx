import React, { useState } from 'react';
import { auth, googleProvider, signInWithPopup, signOut, db, doc, setDoc, serverTimestamp } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, UserPlus, ShieldCheck, AlertCircle, Scale, Briefcase, Hash, CheckCircle2, Bot } from 'lucide-react';

const PRIVACY_POLICY = `
LexPH Data Privacy Consent

By signing up for LexPH, you agree to the following:

1. Data Collection: We collect your name, email, Supreme Court Roll of Attorneys number, and legal specialization.
2. Purpose: This data is used to verify your status as a legal professional and to personalize your research experience.
3. Security: Your data is stored securely using industry-standard encryption.
4. Professional Responsibility: You acknowledge that LexPH is an AI-assisted research tool and does not constitute legal advice. You remain responsible for verifying all citations and legal conclusions.
5. Third-Party Services: We use Google for authentication and Gemini AI for research assistance.

You may withdraw your consent at any time by deleting your account.
`;

export const AuthScreen = () => {
  const { user, profile, loading, refreshProfile } = useAuth();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Signup form state
  const [rollNumber, setRollNumber] = useState('');
  const [specialization, setSpecialization] = useState('General Practice');
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Failed to sign in with Google.");
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!privacyConsent) {
      setError("You must accept the data privacy consent to proceed.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        rollNumber,
        specialization,
        role: 'lawyer',
        privacyConsent: true,
        consentDate: serverTimestamp(),
        createdAt: serverTimestamp()
      });
      await refreshProfile();
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "Failed to complete signup.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="w-12 h-12 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    );
  }

  // If logged in but no profile, show signup form
  if (user && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-zinc-200"
        >
          <div className="p-8 bg-zinc-900 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Scale size={32} className="text-zinc-400" />
              <h1 className="text-2xl font-serif font-bold">Complete Your Profile</h1>
            </div>
            <p className="text-zinc-400 text-sm">Welcome, {user.displayName}. Please provide your professional details to access LexPH.</p>
          </div>

          <form onSubmit={handleSignupSubmit} className="p-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-zinc-400 uppercase mb-1 block">Roll of Attorneys Number</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input 
                    type="text" 
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="e.g. 12345"
                    className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-900 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-400 uppercase mb-1 block">Primary Specialization</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <select 
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-900 transition-all appearance-none"
                  >
                    <option>General Practice</option>
                    <option>Civil Litigation</option>
                    <option>Criminal Law</option>
                    <option>Labor & Employment</option>
                    <option>Corporate Law</option>
                    <option>Taxation</option>
                    <option>Family Law</option>
                    <option>Intellectual Property</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
              <h4 className="text-xs font-mono text-zinc-400 uppercase mb-2 flex items-center gap-2">
                <ShieldCheck size={14} /> Data Privacy Consent
              </h4>
              <div className="max-h-32 overflow-y-auto text-[10px] text-zinc-500 mb-4 font-sans whitespace-pre-wrap bg-white p-3 rounded border border-zinc-100">
                {PRIVACY_POLICY}
              </div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={privacyConsent}
                  onChange={(e) => setPrivacyConsent(e.target.checked)}
                  className="mt-1"
                />
                <span className="text-xs text-zinc-600 group-hover:text-zinc-900 transition-colors">
                  I have read and agree to the LexPH Data Privacy Consent. I understand my professional data will be used for verification purposes.
                </span>
              </label>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting || !privacyConsent}
              className="w-full py-3 bg-zinc-900 text-white rounded-xl font-bold shadow-lg hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <UserPlus size={20} />
              )}
              Complete Signup
            </button>

            <button 
              type="button"
              onClick={() => signOut(auth)}
              className="w-full text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              Cancel and Sign Out
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Login Screen
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <div className="inline-flex p-4 bg-zinc-900 text-white rounded-3xl mb-6 shadow-2xl shadow-zinc-200">
            <Scale size={48} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-serif font-bold text-zinc-900 mb-2">LexPH</h1>
          <p className="text-zinc-500 font-serif italic">Advanced Jurisprudence Research for the Philippine Bar</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-zinc-200">
          <h2 className="text-xl font-bold text-zinc-900 mb-6 text-center">Lawyer Login</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button 
              onClick={handleGoogleLogin}
              className="w-full py-4 bg-white border-2 border-zinc-100 rounded-2xl font-bold text-zinc-900 hover:bg-zinc-50 transition-all flex items-center justify-center gap-3 shadow-sm"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-zinc-100">
            <div className="flex items-center gap-4 text-zinc-400 mb-6">
              <div className="flex-1 h-px bg-zinc-100" />
              <span className="text-[10px] font-mono uppercase tracking-widest">Secure Professional Access</span>
              <div className="flex-1 h-px bg-zinc-100" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="mx-auto w-8 h-8 bg-zinc-50 rounded-lg flex items-center justify-center text-zinc-400">
                  <ShieldCheck size={16} />
                </div>
                <p className="text-[10px] font-bold text-zinc-500">Verified</p>
              </div>
              <div className="space-y-2">
                <div className="mx-auto w-8 h-8 bg-zinc-50 rounded-lg flex items-center justify-center text-zinc-400">
                  <CheckCircle2 size={16} />
                </div>
                <p className="text-[10px] font-bold text-zinc-500">Encrypted</p>
              </div>
              <div className="space-y-2">
                <div className="mx-auto w-8 h-8 bg-zinc-50 rounded-lg flex items-center justify-center text-zinc-400">
                  <Bot size={16} />
                </div>
                <p className="text-[10px] font-bold text-zinc-500">AI-Powered</p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-zinc-400">
          By logging in, you agree to our Terms of Service and Professional Conduct Guidelines.
        </p>
      </motion.div>
    </div>
  );
};

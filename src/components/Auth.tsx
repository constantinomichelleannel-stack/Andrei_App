import React, { useState } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  db, 
  doc, 
  setDoc, 
  serverTimestamp,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { PRIVACY_POLICY } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  AlertCircle, 
  Scale, 
  Briefcase, 
  Hash, 
  CheckCircle2, 
  Bot,
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  X
} from 'lucide-react';

export const AuthScreen = () => {
  const { user, profile, loading, refreshProfile, fetchWithAuth } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'google'>('login');
  const [error, setError] = useState<string | null>(null);
  
  // Email/Password state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Signup form state (Profile completion)
  const [rollNumber, setRollNumber] = useState('');
  const [specialization, setSpecialization] = useState('General Practice');
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleLogin = async () => {
    setError(null);
    setIsAuthLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Failed to sign in with Google.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsAuthLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error("Email login error:", err);
      setError(err.message || "Failed to sign in with email.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    setError(null);
    setIsAuthLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      // The onAuthStateChanged will trigger and show the profile completion screen
    } catch (err: any) {
      console.error("Email signup error:", err);
      setError(err.message || "Failed to sign up with email.");
    } finally {
      setIsAuthLoading(false);
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

      // Also sync to local DB via API
      await fetchWithAuth('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rollNumber,
          specialization,
          privacyConsent: true,
          displayName: user.displayName
        })
      });

      await refreshProfile();
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "Failed to complete signup.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="w-12 h-12 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    );
  }

  // If logged in but no profile, show signup form (Profile Completion)
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
          <div className="mb-6 p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-start gap-3">
            <ShieldCheck size={18} className="text-indigo-600 mt-0.5" />
            <div className="text-left">
              <p className="text-xs font-bold text-indigo-900">Privacy Notice</p>
              <p className="text-[10px] text-indigo-700 leading-relaxed">
                LexPH is designed for legal professionals. Your research data is encrypted and used solely for your professional assistance.
              </p>
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-zinc-900 mb-6 text-center">
            {authMode === 'signup' ? 'Create Professional Account' : 'Lawyer Login'}
          </h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="space-y-4">
            {authMode === 'login' ? (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input 
                    type="email" 
                    placeholder="Professional Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isAuthLoading}
                  className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-zinc-200"
                >
                  {isAuthLoading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <LogIn size={20} />}
                  Sign In
                </button>
                <p className="text-center text-sm text-zinc-500">
                  Don't have an account? {' '}
                  <button 
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className="text-zinc-900 font-bold hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleEmailSignup} className="space-y-4">
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                    required
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input 
                    type="email" 
                    placeholder="Professional Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isAuthLoading}
                  className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-zinc-200"
                >
                  {isAuthLoading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <UserPlus size={20} />}
                  Create Account
                </button>
                <p className="text-center text-sm text-zinc-500">
                  Already have an account? {' '}
                  <button 
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="text-zinc-900 font-bold hover:underline"
                  >
                    Log in
                  </button>
                </p>
              </form>
            )}

            <div className="flex items-center gap-4 text-zinc-300 my-4">
              <div className="flex-1 h-px bg-zinc-100" />
              <span className="text-[10px] font-mono uppercase tracking-widest">OR</span>
              <div className="flex-1 h-px bg-zinc-100" />
            </div>

            <button 
              onClick={handleGoogleLogin}
              disabled={isAuthLoading}
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
          By logging in, you agree to our <button className="underline hover:text-zinc-600 transition-colors">Terms of Service</button>, <button className="underline hover:text-zinc-600 transition-colors">Professional Conduct Guidelines</button>, and <button onClick={() => setShowPrivacyModal(true)} className="underline hover:text-zinc-600 transition-colors">Data Privacy Consent</button>.
        </p>
        <div className="mt-4 flex justify-center gap-4 text-[10px] font-mono text-zinc-300 uppercase tracking-widest">
          <span className="flex items-center gap-1"><ShieldCheck size={10} /> Privacy First</span>
          <span className="flex items-center gap-1"><Lock size={10} /> End-to-End Encryption</span>
        </div>

        <AnimatePresence>
          {showPrivacyModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-zinc-200"
              >
                <div className="p-6 bg-zinc-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={24} className="text-zinc-400" />
                    <h2 className="text-xl font-serif font-bold">Data Privacy Consent</h2>
                  </div>
                  <button 
                    onClick={() => setShowPrivacyModal(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-8 max-h-[60vh] overflow-y-auto">
                  <div className="prose prose-sm prose-zinc">
                    <div className="whitespace-pre-wrap font-sans text-sm text-zinc-600 leading-relaxed">
                      {PRIVACY_POLICY}
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end">
                  <button 
                    onClick={() => setShowPrivacyModal(false)}
                    className="px-6 py-2 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

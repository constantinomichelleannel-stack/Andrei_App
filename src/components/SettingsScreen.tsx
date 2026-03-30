import React from 'react';
import { ShieldCheck, FileText, AlertCircle, X, User as UserIcon, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface SettingsScreenProps {
  profile: UserProfile | null;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
  refreshProfile: () => Promise<void>;
  handleDeleteAccount: () => void;
  setShowPrivacyModal: (show: boolean) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ 
  profile, 
  fetchWithAuth, 
  refreshProfile, 
  handleDeleteAccount, 
  setShowPrivacyModal 
}) => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-serif font-bold text-slate-900 mb-6">Settings</h1>
      <div className="space-y-6">
        {/* Account Status Section */}
        <div className="legal-card p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <UserIcon size={20} className="text-indigo-600" />
            Account Status
          </h3>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-500 uppercase mb-1">Account Status</p>
              <p className="font-bold text-slate-900">Active Professional Account</p>
            </div>
            {profile?.accountVerified ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg border border-green-100">
                <CheckCircle2 size={16} />
                <span className="text-xs font-bold">Verified</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg border border-amber-100">
                <AlertCircle size={16} />
                <span className="text-xs font-bold">Unverified</span>
              </div>
            )}
          </div>
        </div>

        <div className="legal-card p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <ShieldCheck size={20} className="text-indigo-600" />
            Data Privacy Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="font-bold text-slate-900">Data Processing Consent</p>
                <p className="text-xs text-slate-500">Allow LexPH to process your legal research data for AI assistance.</p>
              </div>
              <button 
                onClick={async () => {
                  if (!profile) return;
                  try {
                    await fetchWithAuth('/api/profile', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        rollNumber: profile.rollNumber,
                        specialization: profile.specialization,
                        displayName: profile.displayName,
                        privacyConsent: !profile.privacyConsent
                      })
                    });
                    await refreshProfile();
                  } catch (error) {
                    console.error("Failed to update privacy consent:", error);
                  }
                }}
                className={`w-12 h-6 rounded-full transition-colors relative ${profile?.privacyConsent ? 'bg-indigo-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${profile?.privacyConsent ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
              <div className="flex items-start gap-3">
                <AlertCircle size={16} className="text-indigo-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-indigo-900 mb-1">Privacy Policy</p>
                  <p className="text-[10px] text-indigo-700 leading-relaxed mb-3">
                    Your data is used to verify your status as a legal professional and to personalize your research experience.
                    We use industry-standard encryption to protect your data.
                  </p>
                  <button 
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <FileText size={12} />
                    View Full Privacy Policy
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <h4 className="text-xs font-mono text-red-500 uppercase mb-4">Danger Zone</h4>
              <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-center justify-between">
                <div className="text-left">
                  <p className="text-sm font-bold text-red-900">Delete Account</p>
                  <p className="text-[10px] text-red-700">Permanently delete your account and all associated data. This action cannot be undone.</p>
                </div>
                <button 
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-all"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

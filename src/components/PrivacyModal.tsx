import React from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PrivacyModalProps {
  show: boolean;
  onClose: () => void;
  policyText: string;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ show, onClose, policyText }) => {
  return (
    <AnimatePresence>
      {show && (
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
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-8 max-h-[60vh] overflow-y-auto">
              <div className="prose prose-sm prose-zinc">
                <div className="whitespace-pre-wrap font-sans text-sm text-zinc-600 leading-relaxed">
                  {policyText}
                </div>
              </div>
            </div>
            <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end">
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

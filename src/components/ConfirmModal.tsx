import React from 'react';
import { AlertTriangle, Info, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ConfirmModalProps {
  show: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  show, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  type = 'warning' 
}) => {
  const colors = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white',
    info: 'bg-indigo-600 hover:bg-indigo-700 text-white'
  };

  const icons = {
    danger: <AlertCircle className="text-red-600" size={32} />,
    warning: <AlertTriangle className="text-amber-600" size={32} />,
    info: <Info className="text-indigo-600" size={32} />
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
          >
            <div className="p-8 text-center">
              <div className="inline-flex p-4 bg-slate-50 rounded-full mb-6">
                {icons[type]}
              </div>
              <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">{title}</h2>
              <p className="text-slate-500 text-sm leading-relaxed">{message}</p>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button 
                onClick={onCancel}
                className="flex-1 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  onConfirm();
                  onCancel();
                }}
                className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all shadow-md ${colors[type]}`}
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

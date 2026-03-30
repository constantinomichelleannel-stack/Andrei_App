import React from 'react';
import { motion } from 'motion/react';
import { XCircle, AlertTriangle, Info } from 'lucide-react';

export const ConfirmModal = ({ 
  show, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  type = 'warning' 
}: { 
  show: boolean; 
  title: string; 
  message: string; 
  onConfirm: () => void; 
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}) => {
  if (!show) return null;
  
  const colors = {
    danger: 'bg-red-600 hover:bg-red-700 shadow-red-200',
    warning: 'bg-amber-600 hover:bg-amber-700 shadow-amber-200',
    info: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
  };

  const icons = {
    danger: <XCircle className="text-red-600" size={24} />,
    warning: <AlertTriangle className="text-amber-600" size={24} />,
    info: <Info className="text-indigo-600" size={24} />
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
      >
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            {icons[type]}
          </div>
          <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">{title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">{message}</p>
        </div>
        <div className="p-4 bg-slate-50 flex gap-3">
          <button 
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className={`flex-1 px-4 py-2 text-white rounded-xl font-bold transition-all shadow-lg ${colors[type]}`}
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
};

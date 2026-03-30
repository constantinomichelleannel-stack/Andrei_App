import React from 'react';
import { Scale, BrainCircuit } from 'lucide-react';
import { motion } from 'motion/react';

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA] p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="relative mb-8">
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-24 h-24 rounded-full border-2 border-indigo-100 flex items-center justify-center bg-white shadow-xl shadow-indigo-100/50"
          >
            <Scale size={40} className="text-indigo-600" />
          </motion.div>
          
          <motion.div 
            animate={{ 
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg"
          >
            <BrainCircuit size={16} />
          </motion.div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">LexPH</h1>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-[0.2em]">Agentic Legal Intelligence</p>
        </div>

        <div className="mt-12 w-48 h-1 bg-slate-100 rounded-full overflow-hidden relative">
          <motion.div 
            animate={{ 
              left: ["-100%", "100%"]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-0 bottom-0 w-1/2 bg-indigo-600 rounded-full"
          />
        </div>
        
        <motion.p 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-4 text-[10px] font-mono text-slate-400 uppercase tracking-widest"
        >
          Initializing Framework...
        </motion.p>
      </motion.div>
    </div>
  );
};

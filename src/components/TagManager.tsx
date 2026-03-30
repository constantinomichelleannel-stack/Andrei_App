import React, { useState, useMemo } from 'react';
import { Tag, X } from 'lucide-react';
import { motion } from 'motion/react';

export const TagManager = ({ 
  tags, 
  onAdd, 
  onRemove, 
  allTags = [], 
  placeholder = "Add tag...",
  icon: Icon = Tag
}: { 
  tags: string[], 
  onAdd: (tag: string) => void, 
  onRemove: (tag: string) => void,
  allTags?: string[],
  placeholder?: string,
  icon?: any
}) => {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const suggestions = useMemo(() => {
    if (!input.trim()) return [];
    return allTags.filter(t => 
      t.toLowerCase().includes(input.toLowerCase()) && 
      !tags.includes(t)
    ).slice(0, 5);
  }, [input, allTags, tags]);

  const handleAdd = (tag: string) => {
    if (tag.trim()) {
      onAdd(tag.trim());
      setInput('');
      setShowSuggestions(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 min-h-[32px] p-2 bg-slate-50 border border-slate-100 rounded-xl">
        {tags.length === 0 && <span className="text-xs text-slate-400 italic px-1">No tags added yet.</span>}
        {tags.map((tag, idx) => (
          <motion.span 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            key={idx} 
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white text-indigo-600 rounded-full text-[10px] font-bold border border-indigo-100 shadow-sm group"
          >
            <Icon size={10} className="text-indigo-300" />
            {tag}
            <button 
              type="button"
              onClick={() => onRemove(tag)}
              className="text-indigo-300 hover:text-red-500 transition-colors"
            >
              <X size={10} />
            </button>
          </motion.span>
        ))}
      </div>
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Icon size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAdd(input);
                }
              }}
              placeholder={placeholder}
              className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <button
            type="button"
            onClick={() => handleAdd(input)}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-sm"
          >
            Add
          </button>
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
            {suggestions.map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAdd(tag)}
                className="w-full text-left px-4 py-2 text-xs hover:bg-indigo-50 text-slate-700 font-medium transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, Plus, BrainCircuit, X, Edit2, Trash2, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";
import { useAuth } from '../contexts/AuthContext';
import { useDocumentStore } from '../store';
import { Note } from '../types';

export const KnowledgeBase = ({ showConfirm }: { showConfirm: (title: string, message: string, onConfirm: () => void, type?: 'danger' | 'warning' | 'info') => void }) => {
  const { fetchWithAuth } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newNote, setNewNote] = useState({ 
    title: '', 
    content: '', 
    category: 'General',
    tags: '',
    source_doc_id: undefined as number | undefined
  });
  
  const { documents } = useDocumentStore();

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const res = await fetchWithAuth('/api/notes');
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAddNote = async () => {
    if (!newNote.title.trim()) {
      alert("Please enter a title for the insight.");
      return;
    }
    
    setIsSaving(true);
    try {
      const url = editingNoteId ? `/api/notes/${editingNoteId}` : '/api/notes';
      const method = editingNoteId ? 'PATCH' : 'POST';
      
      const res = await fetchWithAuth(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote)
      });
      
      if (res.ok) {
        await fetchNotes();
        setNewNote({ title: '', content: '', category: 'General', tags: '', source_doc_id: undefined });
        setIsAdding(false);
        setEditingNoteId(null);
      } else {
        const errorData = await res.json();
        alert(`Failed to save insight: ${errorData.error || res.statusText}`);
      }
    } catch (err) {
      console.error("Save note error:", err);
      alert("An error occurred while saving the insight.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditNote = (note: Note) => {
    setNewNote({
      title: note.title,
      content: note.content,
      category: note.category,
      tags: note.tags || '',
      source_doc_id: note.source_doc_id
    });
    setEditingNoteId(note.id);
    setIsAdding(true);
  };

  const handleDeleteNote = (id: number) => {
    showConfirm(
      "Delete Insight",
      "Are you sure you want to delete this insight? This action cannot be undone.",
      async () => {
        try {
          const res = await fetchWithAuth(`/api/notes/${id}`, { method: 'DELETE' });
          if (res.ok) {
            setNotes(prev => prev.filter(n => n.id !== id));
          } else {
            alert("Failed to delete insight.");
          }
        } catch (err) {
          console.error("Delete note error:", err);
          alert("An error occurred while deleting the insight.");
        }
      },
      'danger'
    );
  };

  const handleGenerateInsight = async (docId: number) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Fetch doc content
      const contentRes = await fetchWithAuth(`/api/documents/preview/${doc.filename}`);
      const contentData = await contentRes.json();
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Based on the following legal document, generate a strategic "Legal Insight" or "Practice Note". 
        Focus on how this case/statute impacts private legal practice, potential risks for clients, and strategic opportunities.
        The insight should be concise, professional, and actionable.
        
        Document: ${doc.title}
        Content: ${contentData.content?.substring(0, 20000) || "No content available."}
        
        Return a JSON object with 'title', 'content', and 'suggested_tags' (comma separated).`,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              suggested_tags: { type: Type.STRING }
            },
            required: ['title', 'content', 'suggested_tags']
          }
        }
      });

      if (response.text) {
        const data = JSON.parse(response.text);
        setNewNote({
          title: data.title,
          content: data.content,
          category: 'AI Generated',
          tags: data.suggested_tags,
          source_doc_id: docId
        });
        setEditingNoteId(null);
        setIsAdding(true);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate insight.");
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (note.tags && note.tags.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'General', 'Civil Law', 'Criminal Law', 'Labor Law', 'Taxation', 'Practice Note', 'AI Generated', 'Strategy'];

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Knowledge Portal</h1>
          <p className="text-slate-500">Centralized repository for internal knowledge diffusion and strategic insights.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchNotes}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            title="Refresh Insights"
          >
            <RotateCcw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => {
              setEditingNoteId(null);
              setNewNote({ title: '', content: '', category: 'General', tags: '', source_doc_id: undefined });
              setIsAdding(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus size={18} /> New Insight
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar / Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="legal-card p-4 space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">Search Insights</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text"
                  placeholder="Keywords, tags..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">Categories</label>
              <div className="space-y-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCategory === cat 
                        ? 'bg-indigo-600 text-white font-medium' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="legal-card p-4">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <BrainCircuit size={16} className="text-indigo-600" /> AI Synthesis
            </h3>
            <p className="text-xs text-slate-500 mb-4">Generate strategic practice notes from your document library.</p>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {documents.slice(0, 15).map(doc => (
                <button
                  key={doc.id}
                  onClick={() => handleGenerateInsight(doc.id)}
                  disabled={isGenerating}
                  className="w-full text-left p-2 rounded border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group disabled:opacity-50"
                >
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Source Case</div>
                  <div className="text-xs font-medium text-slate-700 line-clamp-1 group-hover:text-indigo-700">{doc.title}</div>
                </button>
              ))}
              {documents.length === 0 && (
                <div className="text-xs text-slate-400 italic text-center py-4">No documents in library</div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="legal-card p-6 border-2 border-indigo-100 shadow-lg relative"
            >
              <button 
                onClick={() => {
                  setIsAdding(false);
                  setEditingNoteId(null);
                  setNewNote({ title: '', content: '', category: 'General', tags: '', source_doc_id: undefined });
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
              
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Insight Title"
                  value={newNote.title}
                  onChange={e => setNewNote({...newNote, title: e.target.value})}
                  className="w-full text-2xl font-serif font-bold focus:outline-none border-b border-slate-100 pb-2"
                />
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Category</label>
                    <select 
                      value={newNote.category}
                      onChange={e => setNewNote({...newNote, category: e.target.value})}
                      className="w-full bg-slate-50 text-sm px-3 py-2 rounded border border-slate-200"
                    >
                      {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Tags (comma separated)</label>
                    <input 
                      type="text"
                      placeholder="e.g. strategy, risk, civil-law"
                      value={newNote.tags}
                      onChange={e => setNewNote({...newNote, tags: e.target.value})}
                      className="w-full bg-slate-50 text-sm px-3 py-2 rounded border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Insight Content</label>
                  <textarea 
                    placeholder="Describe the legal insight, strategic implication, or practice note..."
                    value={newNote.content}
                    onChange={e => setNewNote({...newNote, content: e.target.value})}
                    className="w-full h-48 bg-slate-50 p-4 rounded border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => {
                      setIsAdding(false);
                      setEditingNoteId(null);
                      setNewNote({ title: '', content: '', category: 'General', tags: '', source_doc_id: undefined });
                    }}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddNote}
                    disabled={isSaving}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving && <RotateCcw size={16} className="animate-spin" />}
                    {editingNoteId ? (isSaving ? 'Updating...' : 'Update Insight') : (isSaving ? 'Saving...' : 'Save Insight')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoading ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400">
                <RotateCcw className="animate-spin mb-4" size={32} />
                <p>Loading insights...</p>
              </div>
            ) : (
              filteredNotes.map(note => (
                <motion.div 
                  layout
                  key={note.id}
                  className="legal-card p-5 hover:border-indigo-200 transition-all group relative"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                      note.category === 'AI Generated' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {note.category}
                    </span>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => handleEditNote(note)}
                        className="text-slate-300 hover:text-indigo-600"
                        title="Edit Insight"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-slate-300 hover:text-red-500"
                        title="Delete Insight"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">{note.title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-4 mb-4 leading-relaxed">{note.content}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {note.tags?.split(',').map((tag, i) => (
                      tag.trim() && (
                        <span key={i} className="text-[9px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded border border-slate-100">
                          #{tag.trim()}
                        </span>
                      )
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(note.created_at).toLocaleDateString()}
                    </span>
                    {note.source_doc_id && (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600">
                        <BookOpen size={10} /> LINKED TO SOURCE
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
            {!isLoading && filteredNotes.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <div className="inline-flex p-4 bg-slate-50 rounded-full mb-4">
                  <Search size={32} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No insights found</h3>
                <p className="text-slate-500">Try adjusting your search or category filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

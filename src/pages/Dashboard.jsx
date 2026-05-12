import React, { useState } from 'react';
import { generateStudyContent, getMockData } from '../lib/ai';
import { motion, AnimatePresence } from 'framer-motion';
import Quiz from '../components/Quiz';
import GeneratingLoader from '../components/GeneratingLoader';
import { exportToTxt, exportToPdf, exportToPng } from '../utils/exportUtils';
import { handleError } from '../utils/errorHandler';
import { toast } from 'sonner';

export default function Dashboard({ user }) {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const data = await generateStudyContent(inputText);
      setResult({ ...data, noteId: 'dummy-note-id' });
    } catch (error) {
      handleError(error, "Content Generation");
      setResult({ ...getMockData(inputText), noteId: 'dummy-note-id' });
    } finally {
      setLoading(false);
    }
  };

  const runExport = async (type) => {
    setIsExporting(true);
    setShowExportDropdown(false);
    let success = false;
    
    const toastId = toast.loading(`Preparing ${type.toUpperCase()}...`);
    
    try {
      if (type === 'txt') success = exportToTxt(result);
      else if (type === 'pdf') success = await exportToPdf('export-target');
      else if (type === 'png') success = await exportToPng('export-target');
      else if (type === 'copy') {
        const text = `SUMMARY:\n${result.summary}\n\nKEY POINTS:\n${result.key_points.join('\n')}`;
        await navigator.clipboard.writeText(text);
        success = true;
      }
    } catch (err) {
      console.error(err);
      success = false;
    }

    setIsExporting(false);
    if (success) toast.success(`${type.toUpperCase()} Exported successfully`, { id: toastId });
    else toast.error(`Failed to export ${type.toUpperCase()}`, { id: toastId });
  };

  if (showQuiz && result) {
    return <Quiz mcqs={result.mcqs} user={user} noteId={result.noteId} onExit={() => setShowQuiz(false)} />;
  }

  return (
    <main className="h-[calc(100vh-64px)] mt-16 pb-6 px-4 md:px-8 max-w-[1500px] mx-auto w-full flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full flex-grow flex flex-col pt-6"
          >
            {/* Hero Section */}
            <header className="text-center mb-6 shrink-0">
              <h1 className="font-display-lg text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 tracking-tighter leading-tight uppercase italic">
                Turn your notes into <span className="text-[#c2c1ff] block md:inline">Genius</span>
                <span className="text-[#c2c1ff] ml-2">Content</span>
              </h1>
              <p className="font-body-md text-base md:text-lg text-on-surface-variant/70 max-w-4xl mx-auto leading-relaxed">
                Paste your long paragraphs below and let AI create summaries, key points, and interactive quizzes for you in seconds.
              </p>
            </header>

            {/* Main Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-grow overflow-hidden min-h-0">
              
              {/* Sidebar */}
              <aside className="lg:col-span-3 space-y-4 hidden lg:flex flex-col h-full min-h-0">
                <div className="bg-[#1d2026]/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 shadow-xl">
                  <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#c2c1ff] font-black mb-6">Settings</h3>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Detail Level</span>
                        <span className="material-symbols-outlined text-[#5e5ce6] text-xl">info</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#c2c1ff] w-2/3 shadow-[0_0_15px_#c2c1ff]"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                        <span className="material-symbols-outlined text-[#c2c1ff] text-xl">quiz</span>
                        <span className="text-sm font-black text-on-surface uppercase tracking-wide">Include Quizzes</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1d2026]/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 shadow-xl overflow-hidden group flex-grow">
                  <img 
                    alt="Digital Fiber" 
                    className="w-full h-32 object-cover rounded-2xl mb-4 transition-transform duration-1000 group-hover:scale-110"
                    src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1000&auto=format&fit=crop" 
                  />
                  <p className="text-xs font-black text-on-surface mb-1 uppercase tracking-widest">AI Usage</p>
                  <p className="text-[12px] text-on-surface-variant/60 font-medium leading-relaxed">You have 12 credits remaining for today.</p>
                </div>
              </aside>

              {/* Main Input Card */}
              <div className="lg:col-span-9 flex flex-col h-full gap-6 min-h-0">
                <div className="bg-[#10131a] rounded-[2.5rem] border border-white/10 shadow-[0_0_80px_rgba(111,0,190,0.15)] relative overflow-hidden group flex-grow flex flex-col min-h-0">
                  <AnimatePresence>
                    {loading && <GeneratingLoader />}
                  </AnimatePresence>

                  <div className="flex items-center justify-between px-10 py-5 border-b border-white/5 bg-white/[0.01] shrink-0">
                    <div className="flex gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#ffb4ab]/30"></span>
                      <span className="w-3.5 h-3.5 rounded-full bg-[#ddb7ff]/30"></span>
                      <span className="w-3.5 h-3.5 rounded-full bg-[#c2c1ff]/30"></span>
                    </div>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-on-surface-variant/40 font-black">Auto-save: Enabled</span>
                  </div>

                  <div className="relative p-2 flex-grow min-h-0">
                    <textarea 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Paste your long notes here (at least 100 words recommended)..."
                      className="w-full h-full bg-transparent border-none rounded-2xl p-6 md:p-8 text-lg text-on-surface placeholder:text-on-surface-variant/20 focus:ring-0 resize-none"
                    />
                    
                    <div className="absolute bottom-8 right-8">
                      <button 
                        onClick={handleGenerate}
                        disabled={loading || !inputText.trim()}
                        className="bg-gradient-to-r from-[#5e5ce6] to-[#6f00be] hover:to-[#5e5ce6] px-8 py-4 rounded-2xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/20 disabled:opacity-50 group"
                      >
                        <span className="text-lg font-bold text-white tracking-wide">
                          {loading ? "Generating..." : "Generate Study Content"}
                        </span>
                        <span className="material-symbols-outlined text-white text-2xl group-hover:rotate-12 transition-transform">auto_awesome</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
                  {[
                    { label: "Words", value: inputText.split(/\s+/).filter(Boolean).length, color: "text-on-surface" },
                    { label: "Reading Time", value: `${Math.ceil(inputText.split(/\s+/).filter(Boolean).length / 200)}m`, color: "text-on-surface" },
                    { label: "Quality Score", value: "--", color: "text-[#c2c1ff]" },
                    { label: "AI Model", value: "Genius-4", color: "text-[#ddb7ff]" }
                  ].map((stat, i) => (
                    <div key={i} className="bg-[#1d2026]/40 backdrop-blur-md border border-white/5 p-5 rounded-2xl shadow-lg">
                      <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-black block mb-2">{stat.label}</span>
                      <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="w-full h-full flex flex-col pt-6"
          >
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 shrink-0">
              <button 
                onClick={() => setResult(null)}
                className="flex items-center gap-2 text-on-surface-variant hover:text-[#c2c1ff] transition-colors group px-4 py-2 rounded-xl hover:bg-white/5"
              >
                <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                <span className="text-sm font-bold uppercase tracking-widest">Back to input</span>
              </button>
              
              <div className="flex items-center gap-4 relative">
                {/* Export Dropdown */}
                <div className="relative">
                  <button 
                    disabled={isExporting}
                    onClick={() => setShowExportDropdown(!showExportDropdown)}
                    className="flex items-center gap-3 bg-[#c2c1ff]/10 border border-[#c2c1ff]/20 px-6 py-3 rounded-full hover:bg-[#c2c1ff]/20 transition-all shadow-lg active:scale-95 disabled:opacity-50 group"
                  >
                    <span className="material-symbols-outlined text-[#c2c1ff] group-hover:rotate-12 transition-transform">ios_share</span>
                    <span className="text-sm font-black text-[#c2c1ff] tracking-widest uppercase">Export Intelligence</span>
                    <span className="material-symbols-outlined text-[#c2c1ff] text-sm">expand_more</span>
                  </button>

                  <AnimatePresence>
                    {showExportDropdown && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-56 glass-card rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-[100]"
                      >
                        {[
                          { id: 'copy', label: 'Copy to Clipboard', icon: 'content_copy' },
                          { id: 'pdf', label: 'Download as PDF', icon: 'picture_as_pdf' },
                          { id: 'png', label: 'Save as Image', icon: 'image' },
                          { id: 'txt', label: 'Export as TXT', icon: 'article' }
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => runExport(opt.id)}
                            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/5 transition-colors text-on-surface-variant hover:text-white text-xs font-bold uppercase tracking-wider text-left border-b border-white/5 last:border-0"
                          >
                            <span className="material-symbols-outlined text-lg text-[#c2c1ff]">{opt.icon}</span>
                            {opt.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-3 bg-tertiary/10 border border-tertiary/20 px-6 py-3 rounded-full">
                  <span className="material-symbols-outlined text-tertiary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="text-sm font-bold text-tertiary tracking-widest uppercase">Authorized</span>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow overflow-hidden min-h-0">
              <div id="export-target" className="lg:col-span-8 space-y-8 h-full overflow-y-auto pr-2 custom-scrollbar bg-[#10131a] p-6 relative">
                <section className="bg-[#1d2026]/30 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2rem] relative overflow-hidden group transition-all duration-500">
                  <div className="ai-shimmer opacity-20"></div>
                  <div className="flex items-center gap-5 mb-8">
                    <div className="bg-[#c2c1ff]/20 p-4 rounded-2xl border border-[#c2c1ff]/20 shadow-lg shadow-[#c2c1ff]/10">
                      <span className="material-symbols-outlined text-[#c2c1ff] text-3xl">description</span>
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight uppercase italic leading-none">Executive Summary</h2>
                  </div>
                  <p className="italic text-on-surface-variant/90 leading-relaxed text-xl font-light border-l-4 border-[#c2c1ff]/30 pl-8 py-2">
                    "{result.summary}"
                  </p>
                </section>

                <section className="bg-[#1d2026]/30 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2rem] transition-all duration-500">
                  <div className="flex items-center gap-5 mb-10">
                    <div className="bg-[#ddb7ff]/20 p-4 rounded-2xl border border-[#ddb7ff]/20 shadow-lg shadow-[#ddb7ff]/10">
                      <span className="material-symbols-outlined text-[#ddb7ff] text-3xl">auto_awesome</span>
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight uppercase italic leading-none">Intelligence Nodes</h2>
                  </div>
                  <ul className="space-y-8">
                    {result.key_points.map((point, index) => (
                      <motion.li 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={index} 
                        className="flex items-start gap-6 group"
                      >
                        <span className="mt-3 h-2.5 w-2.5 rounded-full bg-[#c2c1ff] shrink-0 shadow-[0_0_15px_#c2c1ff] group-hover:scale-150 transition-transform duration-300"></span>
                        <span className="text-on-surface-variant/80 group-hover:text-white transition-colors text-xl leading-relaxed font-light">{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </section>

                {/* Export Branding */}
                <div className="pt-12 border-t border-white/5 flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">StudyGenius AI Intelligence Report</span>
                  </div>
                  <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Authorized Research Evaluation</span>
                </div>
              </div>

              <aside className="lg:col-span-4 h-full flex flex-col min-h-0">
                <div className="flex-grow space-y-8 overflow-y-auto pr-1 custom-scrollbar">
                  <div className="bg-gradient-to-br from-[#5e5ce6] to-[#6f00be] p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(111,0,190,0.4)] flex flex-col gap-10 border border-white/20 relative overflow-hidden group">
                    <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/10 rounded-full blur-3xl transition-all duration-1000 group-hover:bg-white/20"></div>
                    
                    <div className="relative z-10 space-y-4">
                      <h3 className="text-4xl font-black text-white leading-none tracking-tighter italic uppercase">Master the Quiz</h3>
                      <p className="text-white/80 text-lg leading-relaxed font-medium">
                        Challenge your long-term memory with a dynamically generated evaluation.
                      </p>
                    </div>
                    
                    <div className="relative h-44 w-full rounded-[1.5rem] overflow-hidden border border-white/10 shadow-2xl group-hover:scale-105 transition-transform duration-700">
                      <img 
                        alt="Abstract waves" 
                        className="w-full h-full object-cover animate-pulse" 
                        src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000&auto=format&fit=crop" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#6f00be]/90 via-transparent to-transparent"></div>
                    </div>

                    <button 
                      onClick={() => setShowQuiz(true)}
                      className="w-full bg-white text-[#6f00be] font-black py-6 px-8 rounded-2xl flex items-center justify-center gap-4 group hover:bg-[#f4f1ff] transition-all duration-300 scale-95 active:scale-90 shadow-2xl relative z-10"
                    >
                      <span className="text-xl uppercase tracking-tighter">Initialize Quiz</span>
                      <span className="material-symbols-outlined group-hover:translate-x-3 transition-transform text-2xl">arrow_forward</span>
                    </button>
                  </div>

                  <div className="bg-[#1d2026]/20 backdrop-blur-md p-8 rounded-[2rem] border-l-4 border-[#89ceff] shadow-xl">
                    <div className="flex items-center gap-3 mb-4 text-[#89ceff]">
                      <span className="material-symbols-outlined text-2xl">lightbulb</span>
                      <span className="text-xs font-black uppercase tracking-[0.3em]">Genius Tip</span>
                    </div>
                    <p className="text-on-surface-variant text-sm leading-relaxed font-medium opacity-80">
                      Summarization is the first step. Recalling through the quiz is what builds neural pathways for long-term mastery.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

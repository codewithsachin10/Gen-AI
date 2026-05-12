import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { generateStudyContent } from '../lib/ai';
import { FileText, Sparkles, ArrowRight, Loader2, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Quiz from '../components/Quiz';

export default function Dashboard({ user }) {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const data = await generateStudyContent(inputText);
      
      // Bypassed Supabase saving since we bypassed login/DB
      // const { data: noteData, error: noteError } = await supabase
      //   .from('notes') ...
      // if (noteError) throw noteError;

      // const { error: quizError } = await supabase
      //   .from('quizzes') ...
      // if (quizError) throw quizError;

      setResult({ ...data, noteId: 'dummy-note-id' });
    } catch (error) {
      console.error(error);
      alert('Failed to generate content. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  if (showQuiz && result) {
    return <Quiz mcqs={result.mcqs} user={user} noteId={result.noteId} onExit={() => setShowQuiz(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {!result ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
                Turn your notes into <span className="text-indigo-400">Genius Content</span>
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Paste your long paragraphs below and let AI create summaries, key points, and interactive quizzes for you.
              </p>
            </div>

            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-xl relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-10 group-focus-within:opacity-20 transition duration-1000"></div>
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your long notes here (at least 100 words recommended)..."
                  className="w-full h-64 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition"
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleGenerate}
                    disabled={loading || !inputText.trim()}
                    className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg shadow-indigo-500/20"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Generating Study Content...</span>
                      </>
                    ) : (
                      <>
                        <span>Generate Study Content</span>
                        <Sparkles className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setResult(null)}
                className="text-slate-400 hover:text-white flex items-center mb-4 transition"
              >
                <ArrowRight className="w-4 h-4 rotate-180 mr-2" />
                Back to input
              </button>
              <div className="flex items-center space-x-2 text-indigo-400 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Content Generated Successfully</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <section className="bg-slate-800/50 rounded-2xl border border-slate-700 p-8 shadow-lg">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                      <FileText className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Summary</h2>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-lg italic">
                    "{result.summary}"
                  </p>
                </section>

                <section className="bg-slate-800/50 rounded-2xl border border-slate-700 p-8 shadow-lg">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Sparkles className="w-6 h-6 text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Key Points</h2>
                  </div>
                  <ul className="space-y-4">
                    {result.key_points.map((point, index) => (
                      <li key={index} className="flex items-start space-x-3 group">
                        <div className="mt-1.5 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 group-hover:scale-125 transition-transform" />
                        <span className="text-slate-300 text-lg leading-snug">{point}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <div className="md:col-span-1">
                <div className="sticky top-24 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl overflow-hidden group">
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-3xl transition group-hover:bg-white/20"></div>
                  <h3 className="text-2xl font-black mb-4 relative z-10">Ready for the Quiz?</h3>
                  <p className="text-indigo-100 mb-8 relative z-10 opacity-90">
                    Test your knowledge based on the generated points. 5 Questions, 1 Ultimate Score.
                  </p>
                  <button
                    onClick={() => setShowQuiz(true)}
                    className="w-full py-4 bg-white text-indigo-600 rounded-xl font-black text-lg hover:bg-indigo-50 transition transform hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-2 shadow-lg hover:shadow-white/20"
                  >
                    <span>Start Quiz Now</span>
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

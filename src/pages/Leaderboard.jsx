import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('scores')
        .select(`
          user_id,
          score,
          total,
          created_at
        `)
        .order('score', { ascending: false })
        .limit(10);

      if (error) throw error;
      setScores(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] mt-16 bg-surface-dim flex flex-col overflow-hidden">
      <div className="flex-grow max-w-[1200px] mx-auto w-full px-4 md:px-8 flex flex-col pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 shrink-0"
        >
          <div className="inline-flex p-4 bg-primary/10 rounded-[2rem] mb-6 border border-primary/20 shadow-lg shadow-primary/10">
            <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>trophy</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tighter italic uppercase leading-none">Intelligence Ranks</h1>
          <p className="text-on-surface-variant text-lg font-medium opacity-60">Top-performing minds across the neural network</p>
        </motion.div>

        <div className="flex-grow glass-card rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col min-h-0">
          <div className="ai-shimmer opacity-20"></div>
          
          <div className="grid grid-cols-12 bg-white/[0.02] border-b border-white/5 py-5 px-8 text-on-surface-variant font-black text-[10px] uppercase tracking-[0.3em] shrink-0">
            <div className="col-span-2">Rank</div>
            <div className="col-span-6">Neural Identity</div>
            <div className="col-span-4 text-right">Evaluation Score</div>
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar divide-y divide-white/5">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-4xl animate-spin">refresh</span>
              </div>
            ) : scores.length > 0 ? (
              scores.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={index}
                  className={`grid grid-cols-12 py-8 px-8 items-center transition-all duration-300 hover:bg-white/[0.02] group ${index < 3 ? 'bg-primary/5' : ''}`}
                >
                  <div className="col-span-2">
                    {index === 0 ? (
                      <span className="material-symbols-outlined text-yellow-500 text-3xl drop-shadow-[0_0_10px_rgba(234,179,8,0.4)]" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                    ) : index === 1 ? (
                      <span className="material-symbols-outlined text-slate-300 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                    ) : index === 2 ? (
                      <span className="material-symbols-outlined text-amber-600 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                    ) : (
                      <span className="text-2xl font-black text-on-surface-variant/40 group-hover:text-on-surface-variant transition-colors italic">#{index + 1}</span>
                    )}
                  </div>
                  <div className="col-span-6">
                    <div className="text-white font-black text-xl tracking-tight">Student_{item.user_id.substring(0, 5).toUpperCase()}</div>
                    <div className="text-on-surface-variant/40 text-[10px] uppercase font-bold tracking-widest mt-1">Authorized on {new Date(item.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="col-span-4 text-right">
                    <span className="text-3xl font-black text-white group-hover:text-primary transition-colors italic tracking-tighter">{item.score}</span>
                    <span className="text-on-surface-variant/40 font-black text-sm ml-2">/ {item.total}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-on-surface-variant/40 p-10">
                <span className="material-symbols-outlined text-6xl mb-4 opacity-20">database_off</span>
                <p className="font-bold uppercase tracking-widest text-sm">No authorized evaluations found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

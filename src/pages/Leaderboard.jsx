import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy, Medal, Star, User, Hash } from 'lucide-react';
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
      
      // Since we don't have a profiles table in the schema provided by user, 
      // we'll just show the user_id's first few characters or "Student"
      setScores(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex p-4 bg-indigo-500/10 rounded-full mb-6">
            <Trophy className="w-12 h-12 text-indigo-400" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Global Leaderboard</h1>
          <p className="text-slate-400 text-lg">Top-performing students across the platform</p>
        </motion.div>

        <div className="bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-12 bg-slate-700/50 py-4 px-6 text-slate-400 font-bold text-xs uppercase tracking-widest">
            <div className="col-span-2 flex items-center"><Hash className="w-3 h-3 mr-1" /> Rank</div>
            <div className="col-span-6 flex items-center"><User className="w-3 h-3 mr-1" /> User</div>
            <div className="col-span-4 flex items-center justify-end"><Star className="w-3 h-3 mr-1" /> Score</div>
          </div>

          <div className="divide-y divide-slate-700/50">
            {loading ? (
              <div className="py-20 flex justify-center">
                <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
              </div>
            ) : scores.length > 0 ? (
              scores.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={index}
                  className={`grid grid-cols-12 py-6 px-6 items-center hover:bg-slate-700/30 transition ${index === 0 ? 'bg-indigo-500/5' : ''}`}
                >
                  <div className="col-span-2 text-2xl font-black text-slate-500">
                    {index === 0 ? <Medal className="w-8 h-8 text-yellow-500" /> : 
                     index === 1 ? <Medal className="w-8 h-8 text-slate-300" /> :
                     index === 2 ? <Medal className="w-8 h-8 text-amber-600" /> :
                     `#${index + 1}`}
                  </div>
                  <div className="col-span-6">
                    <div className="text-white font-bold text-lg">Student {item.user_id.substring(0, 5)}...</div>
                    <div className="text-slate-500 text-xs">{new Date(item.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="col-span-4 text-right">
                    <span className="text-2xl font-black text-white">{item.score}</span>
                    <span className="text-slate-500 font-bold ml-1">/ {item.total}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-20 text-center text-slate-500">
                No scores available yet. Be the first!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] mt-16 flex items-center justify-center px-4 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-card p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden shrink-0"
      >
        <div className="ai-shimmer opacity-20"></div>
        
        <div className="text-center mb-10">
          <div className="inline-flex p-3 bg-primary/10 rounded-2xl mb-4 border border-primary/20">
            <span className="material-symbols-outlined text-primary text-3xl">lock</span>
          </div>
          <h2 className="text-3xl font-black text-on-surface mb-2 tracking-tight italic uppercase">
            {isSignUp ? 'Create Node' : 'Initialize Access'}
          </h2>
          <p className="text-on-surface-variant opacity-70 font-medium">
            {isSignUp ? 'Join the StudyGenius intelligence network' : 'Secure your learning session'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          {error && (
            <div className="bg-error-container/20 border border-error/50 text-error p-4 rounded-xl flex items-center gap-3 text-sm animate-pulse">
              <span className="material-symbols-outlined text-lg">warning</span>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-primary uppercase tracking-[0.2em] ml-1">Terminal ID (Email)</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors">mail</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-lowest/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/20 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:bg-surface-container-low transition-all"
                  placeholder="name@domain.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black text-primary uppercase tracking-[0.2em] ml-1">Encryption Key (Password)</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors">key</span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container-lowest/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/20 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:bg-surface-container-low transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 btn-primary-gradient text-white rounded-[1.5rem] font-black text-lg transition flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-primary-container/20 group hover:-translate-y-0.5 active:scale-95"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">sync</span>
            ) : (
              <>
                <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">
                  {isSignUp ? 'person_add' : 'login'}
                </span>
                <span className="uppercase tracking-widest">{isSignUp ? 'Sign Up' : 'Sign In'}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary hover:text-white transition-all text-xs font-black uppercase tracking-[0.1em]"
          >
            {isSignUp ? 'Existing Terminal? Access Here' : "New Node? Initialize Account"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

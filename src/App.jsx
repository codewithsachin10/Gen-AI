import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';

function App() {
  const [session, setSession] = useState({ user: { id: 'dummy-user', email: 'guest@example.com' } });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Bypassed login
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500/30">
        <Navbar user={session?.user} />
        <Routes>
          <Route path="/" element={<Navigate to={session ? "/dashboard" : "/auth"} />} />
          <Route 
            path="/auth" 
            element={!session ? <Auth /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={session ? <Dashboard user={session.user} /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/leaderboard" 
            element={session ? <Leaderboard /> : <Navigate to="/auth" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

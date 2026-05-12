import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Toaster } from 'sonner';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
      <div className="min-h-screen bg-[#10131a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Toaster position="top-right" richColors closeButton theme="dark" />
      <Router>
        <div className="min-h-screen bg-[#10131a] text-slate-100 font-sans flex flex-col">
          <Navbar user={session?.user} />
          <div className="flex-grow">
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
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

import React from 'react';
import { motion } from 'framer-motion';

export default function GeneratingLoader() {
  const steps = [
    "Initializing neural nodes...",
    "Analyzing semantic structure...",
    "Synthesizing key insights...",
    "Generating interactive evaluation...",
    "Optimizing study flow..."
  ];

  const [currentStep, setCurrentStep] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-[#10131a]/80 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="relative mb-12">
        {/* Outer Ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-48 h-48 rounded-full border-2 border-dashed border-primary/20"
        />
        
        {/* Middle Pulse */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-4 rounded-full bg-primary/10 border border-primary/30"
        />

        {/* Inner Core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            animate={{ 
              boxShadow: ["0 0 20px rgba(194, 193, 255, 0.2)", "0 0 50px rgba(194, 193, 255, 0.6)", "0 0 20px rgba(194, 193, 255, 0.2)"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-white text-4xl animate-pulse">auto_awesome</span>
          </motion.div>
        </div>

        {/* Orbiting Nodes */}
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <motion.div
            key={i}
            animate={{ rotate: 360 }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <div 
              style={{ transform: `rotate(${angle}deg) translateY(-90px)` }}
              className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_#c2c1ff]"
            />
          </motion.div>
        ))}
      </div>

      <div className="space-y-4 max-w-sm">
        <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase">Genius AI is Synthesizing</h2>
        <div className="h-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p 
              key={currentStep}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="text-primary font-bold uppercase tracking-[0.2em] text-xs"
            >
              {steps[currentStep]}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="w-64 h-1 bg-white/5 rounded-full mx-auto overflow-hidden">
          <motion.div 
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1/2 h-full bg-gradient-to-r from-transparent via-primary to-transparent"
          />
        </div>
      </div>
    </motion.div>
  );
}

import { AnimatePresence } from 'framer-motion';

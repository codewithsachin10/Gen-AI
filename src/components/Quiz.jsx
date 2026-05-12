import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Quiz({ mcqs, user, noteId, onExit }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleOptionSelect = (option) => {
    if (isAnswered) return;
    
    const optionPrefix = option.charAt(0);
    const correctPrefix = mcqs[currentQuestion].answer;
    
    setSelectedOption(option);
    setIsAnswered(true);

    if (optionPrefix === correctPrefix) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = async () => {
    if (currentQuestion < mcqs.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      // Bypassed real database saving for demo
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-surface-dim flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full glass-card rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="ai-shimmer opacity-50"></div>
          
          <div className="mb-6 inline-flex p-4 bg-primary/10 rounded-full border border-primary/20">
            <span className="material-symbols-outlined text-primary text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>trophy</span>
          </div>
          
          <h2 className="text-4xl font-black text-on-surface mb-2 tracking-tighter italic uppercase">EVALUATION COMPLETE</h2>
          <p className="text-on-surface-variant mb-8 text-lg font-medium opacity-80">You achieved an intelligence score of</p>
          
          <div className="mb-10 relative">
            <span className="text-8xl font-black text-white drop-shadow-[0_0_20px_rgba(194,193,255,0.4)]">{score}</span>
            <span className="text-3xl font-bold text-on-surface-variant opacity-40"> / {mcqs.length}</span>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => {
                setCurrentQuestion(0);
                setSelectedOption(null);
                setScore(0);
                setIsFinished(false);
                setIsAnswered(false);
              }}
              className="w-full py-4 btn-primary-gradient text-white rounded-2xl font-black text-lg transition flex items-center justify-center gap-3 shadow-lg shadow-primary-container/20"
            >
              <span className="material-symbols-outlined">restart_alt</span>
              <span>Initialize Retake</span>
            </button>
            <button
              onClick={onExit}
              className="w-full py-4 bg-surface-container-highest/50 hover:bg-surface-container-highest text-on-surface rounded-2xl font-black text-lg transition flex items-center justify-center gap-3 border border-white/5"
            >
              <span className="material-symbols-outlined">home</span>
              <span>Dashboard</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const question = mcqs[currentQuestion];

  return (
    <div className="min-h-screen bg-surface-dim pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        {/* Progress Header */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <div className="space-y-1">
              <span className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">Neural Assessment</span>
              <h3 className="text-on-surface text-sm font-bold opacity-60">Question {currentQuestion + 1} of {mcqs.length}</h3>
            </div>
            <div className="text-right">
              <span className="text-white font-black text-3xl tracking-tighter italic">{Math.round(((currentQuestion + 1) / mcqs.length) * 100)}%</span>
            </div>
          </div>
          <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden border border-white/5">
            <motion.div 
              className="h-full bg-primary shadow-[0_0_15px_rgba(194,193,255,0.6)]"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / mcqs.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "circOut" }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group"
          >
            <div className="ai-shimmer opacity-10"></div>
            
            <div className="mb-10">
              <span className="material-symbols-outlined text-primary/40 text-4xl mb-4">terminal</span>
              <h3 className="text-2xl md:text-3xl font-bold text-on-surface leading-tight tracking-tight">
                {question.question}
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {question.options.map((option, index) => {
                const prefix = option.charAt(0);
                const isCorrect = prefix === question.answer;
                const isSelected = selectedOption === option;
                
                let buttonClass = "w-full text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden flex items-center justify-between group ";
                
                if (!isAnswered) {
                  buttonClass += "bg-surface-container-lowest/50 border-white/5 hover:border-primary/50 hover:bg-surface-container-low hover:translate-x-1";
                } else if (isCorrect) {
                  buttonClass += "bg-tertiary-container/20 border-tertiary text-tertiary shadow-[0_0_20px_rgba(137,206,255,0.2)]";
                } else if (isSelected && !isCorrect) {
                  buttonClass += "bg-error-container/20 border-error text-error";
                } else {
                  buttonClass += "bg-surface-container-lowest/30 border-transparent opacity-40 grayscale";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    disabled={isAnswered}
                    className={buttonClass}
                  >
                    <span className="text-lg font-medium relative z-10">{option}</span>
                    {isAnswered && isCorrect && (
                      <span className="material-symbols-outlined text-tertiary relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <span className="material-symbols-outlined text-error relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
                    )}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 flex justify-center"
              >
                <button
                  onClick={nextQuestion}
                  className="btn-primary-gradient px-12 py-5 rounded-2xl text-white font-black text-xl flex items-center justify-center gap-4 group shadow-xl shadow-primary-container/30 hover:-translate-y-1 active:scale-95"
                >
                  <span className="uppercase tracking-widest">{currentQuestion === mcqs.length - 1 ? 'Terminate Session' : 'Next Node'}</span>
                  <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

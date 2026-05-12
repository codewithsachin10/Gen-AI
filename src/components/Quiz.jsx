import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Check, X, ChevronRight, Trophy, RotateCcw, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Quiz({ mcqs, user, noteId, onExit }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleOptionSelect = (option) => {
    if (isAnswered) return;
    
    // The answer is stored as 'A', 'B', 'C', or 'D' in the AI response
    // Options are stored as an array ["A...", "B...", "C...", "D..."]
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
      // Quiz Finished
      setIsFinished(true);
      // Save score to Supabase
      await supabase.from('scores').insert([{
        user_id: user.id,
        score: score,
        total: mcqs.length
      }]);
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          
          <div className="mb-6 inline-flex p-4 bg-indigo-500/10 rounded-full">
            <Trophy className="w-16 h-16 text-indigo-400" />
          </div>
          
          <h2 className="text-4xl font-black text-white mb-2">Quiz Complete!</h2>
          <p className="text-slate-400 mb-8 text-lg font-medium">You scored</p>
          
          <div className="mb-10 relative">
            <span className="text-8xl font-black text-white">{score}</span>
            <span className="text-3xl font-bold text-slate-500"> / {mcqs.length}</span>
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
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-lg transition flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Try Again</span>
            </button>
            <button
              onClick={onExit}
              className="w-full py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-2xl font-black text-lg transition flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const question = mcqs[currentQuestion];

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        {/* Progress */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Question {currentQuestion + 1} of {mcqs.length}</span>
            <span className="text-white font-black text-lg">{Math.round(((currentQuestion + 1) / mcqs.length) * 100)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
            <motion.div 
              className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / mcqs.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-slate-800 rounded-3xl border border-slate-700 p-8 shadow-2xl relative"
          >
            <h3 className="text-2xl font-bold text-white mb-8 leading-tight">
              {question.question}
            </h3>

            <div className="space-y-4">
              {question.options.map((option, index) => {
                const prefix = option.charAt(0);
                const isCorrect = prefix === question.answer;
                const isSelected = selectedOption === option;
                
                let buttonClass = "w-full text-left p-6 rounded-2xl border-2 transition relative overflow-hidden group ";
                
                if (!isAnswered) {
                  buttonClass += "bg-slate-900/50 border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800";
                } else if (isCorrect) {
                  buttonClass += "bg-green-500/20 border-green-500 text-green-100";
                } else if (isSelected && !isCorrect) {
                  buttonClass += "bg-red-500/20 border-red-500 text-red-100";
                } else {
                  buttonClass += "bg-slate-900/50 border-slate-800 opacity-50";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    disabled={isAnswered}
                    className={buttonClass}
                  >
                    <div className="flex items-center justify-between relative z-10">
                      <span className="text-lg font-medium">{option}</span>
                      {isAnswered && isCorrect && <Check className="w-6 h-6 text-green-500" />}
                      {isAnswered && isSelected && !isCorrect && <X className="w-6 h-6 text-red-500" />}
                    </div>
                    {isSelected && !isAnswered && (
                      <motion.div 
                        layoutId="selection" 
                        className="absolute inset-0 bg-indigo-500/10 z-0" 
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-10 flex justify-end"
              >
                <button
                  onClick={nextQuestion}
                  className="flex items-center space-x-2 bg-white text-slate-950 px-8 py-4 rounded-2xl font-black text-lg hover:bg-indigo-50 transition transform hover:-translate-y-1 active:scale-95 shadow-xl"
                >
                  <span>{currentQuestion === mcqs.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
                  <ChevronRight className="w-6 h-6" />
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

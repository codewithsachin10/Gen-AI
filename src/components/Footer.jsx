import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full py-8 px-6 md:px-8 bg-[#0b0e14] border-t border-white/5 mt-auto">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <span className="text-xs font-bold text-white tracking-wide">StudyGenius AI</span>
          <span className="text-[11px] text-on-surface-variant/60 font-medium">© 2024 StudyGenius AI. All rights reserved.</span>
        </div>
        
        <div className="flex items-center gap-8">
          <a href="#" className="text-[11px] font-bold text-on-surface-variant hover:text-white transition-colors uppercase tracking-widest">Privacy Policy</a>
          <a href="#" className="text-[11px] font-bold text-on-surface-variant hover:text-white transition-colors uppercase tracking-widest">Terms of Service</a>
          <a href="#" className="text-[11px] font-bold text-on-surface-variant hover:text-white transition-colors uppercase tracking-widest">Contact Support</a>
        </div>
      </div>
    </footer>
  );
}

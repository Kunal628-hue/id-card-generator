import React from 'react';
import { Palmtree } from 'lucide-react';
import { XTwitterIcon } from './XTwitterIcon';

export const Header: React.FC = () => {
  return (
    <header className="w-full glass-panel border-b border-white/10 sticky top-0 z-50 py-3.5 px-4 md:px-8 bg-[#0D121C]/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#006B3E] via-[#FFEB00] to-[#FF007A] p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-[#0D121C] rounded-[10px] flex items-center justify-center">
              <Palmtree className="w-5 h-5 text-[#FFEB00]" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white font-['Playfair_Display']">
                HACKER HOUSE <span className="text-[#FFEB00]">GOA</span>
              </span>
              <span className="bg-[#FF007A]/15 text-[#FF007A] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#FF007A]/40">
                OCT 2026
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Official Frame & Builder Pass Generator
            </p>
          </div>
        </div>

        {/* Links & Hashtag */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-[#131B2B] border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#FFEB00]">
            #FrameInGoa
          </div>

          <a
            href="https://x.com/intent/tweet?text=Excited%20for%20Hacker%20House%20Goa%202026!%20%23FrameInGoa"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-[#FF007A] to-[#E6006E] hover:from-[#FF2690] hover:to-[#FF007A] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-pink-500/20 active:scale-95"
          >
            <XTwitterIcon className="w-3.5 h-3.5" />
            <span>@HHGoa</span>
          </a>
        </div>

      </div>
    </header>
  );
};

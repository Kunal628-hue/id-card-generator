import React from 'react';
import { Palmtree } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-white/10 py-4 px-4 md:px-10 bg-[#006B3E]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <Palmtree className="w-7 h-7 text-[#FFECA8]" />
          <span className="font-hh-display text-3xl font-extrabold tracking-wider text-white">
            GOA 2026
          </span>
          <span className="bg-[#FF007A] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            #FrameInGoa
          </span>
        </div>

        {/* Right Links & Action */}
        <div className="flex items-center gap-6">
          <a
            href="https://x.com/intent/tweet?text=Excited%20for%20Hacker%20House%20Goa%202026!%20%23FrameInGoa"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline text-xs font-bold text-white hover:text-[#FFECA8] transition-colors"
          >
            #FrameInGoa
          </a>

          <a
            href="https://x.com/intent/follow?screen_name=HHGoa"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-yellow-mockup px-5 py-2.5 text-base font-extrabold flex items-center gap-2 shadow-md cursor-pointer"
          >
            <span>FOLLOW ON X</span>
          </a>
        </div>

      </div>
    </header>
  );
};

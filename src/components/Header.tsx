import React from 'react';
import { Palmtree, MapPin, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-[#FFECA8]/20 py-4 px-4 md:px-10 bg-black/40 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFECA8] to-[#FF007A] flex items-center justify-center shadow-lg">
            <Palmtree className="w-6 h-6 text-black" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-hh-display text-2xl md:text-3xl font-extrabold tracking-wider text-white">
                HACKER <span className="text-[#FF007A]">गोवा</span> HOUSE
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 bg-[#FF007A] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                <Sparkles className="w-3 h-3 text-[#FFECA8]" />
                #FrameInGoa
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-[#FFECA8] flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#FF007A]" />
              GOA, INDIA · 28–31 OCT 2026
            </span>
          </div>
        </div>

        {/* Right Links & Action */}
        <div className="flex items-center gap-4">
          <a
            href="https://x.com/intent/tweet?text=Excited%20for%20Hacker%20House%20Goa%202026!%20%23FrameInGoa"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex text-xs font-mono font-bold text-[#FFECA8] hover:text-white transition-colors"
          >
            #FrameInGoa
          </a>

          <a
            href="https://x.com/intent/follow?screen_name=HHGoa"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-yellow-mockup px-4 py-2.5 text-sm md:text-base font-extrabold flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <span>FOLLOW ON X</span>
          </a>
        </div>

      </div>
    </header>
  );
};

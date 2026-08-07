import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full max-w-5xl mx-auto pt-6 pb-2 px-4 space-y-2">
      {/* Top Meta Links */}
      <div className="flex items-center justify-between text-[11px] md:text-xs font-bold tracking-widest text-[#FFEB00]">
        <span>247PM.STUDIO</span>
        <span>HHGOA.COM</span>
      </div>

      {/* Main Official Title Banner */}
      <div className="flex items-center justify-between gap-3 border-b border-[#00824A] pb-4">
        <div>
          <h1 className="font-hh-serif font-black text-3xl md:text-5xl text-[#FFEB00] leading-none tracking-tight">
            HACKER HOUSE
          </h1>
          <p className="text-xs md:text-sm font-extrabold tracking-widest text-[#FF007A] uppercase mt-1">
            Goa 2026 • Frame & Builder Badge Generator
          </p>
        </div>

        {/* Hot Pink Devanagari Goa Sticker */}
        <div className="bg-[#FF007A] text-[#FFEB00] border-2 border-[#FFEB00] px-4 py-1.5 rounded-full font-hh-devanagari font-black text-xl md:text-2xl shadow-md transform hover:scale-105 transition-transform select-none">
          गोवा
        </div>
      </div>
    </header>
  );
};

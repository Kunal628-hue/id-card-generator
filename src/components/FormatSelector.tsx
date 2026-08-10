import React from 'react';
import type { ActiveFormat } from '../types';
import { User, ShieldCheck } from 'lucide-react';

interface FormatSelectorProps {
  activeFormat: ActiveFormat;
  onChangeFormat: (format: ActiveFormat) => void;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({
  activeFormat,
  onChangeFormat,
}) => {
  return (
    <div className="w-full p-1.5 bg-black/40 border border-[#FFECA8]/40 rounded-xl flex gap-1.5 mb-6 backdrop-blur-sm">
      <button
        type="button"
        onClick={() => onChangeFormat('formatA')}
        className={`flex-1 py-3 px-4 rounded-lg font-hh-display text-lg tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
          activeFormat === 'formatA'
            ? 'bg-[#FFECA8] text-black font-extrabold shadow-lg scale-[1.01]'
            : 'text-white hover:text-[#FFECA8] hover:bg-white/5'
        }`}
      >
        <User className="w-5 h-5 text-[#FF007A]" />
        <span>PROFILE FRAME</span>
      </button>

      <button
        type="button"
        onClick={() => onChangeFormat('formatB')}
        className={`flex-1 py-3 px-4 rounded-lg font-hh-display text-lg tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
          activeFormat === 'formatB'
            ? 'bg-[#FFECA8] text-black font-extrabold shadow-lg scale-[1.01]'
            : 'text-white hover:text-[#FFECA8] hover:bg-white/5'
        }`}
      >
        <ShieldCheck className="w-5 h-5 text-[#FF007A]" />
        <span>BUILDER BADGE</span>
      </button>
    </div>
  );
};

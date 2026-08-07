import React from 'react';
import type { ActiveFormat } from '../types';
import { UserCheck, BadgeCheck } from 'lucide-react';

interface FormatSelectorProps {
  activeFormat: ActiveFormat;
  onChangeFormat: (format: ActiveFormat) => void;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({
  activeFormat,
  onChangeFormat,
}) => {
  return (
    <div className="w-full max-w-md mx-auto mb-6 p-1.5 bg-[#131B2B] rounded-2xl flex gap-2 border border-white/10 shadow-lg">
      <button
        type="button"
        onClick={() => onChangeFormat('formatA')}
        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer ${
          activeFormat === 'formatA'
            ? 'bg-[#006B3E] text-[#FFEB00] shadow-md shadow-emerald-900/40 scale-[1.02] border border-[#009656]'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <UserCheck className="w-4 h-4 text-[#FFEB00]" />
        <span>Profile frame</span>
      </button>

      <button
        type="button"
        onClick={() => onChangeFormat('formatB')}
        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer ${
          activeFormat === 'formatB'
            ? 'bg-[#FF007A] text-white shadow-md shadow-pink-900/40 scale-[1.02] border border-[#FF3399]'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <BadgeCheck className="w-4 h-4 text-white" />
        <span>Builder badge</span>
      </button>
    </div>
  );
};

import React from 'react';
import type { ActiveFormat } from '../types';

interface FormatSelectorProps {
  activeFormat: ActiveFormat;
  onChangeFormat: (format: ActiveFormat) => void;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({
  activeFormat,
  onChangeFormat,
}) => {
  return (
    <div className="w-full p-1 bg-[#006B3E] border border-[#FFECA8]/40 rounded-xl flex gap-1 mb-6">
      <button
        type="button"
        onClick={() => onChangeFormat('formatA')}
        className={`flex-1 py-2.5 px-4 rounded-lg font-hh-display text-lg tracking-wider transition-all duration-200 cursor-pointer ${
          activeFormat === 'formatA'
            ? 'bg-[#FFECA8] text-black font-extrabold shadow-sm'
            : 'text-white hover:text-[#FFECA8]'
        }`}
      >
        Profile frame
      </button>

      <button
        type="button"
        onClick={() => onChangeFormat('formatB')}
        className={`flex-1 py-2.5 px-4 rounded-lg font-hh-display text-lg tracking-wider transition-all duration-200 cursor-pointer ${
          activeFormat === 'formatB'
            ? 'bg-[#FFECA8] text-black font-extrabold shadow-sm'
            : 'text-white hover:text-[#FFECA8]'
        }`}
      >
        Builder badge
      </button>
    </div>
  );
};

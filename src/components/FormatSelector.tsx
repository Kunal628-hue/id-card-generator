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
    <div className="w-full bg-[#004D2D] p-1.5 rounded-2xl flex gap-1.5 border border-[#00703C]">
      <button
        type="button"
        onClick={() => onChangeFormat('formatA')}
        className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm md:text-base transition-all duration-200 cursor-pointer ${
          activeFormat === 'formatA'
            ? 'bg-[#FFEB00] text-[#004D2D] shadow-md scale-[1.01]'
            : 'text-[#E6F4EC] hover:text-white hover:bg-[#005C36]'
        }`}
      >
        Profile frame
      </button>

      <button
        type="button"
        onClick={() => onChangeFormat('formatB')}
        className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm md:text-base transition-all duration-200 cursor-pointer ${
          activeFormat === 'formatB'
            ? 'bg-[#FF007A] text-white shadow-md scale-[1.01]'
            : 'text-[#E6F4EC] hover:text-white hover:bg-[#005C36]'
        }`}
      >
        Builder badge
      </button>
    </div>
  );
};

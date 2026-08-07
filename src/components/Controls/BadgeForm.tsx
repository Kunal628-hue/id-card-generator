import React from 'react';
import type { UserDetails } from '../../types';
import { BUILDER_TITLES } from '../../types';
import { RefreshCw, User, Code, Sparkles } from 'lucide-react';

interface BadgeFormProps {
  details: UserDetails;
  onChangeDetails: (newDetails: UserDetails) => void;
}

export const BadgeForm: React.FC<BadgeFormProps> = ({
  details,
  onChangeDetails,
}) => {
  const handleChange = (field: keyof UserDetails, value: string) => {
    onChangeDetails({
      ...details,
      [field]: value,
    });
  };

  const handleGenerateTitle = () => {
    const randomIndex = Math.floor(Math.random() * BUILDER_TITLES.length);
    const newTitle = BUILDER_TITLES[randomIndex];
    onChangeDetails({
      ...details,
      title: newTitle,
    });
  };

  return (
    <div className="space-y-4 pt-1">
      {/* Name Input */}
      <div>
        <label className="block text-xs font-bold text-slate-300 mb-1.5 ml-1 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-[#FFEB00]" />
          Full Name
        </label>
        <input
          type="text"
          placeholder="Ada Lovelace"
          value={details.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="hh-input-field w-full py-3 px-4 text-sm font-semibold text-white placeholder-slate-500"
        />
      </div>

      {/* Role / Stack Input */}
      <div>
        <label className="block text-xs font-bold text-slate-300 mb-1.5 ml-1 flex items-center gap-1.5">
          <Code className="w-3.5 h-3.5 text-[#FF007A]" />
          Role / stack
        </label>
        <input
          type="text"
          placeholder="Full-stack • React / Node"
          value={details.role}
          onChange={(e) => handleChange('role', e.target.value)}
          className="hh-input-field w-full py-3 px-4 text-sm font-semibold text-white placeholder-slate-500"
        />
      </div>

      {/* Builder title Input with Refresh Button */}
      <div>
        <div className="flex items-center justify-between mb-1.5 ml-1">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FFEB00]" />
            Builder title
          </label>
          <button
            type="button"
            onClick={handleGenerateTitle}
            className="text-xs font-bold text-[#FFEB00] hover:text-yellow-300 flex items-center gap-1 bg-[#131B2B] hover:bg-[#1C273D] border border-white/10 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 text-[#FF007A]" />
            <span>Randomize</span>
          </button>
        </div>
        <input
          type="text"
          placeholder="Full-Stack Wanderer"
          value={details.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="hh-input-field w-full py-3 px-4 text-sm font-semibold text-[#FFEB00] placeholder-slate-500"
        />
      </div>
    </div>
  );
};

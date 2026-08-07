import React from 'react';
import type { UserDetails } from '../../types';
import { BUILDER_TITLES } from '../../types';
import { RefreshCw } from 'lucide-react';

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
    <div className="space-y-4 pt-2">
      {/* Full Name */}
      <div>
        <label className="block font-hh-display text-base tracking-wider text-[#FFECA8] mb-1.5 uppercase">
          FULL NAME
        </label>
        <input
          type="text"
          placeholder="e.g. Satoshi Nakamoto"
          value={details.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="mockup-input w-full py-3.5 px-4 text-sm font-semibold text-white placeholder-emerald-200/50"
        />
      </div>

      {/* Role / Stack */}
      <div>
        <label className="block font-hh-display text-base tracking-wider text-[#FFECA8] mb-1.5 uppercase">
          ROLE / STACK
        </label>
        <input
          type="text"
          placeholder="e.g. Fullstack Web3"
          value={details.role}
          onChange={(e) => handleChange('role', e.target.value)}
          className="mockup-input w-full py-3.5 px-4 text-sm font-semibold text-white placeholder-emerald-200/50"
        />
      </div>

      {/* Builder Title */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="font-hh-display text-base tracking-wider text-[#FFECA8] uppercase">
            BUILDER TITLE
          </label>
          <button
            type="button"
            onClick={handleGenerateTitle}
            title="Randomize title"
            className="text-[#FFECA8] hover:text-yellow-200 transition-colors p-1 cursor-pointer flex items-center gap-1 text-xs font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#FF007A]" />
            <span>Randomize</span>
          </button>
        </div>
        <input
          type="text"
          placeholder="e.g. Protocol Engineer"
          value={details.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="mockup-input w-full py-3.5 px-4 text-sm font-semibold text-[#FFECA8] placeholder-emerald-200/50"
        />
      </div>
    </div>
  );
};

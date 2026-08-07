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
    <div className="space-y-4 pt-1">
      {/* Name Input */}
      <div>
        <label className="block text-xs font-bold text-[#E6F4EC] mb-1.5 ml-1">
          Name
        </label>
        <input
          type="text"
          placeholder="Ada Lovelace"
          value={details.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full bg-[#003B20] border border-[#00703C] focus:border-[#FFEB00] rounded-2xl py-3 px-4 text-sm font-semibold text-white placeholder-[#78A88E] outline-none transition-all"
        />
      </div>

      {/* Role / Stack Input */}
      <div>
        <label className="block text-xs font-bold text-[#E6F4EC] mb-1.5 ml-1">
          Role / stack
        </label>
        <input
          type="text"
          placeholder="Full-stack • React / Node"
          value={details.role}
          onChange={(e) => handleChange('role', e.target.value)}
          className="w-full bg-[#003B20] border border-[#00703C] focus:border-[#FFEB00] rounded-2xl py-3 px-4 text-sm font-semibold text-white placeholder-[#78A88E] outline-none transition-all"
        />
      </div>

      {/* Builder title Input with Refresh Button */}
      <div>
        <label className="block text-xs font-bold text-[#E6F4EC] mb-1.5 ml-1">
          Builder title
        </label>
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Full-Stack Wanderer"
            value={details.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full bg-[#003B20] border border-[#00703C] focus:border-[#FFEB00] rounded-2xl py-3 pl-4 pr-12 text-sm font-semibold text-[#FFEB00] placeholder-[#78A88E] outline-none transition-all"
          />
          <button
            type="button"
            onClick={handleGenerateTitle}
            title="Randomize Title"
            className="absolute right-2 p-2 rounded-xl text-[#FFEB00] hover:bg-[#005932] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

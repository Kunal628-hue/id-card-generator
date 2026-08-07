import React from 'react';
import type { UserDetails, PhotoShape } from '../../types';
import { BUILDER_TITLES } from '../../types';
import { RefreshCw, Circle, Square, Hexagon, Shapes } from 'lucide-react';

interface BadgeFormProps {
  details: UserDetails;
  onChangeDetails: (newDetails: UserDetails) => void;
}

export const BadgeForm: React.FC<BadgeFormProps> = ({
  details,
  onChangeDetails,
}) => {
  const handleChange = (field: keyof UserDetails, value: any) => {
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

  const shapesList: { id: PhotoShape; label: string; icon: React.ReactNode }[] = [
    { id: 'circle', label: 'Circle', icon: <Circle className="w-3.5 h-3.5" /> },
    { id: 'square', label: 'Square', icon: <Square className="w-3.5 h-3.5" /> },
    { id: 'squircle', label: 'Squircle', icon: <Shapes className="w-3.5 h-3.5" /> },
    { id: 'hexagon', label: 'Hexagon', icon: <Hexagon className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-4 pt-2">
      
      {/* Photo Frame Shape Choice */}
      <div>
        <label className="block font-hh-display text-base tracking-wider text-[#FFECA8] mb-1.5 uppercase flex items-center gap-1.5">
          <Shapes className="w-4 h-4 text-[#FF007A]" />
          PHOTO FRAME SHAPE
        </label>
        <div className="grid grid-cols-4 gap-2">
          {shapesList.map((item) => {
            const isSelected = (details.photoShape || 'circle') === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleChange('photoShape', item.id)}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFECA8] text-black shadow-md border border-[#FFECA8]'
                    : 'bg-[#004D2D] text-white hover:bg-[#005632] border border-[#FFECA8]/30'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

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

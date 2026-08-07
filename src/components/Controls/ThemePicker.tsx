import React from 'react';
import type { PresetTheme } from '../../types';
import { PRESET_THEMES } from '../../types';
import { Palette, Check } from 'lucide-react';

interface ThemePickerProps {
  currentTheme: PresetTheme;
  onSelectTheme: (theme: PresetTheme) => void;
}

export const ThemePicker: React.FC<ThemePickerProps> = ({
  currentTheme,
  onSelectTheme,
}) => {
  return (
    <div className="space-y-3 pt-2">
      <label className="font-hh-display text-base tracking-wider text-[#FFECA8] uppercase flex items-center gap-1.5">
        <Palette className="w-4 h-4 text-[#FF007A]" />
        COLOR THEME & PALETTE
      </label>

      {/* Grid of Theme Option Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {PRESET_THEMES.map((theme) => {
          const isSelected = currentTheme.id === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTheme(theme)}
              className={`relative flex flex-col items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#FFECA8] bg-[#004D2D] ring-2 ring-[#FFECA8]/50 scale-[1.02] shadow-md'
                  : 'border-[#FFECA8]/30 bg-[#005632]/80 hover:border-[#FFECA8]/70 hover:bg-[#005632]'
              }`}
            >
              {/* Checkmark badge */}
              {isSelected && (
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#FFECA8] text-black flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}

              {/* Color Swatch Circles */}
              <div className="flex items-center gap-1 my-1">
                <div
                  className="w-4 h-4 rounded-full border border-white/30 shadow-sm"
                  style={{ backgroundColor: theme.bgColor }}
                  title="Background"
                />
                <div
                  className="w-4 h-4 rounded-full border border-white/30 shadow-sm"
                  style={{ backgroundColor: theme.primaryYellow }}
                  title="Primary Accent"
                />
                <div
                  className="w-4 h-4 rounded-full border border-white/30 shadow-sm"
                  style={{ backgroundColor: theme.accentPink }}
                  title="Secondary Accent"
                />
              </div>

              {/* Theme Name */}
              <span className={`text-xs font-bold truncate w-full text-center ${isSelected ? 'text-[#FFECA8]' : 'text-slate-200'}`}>
                {theme.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

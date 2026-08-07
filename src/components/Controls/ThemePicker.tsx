import React from 'react';
import type { ActiveFormat, PresetTheme } from '../../types';
import { FORMAT_A_THEMES, FORMAT_B_THEMES } from '../../types';
import { Palette, Check } from 'lucide-react';

interface ThemePickerProps {
  activeFormat: ActiveFormat;
  selectedThemeId: string;
  onSelectTheme: (theme: PresetTheme) => void;
}

export const ThemePicker: React.FC<ThemePickerProps> = ({
  activeFormat,
  selectedThemeId,
  onSelectTheme,
}) => {
  const themes = activeFormat === 'formatA' ? FORMAT_A_THEMES : FORMAT_B_THEMES;

  return (
    <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 space-y-2.5">
      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
        <Palette className="w-3.5 h-3.5 text-zinc-400" />
        Design Preset
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
        {themes.map((theme) => {
          const isSelected = selectedThemeId === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTheme(theme)}
              className={`p-2.5 rounded-lg text-left border transition-all duration-150 flex flex-col justify-between ${
                isSelected
                  ? 'bg-zinc-800 border-white text-white shadow-sm'
                  : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">
                  {theme.name}
                </span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-white" />
                )}
              </div>
              <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">
                {theme.subtitle}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

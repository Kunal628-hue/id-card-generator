import React from 'react';
import type { UserDetails, PhotoShape, BadgeType } from '../../types';
import { BUILDER_TITLES, DEFAULT_BEACH_BAG } from '../../types';
import { RefreshCw, Circle, Square, Hexagon, Shapes, QrCode, User, AtSign, Building2, ShieldCheck, Package, Rocket } from 'lucide-react';

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

  const badgeTypes: BadgeType[] = ['Builder', 'Hacker', 'VIP', 'Speaker', 'Core Team'];
  const showQrCode = details.showQrCode ?? true;

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

      {/* Badge Type Selector */}
      <div>
        <label className="block font-hh-display text-base tracking-wider text-[#FFECA8] mb-1.5 uppercase flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#FF007A]" />
          BADGE TYPE
        </label>
        <div className="flex flex-wrap gap-1.5">
          {badgeTypes.map((type) => {
            const isSelected = (details.badgeType || 'Builder') === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleChange('badgeType', type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FF007A] text-white shadow-md'
                    : 'bg-[#004D2D] text-slate-200 hover:bg-[#005632] border border-[#FFECA8]/20'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Full Name */}
      <div>
        <label className="block font-hh-display text-base tracking-wider text-[#FFECA8] mb-1.5 uppercase flex items-center gap-1.5">
          <User className="w-4 h-4 text-[#FF007A]" />
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

      {/* Social Handle & Company (2 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block font-hh-display text-base tracking-wider text-[#FFECA8] mb-1.5 uppercase flex items-center gap-1.5">
            <AtSign className="w-4 h-4 text-[#FF007A]" />
            HANDLE
          </label>
          <input
            type="text"
            placeholder="e.g. HackerHouseGoa"
            value={details.handle}
            onChange={(e) => handleChange('handle', e.target.value)}
            className="mockup-input w-full py-3 px-3 text-sm font-semibold text-white placeholder-emerald-200/50"
          />
        </div>

        <div>
          <label className="block font-hh-display text-base tracking-wider text-[#FFECA8] mb-1.5 uppercase flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-[#FF007A]" />
            COMPANY / ORG
          </label>
          <input
            type="text"
            placeholder="e.g. HH Goa 2026"
            value={details.company}
            onChange={(e) => handleChange('company', e.target.value)}
            className="mockup-input w-full py-3 px-3 text-sm font-semibold text-white placeholder-emerald-200/50"
          />
        </div>
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

      {/* Postcard Extras: Currently Shipping & Beach Bag (Builder Pass footer) */}
      <div className="border-t border-[#FFECA8]/20 pt-4 space-y-3">
        <div>
          <label className="block font-hh-display text-base tracking-wider text-[#FFECA8] mb-1.5 uppercase flex items-center gap-1.5">
            <Rocket className="w-4 h-4 text-[#FF007A]" />
            CURRENTLY SHIPPING
          </label>
          <input
            type="text"
            placeholder="e.g. Building the future"
            value={details.currentlyShipping ?? ''}
            onChange={(e) => handleChange('currentlyShipping', e.target.value)}
            className="mockup-input w-full py-3.5 px-4 text-sm font-semibold text-white placeholder-emerald-200/50"
          />
        </div>

        <div>
          <label className="block font-hh-display text-base tracking-wider text-[#FFECA8] mb-1.5 uppercase flex items-center gap-1.5">
            <Package className="w-4 h-4 text-[#FF007A]" />
            BEACH BAG (UP TO 3)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <input
                key={i}
                type="text"
                placeholder={DEFAULT_BEACH_BAG[i]}
                value={details.beachBag?.[i] ?? ''}
                onChange={(e) => {
                  const next = [details.beachBag?.[0] ?? '', details.beachBag?.[1] ?? '', details.beachBag?.[2] ?? ''];
                  next[i] = e.target.value;
                  handleChange('beachBag', next);
                }}
                className="mockup-input w-full py-3 px-3 text-sm font-semibold text-white placeholder-emerald-200/50"
              />
            ))}
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="border-t border-[#FFECA8]/20 pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="font-hh-display text-base tracking-wider text-[#FFECA8] uppercase flex items-center gap-1.5">
            <QrCode className="w-4 h-4 text-[#FF007A]" />
            QR CODE ON CARD
          </label>

          <button
            type="button"
            onClick={() => handleChange('showQrCode', !showQrCode)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer border ${
              showQrCode
                ? 'bg-[#FF007A] text-white border-[#FF007A]'
                : 'bg-black/40 text-slate-300 border-white/20'
            }`}
          >
            {showQrCode ? 'ENABLED' : 'DISABLED'}
          </button>
        </div>

        {showQrCode && (
          <input
            type="text"
            placeholder="e.g. https://x.com/HackerHouseGoa or your portfolio URL"
            value={details.qrData ?? 'https://x.com/HackerHouseGoa'}
            onChange={(e) => handleChange('qrData', e.target.value)}
            className="mockup-input w-full py-3.5 px-4 text-sm font-semibold text-white placeholder-emerald-200/50"
          />
        )}
      </div>

    </div>
  );
};

export type ActiveFormat = 'formatA' | 'formatB';

export type BadgeType = 'Builder' | 'Hacker' | 'VIP' | 'Speaker' | 'Core Team';

export interface UserDetails {
  name: string;
  role: string;
  title: string;
  handle: string;
  company: string;
  badgeType: BadgeType;
}

export interface ImageTransform {
  zoom: number;
  x: number;
  y: number;
  rotation: number;
  brightness: number;
  contrast: number;
  saturation: number;
}

export interface PresetTheme {
  id: string;
  name: string;
  subtitle: string;
  bgColor: string;
  cardBg: string;
  primaryYellow: string;
  accentPink: string;
  textColor: string;
}

export const PRESET_THEMES: PresetTheme[] = [
  {
    id: 'official-emerald',
    name: 'Official Emerald',
    subtitle: 'Official Hacker House Goa 2026 Theme',
    bgColor: '#006B3E',
    cardBg: '#005632',
    primaryYellow: '#FFEB00',
    accentPink: '#FF007A',
    textColor: '#FFFFFF',
  },
  {
    id: 'hot-pink',
    name: 'Neon Pink',
    subtitle: 'High energy Goa party vibe',
    bgColor: '#9E004F',
    cardBg: '#7D003E',
    primaryYellow: '#FFEB00',
    accentPink: '#00FFCC',
    textColor: '#FFFFFF',
  },
  {
    id: 'midnight-ocean',
    name: 'Midnight Ocean',
    subtitle: 'Sleek dark ocean blue mode',
    bgColor: '#0F172A',
    cardBg: '#1E293B',
    primaryYellow: '#38BDF8',
    accentPink: '#FF007A',
    textColor: '#FFFFFF',
  },
  {
    id: 'sunset-cyberpunk',
    name: 'Sunset Cyberpunk',
    subtitle: 'Electric purple & orange theme',
    bgColor: '#18002E',
    cardBg: '#2A004D',
    primaryYellow: '#FF6B00',
    accentPink: '#FF007A',
    textColor: '#FFFFFF',
  },
  {
    id: 'gold-noir',
    name: 'Gold & Noir',
    subtitle: 'Luxury black & gold edition',
    bgColor: '#111111',
    cardBg: '#1F1F1F',
    primaryYellow: '#FFD700',
    accentPink: '#E2E8F0',
    textColor: '#FFFFFF',
  },
];

export const FORMAT_A_THEMES = PRESET_THEMES;
export const FORMAT_B_THEMES = PRESET_THEMES;

export const BUILDER_TITLES = [
  "Full-Stack Wanderer",
  "ZK Circuit Sorcerer",
  "Goa Beach Hacker",
  "Solidity & Rust Virtuoso",
  "AI Agent Wrangler",
  "Gas Optimizer Lead",
  "DeFi Liquidity Wizard",
  "Coconut Water Dev",
  "Protocol Architect"
];

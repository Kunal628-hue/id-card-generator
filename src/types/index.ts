export type ActiveFormat = 'formatA' | 'formatB';

export type PhotoShape = 'circle' | 'square' | 'hexagon' | 'squircle';

export type BadgeType = 'Builder' | 'Hacker' | 'VIP' | 'Speaker' | 'Core Team';

export interface UserDetails {
  name: string;
  role: string;
  title: string;
  handle: string;
  company: string;
  badgeType: BadgeType;
  photoShape: PhotoShape;
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
  headerTextColor: string;
}

export const PRESET_THEMES: PresetTheme[] = [
  {
    id: 'official-emerald',
    name: 'Official Emerald',
    subtitle: 'Official Hacker House Goa 2026 Theme',
    bgColor: '#006B3E',
    cardBg: '#005230',
    primaryYellow: '#FFEB00',
    accentPink: '#FF007A',
    textColor: '#FFFFFF',
    headerTextColor: '#FFEB00',
  },
  {
    id: 'midnight-sapphire',
    name: 'Midnight Sapphire',
    subtitle: 'Rich deep ocean navy & sky cyan',
    bgColor: '#0D1F2D',
    cardBg: '#152A3C',
    primaryYellow: '#38BDF8',
    accentPink: '#FF007A',
    textColor: '#FFFFFF',
    headerTextColor: '#38BDF8',
  },
  {
    id: 'sunset-amber',
    name: 'Sunset Amber',
    subtitle: 'Rich dark sunset amber & gold',
    bgColor: '#6B1D00',
    cardBg: '#521600',
    primaryYellow: '#FFD700',
    accentPink: '#FFECA8',
    textColor: '#FFFFFF',
    headerTextColor: '#FFD700',
  },
  {
    id: 'cyber-plum',
    name: 'Cyber Plum',
    subtitle: 'Rich deep royal plum & neon gold',
    bgColor: '#3B0944',
    cardBg: '#2B0733',
    primaryYellow: '#FFE500',
    accentPink: '#FF007A',
    textColor: '#FFFFFF',
    headerTextColor: '#FFE500',
  },
  {
    id: 'obsidian-gold',
    name: 'Obsidian Gold',
    subtitle: 'Sleek dark obsidian & metallic gold',
    bgColor: '#141414',
    cardBg: '#222222',
    primaryYellow: '#FFD700',
    accentPink: '#FF007A',
    textColor: '#FFFFFF',
    headerTextColor: '#FFD700',
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

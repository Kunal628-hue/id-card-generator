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
    id: 'classic-emerald',
    name: 'Classic Emerald',
    subtitle: 'Official Hacker House Goa 2026 Theme',
    bgColor: '#006B3E',
    cardBg: '#005230',
    primaryYellow: '#FFEB00',
    accentPink: '#FF007A',
    textColor: '#FFFFFF',
    headerTextColor: '#FFEB00',
  },
  {
    id: 'sunburst-gold',
    name: 'Sunburst Gold',
    subtitle: 'Deep emerald green & warm sunshine gold',
    bgColor: '#005230',
    cardBg: '#004025',
    primaryYellow: '#FFECA8',
    accentPink: '#FF007A',
    textColor: '#FFFFFF',
    headerTextColor: '#FFECA8',
  },
  {
    id: 'neon-punch',
    name: 'Neon Pink Punch',
    subtitle: 'Rich forest green & hot neon pink',
    bgColor: '#004729',
    cardBg: '#003820',
    primaryYellow: '#FFEB00',
    accentPink: '#FF007A',
    textColor: '#FFFFFF',
    headerTextColor: '#FFEB00',
  },
  {
    id: 'pure-cream',
    name: 'Pure Cream',
    subtitle: 'Clean beach pastel cream & deep emerald',
    bgColor: '#FFFDF0',
    cardBg: '#F3EFE0',
    primaryYellow: '#005230',
    accentPink: '#FF007A',
    textColor: '#003820',
    headerTextColor: '#005230',
  },
  {
    id: 'cyber-obsidian',
    name: 'Cyber Obsidian',
    subtitle: 'Dark mode obsidian & gold edition',
    bgColor: '#0F1713',
    cardBg: '#18241E',
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

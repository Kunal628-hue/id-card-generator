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
    cardBg: '#005632',
    primaryYellow: '#FFECA8',
    accentPink: '#FF007A',
    textColor: '#FFFFFF',
    headerTextColor: '#FFECA8',
  },
  {
    id: 'sunshine-gold',
    name: 'Sunshine Gold',
    subtitle: 'Vibrant Goa beach sunshine yellow',
    bgColor: '#FFD700',
    cardBg: '#E6C200',
    primaryYellow: '#005632',
    accentPink: '#FF007A',
    textColor: '#000000',
    headerTextColor: '#005632',
  },
  {
    id: 'tropical-cream',
    name: 'Tropical Cream',
    subtitle: 'Clean light beach pastel theme',
    bgColor: '#FFFDF0',
    cardBg: '#F3EFE0',
    primaryYellow: '#008553',
    accentPink: '#FF007A',
    textColor: '#000000',
    headerTextColor: '#006B3E',
  },
  {
    id: 'hot-pink-white',
    name: 'Neon Pink & White',
    subtitle: 'High energy bright pink edition',
    bgColor: '#FF007A',
    cardBg: '#D60067',
    primaryYellow: '#FFECA8',
    accentPink: '#00E676',
    textColor: '#FFFFFF',
    headerTextColor: '#FFECA8',
  },
  {
    id: 'electric-mint',
    name: 'Electric Mint',
    subtitle: 'Bright mint green edition',
    bgColor: '#00E676',
    cardBg: '#00C853',
    primaryYellow: '#00381F',
    accentPink: '#FF007A',
    textColor: '#000000',
    headerTextColor: '#00381F',
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

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
    id: 'ocean-cyan',
    name: 'Ocean Cyan',
    subtitle: 'Deep navy ocean blue & electric cyan',
    bgColor: '#0A192F',
    cardBg: '#112240',
    primaryYellow: '#00F0FF',
    accentPink: '#FF007A',
    textColor: '#FFFFFF',
    headerTextColor: '#00F0FF',
  },
  {
    id: 'sunset-gold',
    name: 'Sunset Gold',
    subtitle: 'Warm Goa beach sunset terracotta',
    bgColor: '#8B2500',
    cardBg: '#6E1D00',
    primaryYellow: '#FFD700',
    accentPink: '#FFECA8',
    textColor: '#FFFFFF',
    headerTextColor: '#FFD700',
  },
  {
    id: 'pearl-gold',
    name: 'Pure Pearl',
    subtitle: 'Luxury light pearl & forest green',
    bgColor: '#F4F6F0',
    cardBg: '#E2E7D8',
    primaryYellow: '#005230',
    accentPink: '#FF007A',
    textColor: '#003820',
    headerTextColor: '#005230',
  },
  {
    id: 'neon-night',
    name: 'Neon Night',
    subtitle: 'Cyberpunk black & neon gold edition',
    bgColor: '#0D0D0D',
    cardBg: '#1A1A1A',
    primaryYellow: '#FFE500',
    accentPink: '#FF0055',
    textColor: '#FFFFFF',
    headerTextColor: '#FFE500',
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

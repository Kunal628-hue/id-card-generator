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

export const FORMAT_A_THEMES: PresetTheme[] = [
  {
    id: 'hh-goa-official',
    name: 'Official Emerald & Yellow',
    subtitle: 'Official Hacker House Goa 2026 poster style',
    bgColor: '#006B3E',
    cardBg: '#005632',
    primaryYellow: '#FFEB00',
    accentPink: '#FF007A',
    textColor: '#FFFFFF',
  },
  {
    id: 'hh-goa-pink',
    name: 'Neon Pink & Emerald',
    subtitle: 'High contrast hot pink Goa vibe',
    bgColor: '#006B3E',
    cardBg: '#004D2D',
    primaryYellow: '#FF007A',
    accentPink: '#FFEB00',
    textColor: '#FFFFFF',
  }
];

export const FORMAT_B_THEMES: PresetTheme[] = [
  {
    id: 'hh-goa-badge-official',
    name: 'Official Builder Pass',
    subtitle: 'Emerald green & yellow edition badge',
    bgColor: '#006B3E',
    cardBg: '#005632',
    primaryYellow: '#FFEB00',
    accentPink: '#FF007A',
    textColor: '#FFFFFF',
  }
];

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

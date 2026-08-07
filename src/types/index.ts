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
    id: 'goa-sunburst',
    name: 'Goa Sunburst',
    subtitle: 'Vibrant Goa beach yellow & emerald green',
    bgColor: '#FFD200',
    cardBg: '#E5BD00',
    primaryYellow: '#005230',
    accentPink: '#FF007A',
    textColor: '#003820',
    headerTextColor: '#005230',
  },
  {
    id: 'white-sand',
    name: 'White Sand',
    subtitle: 'Clean crisp white & emerald edition',
    bgColor: '#FFFFFF',
    cardBg: '#F0F4F1',
    primaryYellow: '#006B3E',
    accentPink: '#FF007A',
    textColor: '#003820',
    headerTextColor: '#006B3E',
  },
  {
    id: 'sunset-peach',
    name: 'Sunset Peach',
    subtitle: 'Rich warm beach sunset peach',
    bgColor: '#F7C59F',
    cardBg: '#EAA97D',
    primaryYellow: '#005230',
    accentPink: '#FF007A',
    textColor: '#003820',
    headerTextColor: '#005230',
  },
  {
    id: 'mint-breeze',
    name: 'Mint Breeze',
    subtitle: 'Rich tropical mint green edition',
    bgColor: '#98DBC6',
    cardBg: '#76C7AF',
    primaryYellow: '#005230',
    accentPink: '#FF007A',
    textColor: '#003820',
    headerTextColor: '#005230',
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

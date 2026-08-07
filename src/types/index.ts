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
    id: 'sunset-palm',
    name: 'Sunset Palm',
    subtitle: 'Vibrant Goa sunset orange & cream',
    bgColor: '#FF5E36',
    cardBg: '#E04B24',
    primaryYellow: '#FFECA8',
    accentPink: '#005230',
    textColor: '#FFFFFF',
    headerTextColor: '#FFECA8',
  },
  {
    id: 'cyber-mint',
    name: 'Cyber Mint',
    subtitle: 'Vibrant tropical mint & neon pink',
    bgColor: '#00C896',
    cardBg: '#00A37A',
    primaryYellow: '#FFECA8',
    accentPink: '#FF007A',
    textColor: '#FFFFFF',
    headerTextColor: '#FFFFFF',
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

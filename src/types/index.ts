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
  showQrCode?: boolean;
  qrData?: string;
  currentlyShipping?: string;
  beachBag?: string[];
}

export const DEFAULT_BEACH_BAG = ['Coconut Water', 'VS Code', 'Lo-Fi Beats'];

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
    id: 'arambol-emerald',
    name: 'Arambol Emerald',
    subtitle: 'Official Hacker House Goa Palm Emerald',
    bgColor: '#006B3E',
    cardBg: '#004D2D',
    primaryYellow: '#FFEB00',
    accentPink: '#FF007A',
    textColor: '#FFFFFF',
    headerTextColor: '#FFEB00',
  },
  {
    id: 'palolem-sunset',
    name: 'Palolem Sunset',
    subtitle: 'Soft warm Goan beach sunset peach',
    bgColor: '#F7C59F',
    cardBg: '#EAA97D',
    primaryYellow: '#005230',
    accentPink: '#FF007A',
    textColor: '#003820',
    headerTextColor: '#005230',
  },
  {
    id: 'anjuna-sunburst',
    name: 'Anjuna Sunburst',
    subtitle: 'Vibrant Goa golden sand & tropical green',
    bgColor: '#E6A100',
    cardBg: '#004D2D',
    primaryYellow: '#FFFFFF',
    accentPink: '#FF007A',
    textColor: '#002B19',
    headerTextColor: '#004D2D',
  },
  {
    id: 'candolim-turquoise',
    name: 'Baga Turquoise',
    subtitle: 'Vibrant Goan ocean turquoise edition',
    bgColor: '#008075',
    cardBg: '#005951',
    primaryYellow: '#FFEB00',
    accentPink: '#FF007A',
    textColor: '#FFFFFF',
    headerTextColor: '#FFEB00',
  },
  {
    id: 'vagator-night',
    name: 'Vagator Rave Night',
    subtitle: 'Arabian Sea midnight blue & neon glow',
    bgColor: '#0F172A',
    cardBg: '#1E293B',
    primaryYellow: '#38BDF8',
    accentPink: '#FF007A',
    textColor: '#F8FAFC',
    headerTextColor: '#38BDF8',
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

// === NTUT Food App Types ===

export interface Restaurant {
  id: string;
  name: string;
  type: RestaurantType;
  price: string;
  distance: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  rating?: number;
  isOpen?: boolean;
  openHours?: string;
}

export type RestaurantType = 
  | 'CHINESE'
  | 'JAPANESE' 
  | 'TAIWANESE'
  | 'KOREAN'
  | 'THAI'
  | 'ITALIAN'
  | 'WESTERN'
  | 'VEGETARIAN'
  | 'BEVERAGE'
  | 'MIXED';

export interface DecodeHistory {
  id: string;
  restaurant: Restaurant;
  timestamp: string;
  decodedAt: Date;
}

export type SystemState = 'IDLE' | 'DECODING' | 'DECODED';

export interface DataStream {
  id: string;
  x: number;
  words: StreamWord[];
  speed: number;
  glitchChance: number;
}

export interface StreamWord {
  id: string;
  text: string;
  y: number;
  alpha: number;
  size: number;
  glitching: boolean;
  glitchTimer: number;
}

export interface GlitchParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: [number, number, number];
  char: string;
}

// App State
export interface AppState {
  // System
  systemState: SystemState;
  isLoading: boolean;
  
  // Restaurants
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  
  // History
  history: DecodeHistory[];
  
  // UI
  showHistory: boolean;
  showOverlay: boolean;
  
  // Filters (for future use)
  filters: {
    type?: RestaurantType;
    maxPrice?: number;
    maxDistance?: number;
  };
}

// Actions
export interface AppActions {
  // System
  setSystemState: (state: SystemState) => void;
  setLoading: (loading: boolean) => void;
  
  // Restaurants
  setRestaurants: (restaurants: Restaurant[]) => void;
  selectRestaurant: (restaurant: Restaurant) => void;
  clearSelection: () => void;
  
  // History  
  addToHistory: (restaurant: Restaurant) => void;
  clearHistory: () => void;
  loadHistory: () => void;
  
  // UI
  toggleHistory: () => void;
  setOverlay: (show: boolean) => void;
  
  // Actions
  startDecoding: () => void;
  finishDecoding: (restaurant: Restaurant) => void;
}
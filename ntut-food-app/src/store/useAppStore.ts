import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppState, AppActions, Restaurant, DecodeHistory } from '../types';

// Mock data - 從原來的資料移植
const MOCK_RESTAURANTS: Restaurant[] = [
  { id: "0x1A2F", name: "阿姨麵攤", type: "CHINESE", price: "NT$ 50-100", distance: "180M", address: "台北市大安區忠孝東路三段1號" },
  { id: "0x2B3G", name: "日式拉麵", type: "JAPANESE", price: "NT$ 150-250", distance: "220M", address: "台北市大安區基隆路四段43號" },
  { id: "0x3C4H", name: "鹹酥雞攤", type: "TAIWANESE", price: "NT$ 80-150", distance: "95M", address: "台北市大安區復興南路一段390號" },
  { id: "0x4D5I", name: "便當店", type: "CHINESE", price: "NT$ 70-120", distance: "160M", address: "台北市大安區建國南路二段151號" },
  { id: "0x5E6J", name: "手搖飲料", type: "BEVERAGE", price: "NT$ 30-80", distance: "45M", address: "台北市大安區忠孝東路三段96號" },
  { id: "0x6F7K", name: "義大利麵", type: "ITALIAN", price: "NT$ 180-300", distance: "350M", address: "台北市大安區市民大道四段100號" },
  { id: "0x7G8L", name: "滷味攤", type: "TAIWANESE", price: "NT$ 60-100", distance: "130M", address: "台北市大安區光復南路290號" },
  { id: "0x8H9M", name: "早餐店", type: "MIXED", price: "NT$ 40-80", distance: "75M", address: "台北市大安區忠孝東路四段2號" },
  { id: "0x9I0N", name: "韓式料理", type: "KOREAN", price: "NT$ 200-350", distance: "280M", address: "台北市大安區敦化南路一段187號" },
  { id: "0xAJ1O", name: "泰式餐廳", type: "THAI", price: "NT$ 120-200", distance: "190M", address: "台北市大安區仁愛路四段300號" },
  { id: "0xBK2P", name: "素食自助餐", type: "VEGETARIAN", price: "NT$ 80-150", distance: "240M", address: "台北市大安區信義路四段6號" },
  { id: "0xCL3Q", name: "牛排館", type: "WESTERN", price: "NT$ 300-500", distance: "420M", address: "台北市大安區延吉街131號" }
];

const initialState: AppState = {
  systemState: 'IDLE',
  isLoading: false,
  restaurants: MOCK_RESTAURANTS,
  selectedRestaurant: null,
  history: [],
  showHistory: false,
  showOverlay: false,
  filters: {}
};

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // System actions
      setSystemState: (systemState) => 
        set({ systemState }),
        
      setLoading: (isLoading) => 
        set({ isLoading }),
      
      // Restaurant actions  
      setRestaurants: (restaurants) => 
        set({ restaurants }),
        
      selectRestaurant: (selectedRestaurant) => 
        set({ selectedRestaurant }),
        
      clearSelection: () => 
        set({ selectedRestaurant: null }),
      
      // History actions
      addToHistory: (restaurant) => {
        const timestamp = new Date().toLocaleTimeString('zh-TW', {
          hour: '2-digit',
          minute: '2-digit'
        });
        
        const historyItem: DecodeHistory = {
          id: Date.now().toString(),
          restaurant,
          timestamp,
          decodedAt: new Date()
        };
        
        const currentHistory = get().history;
        const newHistory = [historyItem, ...currentHistory].slice(0, 10); // 限制 10 筆
        
        set({ history: newHistory });
      },
      
      clearHistory: () => 
        set({ history: [] }),
        
      loadHistory: () => {
        // Zustand persist 會自動處理，這裡可以加載額外邏輯
        console.log('History loaded:', get().history);
      },
      
      // UI actions
      toggleHistory: () => 
        set((state) => ({ showHistory: !state.showHistory })),
        
      setOverlay: (showOverlay) => 
        set({ showOverlay }),
      
      // Main actions  
      startDecoding: () => {
        set({ 
          systemState: 'DECODING',
          selectedRestaurant: null,
          showOverlay: false 
        });
        
        // 模擬解碼時間
        setTimeout(() => {
          const { restaurants, finishDecoding } = get();
          const randomRestaurant = restaurants[Math.floor(Math.random() * restaurants.length)];
          finishDecoding(randomRestaurant);
        }, 2500);
      },
      
      finishDecoding: (restaurant) => {
        const { addToHistory } = get();
        
        set({ 
          systemState: 'DECODED',
          selectedRestaurant: restaurant,
          showOverlay: true,
          showHistory: true
        });
        
        addToHistory(restaurant);
        
        // 5秒後重置
        setTimeout(() => {
          set({ 
            systemState: 'IDLE',
            showOverlay: false,
            showHistory: false,
            selectedRestaurant: null
          });
        }, 5000);
      }
    }),
    {
      name: 'ntut-food-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        history: state.history,
        filters: state.filters 
      }),
    }
  )
);
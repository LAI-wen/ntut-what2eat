import React from 'react';
import { useAppStore } from '../../store/useAppStore';

export const ResultDisplay: React.FC = () => {
  const { selectedRestaurant, systemState } = useAppStore();
  
  if (!selectedRestaurant || systemState !== 'DECODED') {
    return null;
  }

  const openGoogleMaps = () => {
    const query = encodeURIComponent(selectedRestaurant.address);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, '_blank');
  };

  return (
    <div 
      className={`
        fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40
        text-center text-white transition-opacity duration-500
        ${systemState === 'DECODED' ? 'opacity-100' : 'opacity-0'}
      `}
      style={{ pointerEvents: systemState === 'DECODED' ? 'auto' : 'none' }}
    >
      <div 
        className="text-6xl font-semibold mb-5"
        style={{ 
          fontFamily: 'Noto Serif TC, Microsoft YaHei, serif',
          textShadow: '0 0 30px rgba(255, 0, 255, 0.4)'
        }}
      >
        {selectedRestaurant.name}
      </div>
      
      <div 
        className="text-lg leading-relaxed opacity-80 mb-6"
        style={{ fontFamily: 'JetBrains Mono, Consolas, monospace' }}
      >
        <div>TYPE: {selectedRestaurant.type}</div>
        <div>PRICE_RANGE: {selectedRestaurant.price}</div>
        <div>DISTANCE: {selectedRestaurant.distance}</div>
        <div>FOOD_ID: {selectedRestaurant.id}</div>
      </div>
      
      <button
        onClick={openGoogleMaps}
        className="px-5 py-2.5 border border-green-400 bg-transparent text-green-400 cursor-pointer transition-all duration-300 hover:bg-green-400 hover:text-black"
        style={{ fontFamily: 'JetBrains Mono, Consolas, monospace' }}
      >
        NAVIGATE_TO_LOCATION
      </button>
    </div>
  );
};
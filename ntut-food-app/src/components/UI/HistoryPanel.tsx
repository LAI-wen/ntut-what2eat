import React from 'react';
import { useAppStore } from '../../store/useAppStore';

export const HistoryPanel: React.FC = () => {
  const { history, showHistory } = useAppStore();

  const openGoogleMaps = (address: string, name: string) => {
    const query = encodeURIComponent(`${address} ${name}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, '_blank');
  };

  return (
    <div 
      className={`
        fixed top-8 left-8 w-72 max-h-[70vh] overflow-y-auto z-30
        border border-gray-600 p-5 text-sm text-white
        transition-all duration-300
        ${showHistory 
          ? 'opacity-100 transform-none' 
          : 'opacity-0 -translate-x-5 pointer-events-none'
        }
      `}
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        fontFamily: 'JetBrains Mono, Consolas, monospace',
        pointerEvents: showHistory ? 'auto' : 'none'
      }}
    >
      <div className="text-green-400 text-sm font-medium mb-4 text-center border-b border-gray-600 pb-2.5">
        DECODE_HISTORY
      </div>
      
      <div className="space-y-3">
        {history.length === 0 ? (
          <div className="text-gray-500 text-center my-5">
            NO_DECODE_RECORDS
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              onClick={() => openGoogleMaps(item.restaurant.address, item.restaurant.name)}
              className="
                p-2.5 border border-gray-600 bg-white/[0.02] cursor-pointer 
                transition-all duration-200 hover:border-green-400 
                hover:bg-green-400/5 hover:shadow-lg hover:shadow-green-400/20
              "
            >
              <div className="text-sm font-medium text-white mb-1">
                {item.restaurant.name}
              </div>
              <div className="text-xs text-gray-400 leading-relaxed">
                {item.restaurant.type} | {item.restaurant.price}<br />
                DIST: {item.restaurant.distance}
              </div>
              <div className="text-xs text-gray-500 mt-1 text-right">
                {item.timestamp}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
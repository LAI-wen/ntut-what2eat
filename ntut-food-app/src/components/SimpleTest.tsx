import React from 'react';
import { useAppStore } from '../store/useAppStore';

export const SimpleTest: React.FC = () => {
  const { 
    systemState, 
    selectedRestaurant, 
    history, 
    startDecoding 
  } = useAppStore();

  return (
    <div className="fixed inset-0 bg-black text-white p-8 font-mono">
      <h1 className="text-2xl mb-4">NTUT 食慾編碼 - 測試模式</h1>
      
      <div className="mb-4">
        <p>系統狀態: {systemState}</p>
        <p>選中餐廳: {selectedRestaurant?.name || '無'}</p>
        <p>歷史記錄數量: {history.length}</p>
      </div>

      <button
        onClick={startDecoding}
        disabled={systemState !== 'IDLE'}
        className="px-6 py-3 border border-white bg-transparent text-white hover:bg-white hover:text-black disabled:opacity-50"
      >
        {systemState === 'DECODING' ? '解碼中...' : '開始抽籤'}
      </button>

      {selectedRestaurant && (
        <div className="mt-6 p-4 border border-white">
          <h2 className="text-xl mb-2">{selectedRestaurant.name}</h2>
          <p>類型: {selectedRestaurant.type}</p>
          <p>價格: {selectedRestaurant.price}</p>
          <p>距離: {selectedRestaurant.distance}</p>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg mb-2">歷史記錄:</h3>
          {history.slice(0, 3).map((item) => (
            <div key={item.id} className="border-l-2 border-gray-500 pl-2 mb-2">
              <p>{item.restaurant.name} - {item.timestamp}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
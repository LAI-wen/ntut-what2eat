import React from 'react';
import { useAppStore } from '../../store/useAppStore';

export const DecodeButton: React.FC = () => {
  const { systemState, startDecoding } = useAppStore();
  
  const isDecoding = systemState === 'DECODING';
  const isDisabled = systemState !== 'IDLE';

  return (
    <button
      onClick={startDecoding}
      disabled={isDisabled}
      className={`
        fixed bottom-16 left-1/2 transform -translate-x-1/2 z-30
        px-10 py-4 border-2 border-white bg-transparent text-white
        font-mono text-base font-normal cursor-pointer
        transition-all duration-300 tracking-widest
        hover:bg-white hover:text-black hover:shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isDecoding ? 'border-pink-500 text-pink-500' : ''}
      `}
      style={{ 
        fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
        backgroundColor: 'transparent'
      }}
    >
      {isDecoding ? 'DECODING_IN_PROGRESS...' : 'DECODE LUNCH_PROTOCOL'}
    </button>
  );
};
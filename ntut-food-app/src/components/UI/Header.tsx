import React from 'react';
import { useAppStore } from '../../store/useAppStore';

export const Header: React.FC = () => {
  const { systemState } = useAppStore();
  
  const getStatusText = () => {
    switch (systemState) {
      case 'DECODING':
        return 'DECODING_IN_PROGRESS';
      case 'DECODED':
        return 'DECODE_COMPLETE';
      default:
        return 'READY_FOR_DECODE';
    }
  };

  return (
    <div className="fixed top-6 left-6 z-30 text-white font-mono text-sm opacity-70 pointer-events-none">
      <div>NTUT.CULINARY_PROTOCOL v2.1</div>
      <div>STATUS: {getStatusText()}</div>
    </div>
  );
};
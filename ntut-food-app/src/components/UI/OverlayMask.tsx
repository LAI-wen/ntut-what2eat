import React from 'react';
import { useAppStore } from '../../store/useAppStore';

export const OverlayMask: React.FC = () => {
  const { showOverlay } = useAppStore();

  return (
    <div className={`
      fixed inset-0 bg-black/70 transition-opacity duration-300 z-10
      ${showOverlay ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    `} />
  );
};
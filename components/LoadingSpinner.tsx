'use client'

import { Logo } from '@/components/Logo';
import { Coins } from 'lucide-react';
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center space-y-4">
        <Coins className="h-12 w-12 animate-bounce text-yellow-500" />
        <Logo />
      </div>
    </div>
  );
};

export default LoadingSpinner;

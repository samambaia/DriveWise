'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function SplashScreen() {
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogo(true);
      window.location.href = '/';
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary to-primary-container flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6">
        {showLogo && (
          <>
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center elevation-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-20 h-20">
                  <defs>
                    <linearGradient id="splashGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00897B" />
                      <stop offset="100%" stopColor="#00695C" />
                    </linearGradient>
                    <linearGradient id="splashAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFA000" />
                      <stop offset="100%" stopColor="#FF8F00" />
                    </linearGradient>
                  </defs>
                  
                  <circle cx="256" cy="256" r="240" fill="url(#splashGradient)" />
                  <circle cx="256" cy="256" r="220" fill="none" stroke="white" strokeWidth="8" opacity="0.2"/>
                  
                  <g transform="translate(120, 120)">
                    <path d="M20 100 H60 L70 70 H110 L125 100 H150 V140 H20 V100 Z" fill="white" opacity="0.95"/>
                    <path d="M75 70 L90 50 H100 L115 70" fill="white" opacity="0.9"/>
                    <circle cx="50" cy="140" r="22" fill="white" opacity="0.95" />
                    <circle cx="50" cy="140" r="12" fill="url(#splashGradient)" />
                    <circle cx="120" cy="140" r="22" fill="white" opacity="0.95" />
                    <circle cx="120" cy="140" r="12" fill="url(#splashGradient)" />
                    <rect x="145" y="110" width="8" height="15" rx="2" fill="url(#splashAccent)" />
                  </g>
                  
                  <g transform="translate(256, 256)">
                    <text x="0" y="0" textAnchor="middle" dominantBaseline="central" fontSize="180" fontWeight="bold" fill="white" fontFamily="Inter, Arial, sans-serif">
                      $
                    </text>
                  </g>
                  
                  <path d="M 256 80 A 176 176 0 0 1 432 256" fill="none" stroke="url(#splashAccent)" strokeWidth="12" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-primary-foreground">DriveWise</h1>
            <p className="text-primary-foreground/80 text-sm">Controle financeiro para motoristas de app</p>
          </>
        )}
        {!showLogo && (
          <Loader2 className="w-12 h-12 text-primary-foreground animate-spin" />
        )}
      </div>
    </div>
  );
}

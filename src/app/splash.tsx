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
                <img 
                  src="/icon.png" 
                  alt="DriveWise Logo" 
                  className="w-20 h-20"
                />
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

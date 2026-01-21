'use client';

import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <Loader2 className="h-16 w-16 text-primary animate-spin" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">Carregando...</h2>
          <p className="text-sm text-muted-foreground mt-2">Preparando sua experiência financeira</p>
        </div>
      </div>
    </div>
  );
}

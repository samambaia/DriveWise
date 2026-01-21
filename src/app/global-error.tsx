'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-error/10">
              <AlertTriangle className="h-12 w-12 text-error" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Ops! Algo deu errado</h1>
              <p className="text-muted-foreground">
                Ocorreu um erro inesperado. Por favor, tente novamente.
              </p>
            </div>
            
            {error.message && (
              <div className="p-4 bg-accent rounded-xl text-left">
                <p className="text-sm text-muted-foreground break-words">
                  {error.message}
                </p>
              </div>
            )}
            
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl gradient-primary text-primary-foreground font-medium hover:elevation-2 transition-all"
            >
              <RefreshCw className="h-5 w-5" />
              Tentar novamente
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

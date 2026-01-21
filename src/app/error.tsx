'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="max-w-md w-full rounded-2xl elevation-2">
        <CardHeader>
          <div className="flex flex-col items-center gap-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-error/10">
              <AlertTriangle className="h-10 w-10 text-error" />
            </div>
            <CardTitle className="text-2xl">Ops! Algo deu errado</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            Ocorreu um erro ao carregar esta página. Por favor, tente novamente.
          </p>
          
          {error.message && (
            <div className="p-4 bg-accent rounded-xl">
              <p className="text-sm text-muted-foreground break-words">
                {error.message}
              </p>
            </div>
          )}
          
          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl gradient-primary text-primary-foreground font-medium hover:elevation-2 transition-all"
            >
              <RefreshCw className="h-5 w-5" />
              Tentar novamente
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 border-primary text-primary font-medium hover:bg-primary/5 transition-all"
            >
              <Home className="h-5 w-5" />
              Voltar para o início
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

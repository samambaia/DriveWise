import Link from 'next/link';
import { Search, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="max-w-md w-full rounded-2xl elevation-2">
        <CardHeader>
          <div className="flex flex-col items-center gap-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
              <Search className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">Página não encontrada</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            A página que você está procurando não existe ou foi movida.
          </p>
          
          <div className="space-y-3">
            <Link href="/" className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl gradient-primary text-primary-foreground font-medium hover:elevation-2 transition-all inline-flex">
              <Home className="h-5 w-5" />
              Voltar para o início
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TestPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">DriveWise - Teste</h1>
        <p className="text-lg">Se você vê esta página, o Next.js está funcionando!</p>
        <div className="space-y-2">
          <p>✅ Next.js carregou</p>
          <p>✅ Tailwind CSS funcionando</p>
          <p>✅ Página renderizando</p>
        </div>
      </div>
    </div>
  );
}
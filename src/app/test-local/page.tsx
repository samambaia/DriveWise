export default function TestPage() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          DriveWise - Teste Local
        </h1>
        <p className="text-gray-600 mb-4">
          Se você vê esta página, o Next.js local está funcionando!
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>✅ Next.js carregado</p>
          <p>✅ Tailwind CSS funcionando</p>
          <p>✅ Servidor local respondendo</p>
          <p>⏰ 2026-01-23 00:00:00</p>
        </div>
        <div className="mt-6">
          <a
            href="https://appdrivewise.netlify.app/"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver Versão de Produção →
          </a>
        </div>
      </div>
    </div>
  );
}

import { DollarSign } from 'lucide-react';

export function CostsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Análisis de Costos</h1>
        <p className="text-sm text-gray-400">
          Desglose y análisis de costos por modelo y agente
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-gray-800 bg-gray-900 py-20">
        <DollarSign className="mb-3 h-12 w-12 text-gray-600" />
        <p className="text-lg font-medium text-gray-400">
          Vista de Costos
        </p>
        <p className="text-sm text-gray-500">
          Se implementará en el próximo sprint
        </p>
      </div>
    </div>
  );
}
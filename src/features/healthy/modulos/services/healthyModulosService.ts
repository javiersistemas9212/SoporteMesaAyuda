import healthyMock from '../../../../app/Mocks/healthyModulos.json';
import type {
  HealthyModulosData,
  HealthySummary,
  ModuleCheckResult,
  ClientName,
  ModuleName,
} from '../types/healthyModulos.types';

export const CLIENTS: ClientName[] = ['Valores', 'Fiduciaria', 'BBVA', 'SURA', 'Makers'];

export const MODULES: ModuleName[] = [
  'Activo',
  'Cierre pasivo',
  'Contabilidad',
  'Gestión de ordenes',
  'Ordenes',
  'Riesgos',
  'Senty',
];

export function fetchHealthyModulos(): HealthyModulosData {
  return healthyMock as HealthyModulosData;
}

export function getResultByClientModule(
  results: ModuleCheckResult[],
  client: ClientName,
  module: ModuleName,
): ModuleCheckResult | undefined {
  return results.find(r => r.client === client && r.module === module);
}

export function calculateSummary(results: ModuleCheckResult[]): HealthySummary {
  return {
    ok: results.filter(r => r.status === 'OK').length,
    off: results.filter(r => r.status === 'OFF').length,
    error: results.filter(r => r.status === 'ERROR').length,
  };
}

export function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

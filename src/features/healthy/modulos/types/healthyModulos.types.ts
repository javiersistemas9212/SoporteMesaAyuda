export type ModuleStatus = 'OK' | 'OFF' | 'ERROR';

export type ClientName = 'Valores' | 'Fiduciaria' | 'BBVA' | 'SURA' | 'Makers';

export type ModuleName =
  | 'Activo'
  | 'Cierre pasivo'
  | 'Contabilidad'
  | 'Gestión de ordenes'
  | 'Ordenes'
  | 'Riesgos'
  | 'Senty';

export interface ModuleCheckResult {
  client: ClientName;
  module: ModuleName;
  status: ModuleStatus;
  url: string;
  statusCode: number;
  message: string;
  responseTime: number;
}

export interface HealthyModulosData {
  lastExecution: string;
  results: ModuleCheckResult[];
}

export interface HealthySummary {
  ok: number;
  off: number;
  error: number;
}

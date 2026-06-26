import mockData from '../../../../app/Mocks/Cargajira.json';
import agentesData from '../../../../app/Mocks/agentes.json';
import type { TicketUsuario, Agente, EstadoCounts } from '../types/ticketUsuario.types';

export function getAgentes(): Agente[] {
  return agentesData as Agente[];
}

export function getTicketsByAgente(
  nombre: string,
  fechaInicio?: string,
  fechaFin?: string,
): TicketUsuario[] {
  return (mockData as TicketUsuario[]).filter(t => {
    if (t.AsignadoA !== nombre) return false;
    if (fechaInicio && t.FechaCreacion < fechaInicio) return false;
    if (fechaFin && t.FechaCreacion > fechaFin) return false;
    return true;
  });
}

export function calcularEstadoCounts(tickets: TicketUsuario[]): EstadoCounts {
  return tickets.reduce<EstadoCounts>(
    (acc, t) => {
      if (t.Estado === 'Abierto') acc.abierto++;
      else if (t.Estado === 'En proceso') acc.enProceso++;
      else if (t.Estado === 'Cerrado') acc.cerrado++;
      else if (t.Estado === 'Pendiente') acc.pendiente++;
      return acc;
    },
    { abierto: 0, enProceso: 0, cerrado: 0, pendiente: 0 },
  );
}

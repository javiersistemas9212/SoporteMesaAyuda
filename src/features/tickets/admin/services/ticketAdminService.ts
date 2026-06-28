import mockData from '../../../../app/Mocks/Cargajira.json';
import type { TicketUsuario } from '../../usuario/types/ticketUsuario.types';

export function findTicketById(id: string): TicketUsuario | null {
  const ticket = (mockData as TicketUsuario[]).find(
    t => t.IdTicket.toLowerCase() === id.trim().toLowerCase(),
  );
  return ticket ?? null;
}

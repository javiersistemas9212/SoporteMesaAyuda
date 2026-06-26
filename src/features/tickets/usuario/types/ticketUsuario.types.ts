export type TicketTipo = 'Funcional' | 'Técnico';
export type TicketEstado = 'Abierto' | 'En proceso' | 'Cerrado' | 'Pendiente';

export interface TicketUsuario {
  IdTicket: string;
  AsignadoA: string;
  Estado: TicketEstado;
  Titulo: string;
  Prioridad: 'Alta' | 'Media' | 'Baja';
  FechaCreacion: string;
  Validaciones: string[];
  Tipo: TicketTipo;
}

export interface Agente {
  Id: number;
  Nombre: string;
}

export interface EstadoCounts {
  abierto: number;
  enProceso: number;
  cerrado: number;
  pendiente: number;
}

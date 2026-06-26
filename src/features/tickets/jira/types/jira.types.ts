export interface JiraTicket {
  IdTicket: string;
  AsignadoA: string;
  Estado: 'Abierto' | 'En proceso' | 'Cerrado' | 'Pendiente';
  Titulo: string;
  Prioridad: 'Alta' | 'Media' | 'Baja';
  FechaCreacion: string;
  Validaciones: string[];
  Tipo?: 'Funcional' | 'Técnico';
}

export type JiraEstado = JiraTicket['Estado'];
export type JiraPrioridad = JiraTicket['Prioridad'];

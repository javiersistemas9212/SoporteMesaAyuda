export type TipoCliente = 'SaaS' | 'On-premise'

export interface Cliente {
  Id: number
  NombreCorto: string
  NombreLargo: string
  Nit: string
  ColorInstitucional: string
  VersionActual: string
  ContactoTI: string
  Creditos: number
  TipoCliente: TipoCliente
}

export interface CreateClienteRequest {
  NombreCorto: string
  NombreLargo: string
  Nit: string
  ColorInstitucional: string
  VersionActual: string
  ContactoTI: string
  Creditos: number
  TipoCliente: TipoCliente
}

export type UpdateClienteRequest = Partial<CreateClienteRequest>

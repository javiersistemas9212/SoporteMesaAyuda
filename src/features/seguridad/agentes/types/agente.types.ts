export interface Agente {
  Id: number
  Nombre: string
  Correo: string
  Contrasena: string
  RolId: number
  Rol: string
}

export interface CreateAgenteRequest {
  Nombre: string
  Correo: string
  Contrasena: string
  RolId: number
}

export interface UpdateAgenteRequest {
  Nombre?: string
  Correo?: string
  Contrasena?: string
  RolId?: number
}

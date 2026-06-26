export interface AgenteRaw {
  Id: number
  Nombre: string
  Correo: string
  Contrasena: string
  RolId: number
}

export interface RolRaw {
  Id: number
  Nombre: string
}

export interface AuthUser {
  id: number
  nombre: string
  correo: string
  rolId: number
  rol: string
}

export interface LoginCredentials {
  correo: string
  contrasena: string
}

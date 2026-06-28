export type TipoObjeto = 'Objeto' | 'Datos';
export type AccionScript = 'Crear' | 'Actualizar' | 'Eliminar';
export type BaseDatos = 'dbfondos' | 'sentyclient' | 'dbejemplo';
export type CanalAtencion = 'Chat' | 'Correo o plataforma' | 'Llamada';

export interface ScriptObjeto {
  id: string;
  tipoObjeto: TipoObjeto;
  accion: AccionScript;
  baseDatos: BaseDatos;
  nombreScript: string;
  descripcion: string;
}

export type CreateScriptRequest = Omit<ScriptObjeto, 'id'>;
export type UpdateScriptRequest = ScriptObjeto;

export interface BitacoraData {
  agregarBitacora: boolean;
  canales: CanalAtencion[];
  detalle: string;
}

export interface TicketAdminFormState {
  scripts: ScriptObjeto[];
  bitacora: BitacoraData;
}

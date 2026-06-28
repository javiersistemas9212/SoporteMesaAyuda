import { z } from 'zod';

export const scriptSchema = z.object({
  tipoObjeto: z.enum(['Objeto', 'Datos'], { required_error: 'Requerido' }),
  accion: z.enum(['Crear', 'Actualizar', 'Eliminar'], { required_error: 'Requerido' }),
  baseDatos: z.enum(['dbfondos', 'sentyclient', 'dbejemplo'], { required_error: 'Requerido' }),
  nombreScript: z.string().min(1, 'Requerido').max(200, 'Máximo 200 caracteres'),
  descripcion: z.string().min(1, 'Requerido').max(1000, 'Máximo 1000 caracteres'),
});

export type ScriptFormValues = z.infer<typeof scriptSchema>;

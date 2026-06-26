import { z } from 'zod'

export const createAgenteSchema = z.object({
  Nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  Correo: z.string().email('Correo inválido'),
  Contrasena: z.string().min(6, 'Mínimo 6 caracteres'),
  RolId: z.number({ invalid_type_error: 'Selecciona un rol' }).positive('Selecciona un rol'),
})

export const updateAgenteSchema = createAgenteSchema.extend({
  Contrasena: z.string().min(6, 'Mínimo 6 caracteres').or(z.literal('')),
})

export type CreateAgenteFormValues = z.infer<typeof createAgenteSchema>
export type UpdateAgenteFormValues = z.infer<typeof updateAgenteSchema>

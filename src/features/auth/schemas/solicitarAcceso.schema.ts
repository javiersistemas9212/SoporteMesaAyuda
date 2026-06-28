import { z } from 'zod'

export const solicitarAccesoSchema = z.object({
  nombreCompleto: z
    .string()
    .min(3, 'Ingresa tu nombre completo (mínimo 3 caracteres)')
    .max(100, 'El nombre no puede superar 100 caracteres'),
  correo: z
    .string()
    .email('Ingresa un correo electrónico válido')
    .max(150, 'El correo no puede superar 150 caracteres'),
})

export type SolicitarAccesoFormValues = z.infer<typeof solicitarAccesoSchema>

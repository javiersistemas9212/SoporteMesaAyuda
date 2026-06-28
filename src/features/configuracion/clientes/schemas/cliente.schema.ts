import { z } from 'zod'

export const clienteSchema = z.object({
  NombreCorto: z.string().min(2, 'Mínimo 2 caracteres'),
  NombreLargo: z.string().min(3, 'Mínimo 3 caracteres'),
  Nit: z.string().min(5, 'NIT inválido'),
  ColorInstitucional: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Color inválido'),
  VersionActual: z.string().min(1, 'Ingresa la versión'),
  ContactoTI: z.string().email('Correo inválido'),
  Creditos: z
    .number({ invalid_type_error: 'Ingresa un número válido' })
    .int('Solo números enteros')
    .min(0, 'Mínimo 0 créditos'),
  TipoCliente: z.enum(['SaaS', 'On-premise'], {
    errorMap: () => ({ message: 'Selecciona un tipo de cliente' }),
  }),
})

export type ClienteFormValues = z.infer<typeof clienteSchema>

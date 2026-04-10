import { z } from 'zod';

// Definimos las reglas de validación
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "El correo es obligatorio" })
    .email({ message: "Formato de correo inválido" }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  rememberMe: z.boolean()
});

// Extraemos el tipo de TypeScript automáticamente del esquema
export type LoginFormValues = z.infer<typeof loginSchema>;
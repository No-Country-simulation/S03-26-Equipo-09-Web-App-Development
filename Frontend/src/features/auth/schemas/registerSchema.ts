import { z } from 'zod';

// Schema de validación para registro
export const registerSchema = z.object({
  companyName: z
    .string()
    .min(1, { message: "El nombre de la empresa es obligatorio" })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  email: z
    .string()
    .min(1, { message: "El correo es obligatorio" })
    .email({ message: "Formato de correo inválido" }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  confirmPassword: z
    .string()
    .min(1, { message: "Confirma tu contraseña" }),
  acceptTerms: z
    .boolean()
    .refine(val => val === true, { message: "Debes aceptar los términos y condiciones" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

// Tipo extraído automáticamente del schema
export type RegisterFormValues = z.infer<typeof registerSchema>;

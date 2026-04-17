import i18n from 'i18next';

/**
 * Función helper para traducir claves dinámicas sin errores de TypeScript.
 *
 * i18next con tipado estricto no permite strings dinámicos en t().
 * Esta función bypasea el type check usando la instancia global de i18n
 * que acepta `string` directamente.
 *
 * Uso:
 *   tx(`estado.${estado}`)      // ✅ sin error de TS
 *   t('estado.LEAD_ACTIVO')     // ✅ autocomplete funciona
 */
export const tx = (key: string, options?: Record<string, unknown>): string => {
  return i18n.t(key, options as never) as unknown as string;
};

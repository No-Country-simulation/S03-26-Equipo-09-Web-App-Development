# Convenciones del Proyecto

Este documento establece las convenciones de desarrollo para mantener un código consistente, legible y fácil de mantener.

## Tabla de Contenidos

- [Convenciones de Nombres](#convenciones-de-nombres)
  - [Carpetas y Archivos](#carpetas-y-archivos)
  - [Componentes](#componentes)
  - [Hooks](#hooks)
  - [Constantes](#constantes)
- [Convenciones de Exportación](#convenciones-de-exportación)
- [Convenciones de Ramas](#convenciones-de-ramas)
- [Otras Buenas Prácticas](#otras-buenas-prácticas)

## Convenciones de Nombres

### Carpetas y Archivos

- Usa **kebab-case** para nombres de carpetas y archivos.
  - Ejemplo: `user-profile`, `auth-service`.
- Los archivos de componentes deben tener la extensión `.tsx`.
  - Ejemplo: `button.tsx`, `header.tsx`.
- Los archivos de estilos deben tener la extensión `.css` o `.module.css` si son módulos de CSS.
  - Ejemplo: `button.module.css`.

### Componentes

- Usa **PascalCase** para los nombres de componentes.
  - Ejemplo: `Button`, `UserProfile`.
- Cada componente debe estar en su propia carpeta si incluye archivos relacionados (estilos, pruebas, etc.).
  - Ejemplo:
    ```
    src/components/Button/
      Button.tsx
      Button.test.tsx
      Button.module.css
      index.ts
    ```

### Hooks

- Usa **camelCase** para los nombres de hooks.
  - Ejemplo: `useAuth`, `useFetchData`.
- Los hooks personalizados deben estar en la carpeta `src/hooks` o en una subcarpeta específica.

### Constantes

- Usa **SCREAMING_SNAKE_CASE** para constantes globales.
  - Ejemplo: `API_URL`, `DEFAULT_LANGUAGE`.
- Las constantes específicas de un componente o módulo deben definirse dentro del archivo correspondiente.

## Convenciones de Exportación

- Evita el uso de `export default`. Usa siempre `export` con nombre.
  - Ejemplo:
    ```tsx
    // Correcto
    export const Button = () => {
      return <button>Click me</button>;
    };

    // Incorrecto
    export default Button;
    ```
- Usa un archivo `index.ts` para exportar múltiples elementos de una carpeta.
  - Ejemplo:
    ```ts
    export * from './Button';
    export * from './Input';
    ```

## Convenciones de Ramas

- Usa el formato de **Conventional Commits** para nombrar las ramas.
  - Ejemplo: `feat/login-page`, `fix/button-styles`, `chore/update-dependencies`.
- Prefijos comunes:
  - `feat/`: Para nuevas funcionalidades.
  - `fix/`: Para correcciones de errores.
  - `chore/`: Para tareas de mantenimiento.
  - `docs/`: Para cambios en la documentación.
  - `test/`: Para agregar o modificar pruebas.

## Otras Buenas Prácticas

- **Estructura de Carpetas:** Sigue las recomendaciones del archivo `architecture.md` para organizar el código.
- **Internacionalización:** Usa `react-i18next` para manejar textos dinámicos y coloca los archivos de traducción en `src/assets/locales`.
- **Estilo de Código:** Usa las configuraciones de ESLint y Prettier incluidas en el proyecto para mantener un código limpio y consistente.
- **Pruebas:** Coloca las pruebas junto al código fuente correspondiente y sigue las convenciones de Vitest y React Testing Library.
- **Commits:** Asegúrate de que los mensajes de commit sigan el formato de Conventional Commits.
  - Ejemplo:
    ```
    feat: add login page
    fix: correct button alignment
    chore: update dependencies
    ```
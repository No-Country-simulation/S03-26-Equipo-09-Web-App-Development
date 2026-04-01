# Arquitectura del Proyecto

Este documento describe la estructura de carpetas del proyecto, indicando el propósito de cada directorio y dónde deben ubicarse los diferentes componentes, hooks, features, páginas, rutas, etc.

## Tabla de Contenidos

- [Estructura General](#estructura-general)
- [Descripción de Carpetas](#descripción-de-carpetas)
  - [src](#src)
    - [assets](#assets)
    - [common](#common)
    - [components](#components)
    - [features](#features)
    - [hooks](#hooks)
    - [pages](#pages)
    - [routes](#routes)
    - [store](#store)
    - [styles](#styles)
  - [public](#public)
- [Convenciones de Desarrollo](#convenciones-de-desarrollo)

## Estructura General

La estructura del proyecto sigue un enfoque modular y escalable, diseñado para facilitar el desarrollo y mantenimiento del CRM. A continuación, se describe la jerarquía principal:

```
src/
  assets/
  common/
  components/
  features/
  hooks/
  pages/
  routes/
  store/
  styles/
public/
```

## Descripción de Carpetas

### src

Contiene todo el código fuente de la aplicación. Es el núcleo del proyecto.

#### assets

- **Propósito:** Almacena recursos estáticos como imágenes, íconos, y archivos de localización.
- **Subcarpetas:**
  - `locales/`: Archivos de traducción para internacionalización.

  
- **Ejemplo de carpetas:**
  ```
  - src/assets/images
  - src/assets/images/webp
  - src/assets/images/png
  - src/assets/icons
  - src/assets/fonts
  - src/assets/locales
  ```

#### common

- **Propósito:** Contiene utilidades, tipos globales y configuraciones compartidas.
- **Archivos destacados:**
  - `i18n.ts`: Configuración de internacionalización.
  - `utils.ts`: Funciones utilitarias reutilizables.
  - `types.ts`: Definiciones de tipos TypeScript globales.

#### components

- **Propósito:** Almacena componentes reutilizables de la interfaz de usuario.
- **Subcarpetas:**
  - `charts/`: Componentes relacionados con gráficos (bar, line, pie).
  - `forms/`: Componentes relacionados con formularios.
  - `layout/`: Componentes de diseño general (headers, footers, etc.).
  - `ui/`: Componentes básicos de UI (botones, inputs, etc.).
  - `utils/`: Herramientas de desarrollo como devtools.

- **ejemplo de carpetas:**
    ```
    - src/components/ui/Example/
    - Example.tsx
    - Example.stories.tsx
    - Example.test.tsx
    - index.ts
    ```

#### features

- **Propósito:** Contiene módulos funcionales específicos del CRM, como autenticación, reportes, etc.
- **Convención:** Cada feature debe tener su propia carpeta con componentes, hooks y lógica relacionados.

- **ejemplo de carpetas:**
    ```
    - src/features/inbox
    - inbox/components
    - inbox/hooks
    - inbox/services
    - inbox/types
    ```

#### hooks

- **Propósito:** Almacena hooks personalizados reutilizables.
- **Ejemplo:** Hooks para manejar lógica de formularios o integraciones con APIs.

- **ejemplo de carpetas:**
    ```
    src/hooks/
        api/
        useFetch.ts
        useMutation.ts

        auth/
        useAuth.ts
        useUser.ts

        index.ts
    ```

#### pages

- **Propósito:** Contiene las vistas principales de la aplicación.
- **Ejemplo:**
  - `Home.tsx`: Página de inicio.
  - `About.tsx`: Página sobre nosotros.
  - `Login.tsx`: Página principal de login.

#### routes

- **Propósito:** Define las rutas de la aplicación.
- **Archivos destacados:**
  - `__root.ts`: Configuración de la ruta raíz.
  - `index.ts`: Exporta todas las rutas.

#### store

- **Propósito:** Manejo del estado global utilizando Zustand.
- **Convención:** Cada slice de estado debe estar bien definido y documentado.

- **ejemplos de carpetas:**
    ```
    src/store/
        auth/
        auth.store.ts

        user/
        user.store.ts

        index.ts
    ```

#### styles

- **Propósito:** Almacena estilos globales y configuraciones de Tailwind CSS.
- **Archivos destacados:**
  - `tailwind.css`: Archivo principal de estilos.

### public

- **Propósito:** Contiene archivos estáticos que se sirven directamente, como el `index.html` y el logo del proyecto.
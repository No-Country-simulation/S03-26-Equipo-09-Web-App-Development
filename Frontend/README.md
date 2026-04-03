# Frontend CRM Omnicanal

![](/public/vite-react-boilerplate.png)

Frontend del proyecto S03-26-Equipo-09-Web-App-Development, basado en Vite + React y adaptado como punto de partida para el CRM omnicanal.

## Tabla de Contenidos

- [Resumen](#resumen)
- [Requisitos](#requisitos)
- [Primeros Pasos](#primeros-pasos)
- [Nota Importante](#nota-importante)
- [Pruebas](#pruebas)
- [Preparación para Despliegue](#preparación-para-despliegue)
- [Devtools](#devtools)
- [Paquetes Instalados](#paquetes-instalados)
- [Scripts Disponibles](#scripts-disponibles)

## Resumen

Este frontend funciona como base del CRM para startups y pymes, con enfoque en escalabilidad, mantenibilidad y velocidad de desarrollo. Mantiene la estructura de una plantilla moderna, pero aterrizada al flujo del repositorio actual.

- [pnpm](https://pnpm.io) - Alternativa estricta y eficiente a npm, con hasta 3x más rendimiento
- [TypeScript](https://www.typescriptlang.org) - Superset tipado de JavaScript, diseñado para aplicaciones de gran escala
- [ESLint](https://eslint.org) - Análisis estático para encontrar problemas en el código
- [Prettier](https://prettier.io) - Formateador de código con reglas opinadas
- [Vite](https://vitejs.dev) - Tooling frontend optimizado con soporte TypeScript desde el inicio
- [React](https://react.dev) - Librería moderna para construir interfaces de usuario basadas en componentes
- [Tailwind CSS](https://tailwindcss.com) - Framework utility-first para construir interfaces responsivas rápidamente
- [Storybook](https://storybook.js.org) - Entorno para construir y probar componentes de UI en aislamiento
- [TanStack Router](https://tanstack.com/router/v1) - Enrutado moderno, escalable y con tipado fuerte para React
- [TanStack Query](https://tanstack.com/query/latest) - Gestión declarativa de consultas y mutaciones
- [TanStack Table](https://tanstack.com/table/v8) - Librería headless para tablas y datagrids
- [Zustand](https://zustand-demo.pmnd.rs) - Manejo de estado pequeño, rápido y escalable
- [React Hook Form](https://react-hook-form.com) - Formularios performantes y extensibles con validación sencilla
- [Zod](https://zod.dev) - Validación de esquemas con inferencia de tipos en TypeScript
- [React Testing Library](https://testing-library.com) - Solución ligera y orientada a buenas prácticas para pruebas de componentes
- [Vitest](https://vitest.dev) - Framework de pruebas unitarias rápido, impulsado por Vite
- [Playwright](https://playwright.dev) - Pruebas end-to-end confiables para aplicaciones web modernas
- [Nivo](https://nivo.rocks) - Conjunto de componentes de visualización de datos sobre D3 + React
- [react-i18next](https://react.i18next.com/) - Framework robusto de internacionalización para React
- [Faker](https://fakerjs.dev/) - Generación de datos falsos para pruebas y desarrollo
- [Dayjs](https://day.js.org/en/) - Librería liviana para manejo de fechas y horas
- [Husky](https://github.com/typicode/husky#readme) + [Commitizen](https://github.com/commitizen/cz-cli#readme) + [Commitlint](https://github.com/conventional-changelog/commitlint#readme) - Hooks de Git y validación de commits para mantener mensajes consistentes
- [ts-reset](https://github.com/total-typescript/ts-reset#readme) - Mejoras a los tipos nativos de TypeScript para aplicaciones
- [Docker](https://www.docker.com) - Contenerización para despliegue de la aplicación

Una lista más detallada de paquetes está en la sección [Paquetes Instalados](#paquetes-instalados). Los paquetes no listados arriba incluyen devtools, utilidades de UI y plugins/configs de ESLint.

## Requisitos

- [NodeJS 18+](https://nodejs.org/en)
- [pnpm](https://pnpm.io) (o equivalente)

Si quieres usar el Dockerfile incluido, también necesitas [Docker](https://www.docker.com).

## Primeros Pasos

Clona el repositorio oficial del equipo:

```bash
git clone https://github.com/No-Country-simulation/S03-26-Equipo-09-Web-App-Development.git
```

Entra al proyecto y luego al frontend:

```bash
cd S03-26-Equipo-09-Web-App-Development
cd Frontend
```

Instala dependencias:

```bash
pnpm install
```

Inicia el entorno de desarrollo:

```bash
pnpm run dev
```

Configuracion opcional inicial (hooks y Playwright):

```bash
pnpm run setup
```

Con esto el frontend queda listo para comenzar a implementar modulos del CRM (auth, inbox unificado, pipeline y reportes).

Nota: este proyecto trae dos hooks de Git con Husky.
- prepare-commit-msg para ejecutar Commitizen
- commit-msg para validar con Commitlint

Commitlint asegura que el mensaje siga Conventional Commits (y lo hará si usas Commitizen).

Si deseas quitar hooks, elimina el archivo correspondiente dentro de .husky.

## Nota Importante

1. Este frontend parte de una plantilla base y no incluye aun la implementacion funcional completa del producto. Incluye utilidades de arranque (tipos, devtools, ruteo e i18n) para acelerar el desarrollo del CRM.

2. Como Git no incluye carpetas vacías en commits, se añadieron README de marcador de posición en directorios vacíos. Esos README describen cómo usar la estructura propuesta. Revisa por ejemplo:
- [Organización recomendada de componentes](src/components/README.md)
- [Estructura recomendada de features](src/features/README.md)

3. [Faker](https://fakerjs.dev/) se incluye para facilitar demos y pruebas aisladas. Sin embargo, por un [bug conocido](https://github.com/faker-js/faker/issues/1791), importar Faker desde el paquete principal puede inflar el bundle hasta 2 MB o más. Prefiere importaciones localizadas:

```ts
// import { faker } from '@faker-js/faker';
import { faker } from '@faker-js/faker/locale/en';
```

Con eso, el tamaño importado baja aprox. a 600 KB. Faker NO debe usarse en producción, solo en pruebas o demos.

4. Al ser un proyecto academico/equipo, se recomienda acordar una politica de actualizacion de dependencias por sprint para evitar drift tecnico.

## Pruebas

Las pruebas unitarias se realizan con React Testing Library + Vitest y las pruebas end-to-end con Playwright.

Para correr todo (unitarias + e2e):

```bash
pnpm run test
```

### Pruebas Unitarias

Se asume que las pruebas unitarias estarán colocadas junto al código fuente. Mira el README de ejemplo en src/components.

Para ejecutar solo unitarias:

```bash
pnpm run test:unit
```

Para cobertura:

```bash
pnpm run test:unit:coverage
```

Por defecto, las pruebas unitarias corren en modo watch. Si quieres desactivarlo, ajusta los scripts de package.json.

Antes:

```json
"scripts": {
  "test:unit": "vitest src/",
  "test:unit:coverage": "vitest --coverage src/"
}
```

Después:

```json
"scripts": {
  "test:unit": "vitest run src/",
  "test:unit:coverage": "vitest run --coverage src/"
}
```

Nota: Faker se incluye para datos mock. Revisa el punto 3 en Nota Importante.

### Pruebas End-to-End (E2E)

Para ejecutar e2e:

```bash
pnpm run test:e2e
```

Para abrir reportes:

```bash
pnpm run test:e2e:report
```

## Preparación para Despliegue

Se incluyen instrucciones con y sin Docker. En ambos casos necesitas una plataforma donde alojar la app.

### Sin Docker

Compila con:

```bash
pnpm run build
```

Luego apunta tu servidor web al archivo generado en dist/index.html.

### Con Docker

Se incluye un Dockerfile con base [NGINX](https://www.nginx.com) para despliegues rápidos.

1. pnpm run build
2. docker build . -t <nombre_contenedor>
   - Ejemplo: docker build . -t todo-app
3. docker run -p <puerto>:80 <nombre_contenedor>
   - Ejemplo: docker run -p 8080:80 todo-app

### Integración Continua

No se incluye una plantilla CI por la variedad de herramientas, requisitos y preferencias posibles.

## Devtools

Este proyecto incluye un conjunto de devtools. Algunos vienen como dependencias adicionales y otros están integrados en sus librerías.

### Dependencias de Devtools

- [@tanstack/react-query-devtools](https://tanstack.com/query/v4/docs/react/devtools) - Visualización interna de React Query
- [@tanstack/router-devtools](https://tanstack.com/router/v1/docs/devtools) - Visualización interna de TanStack Router
- [@tanstack/react-table-devtools](https://www.npmjs.com/package/@tanstack/react-table-devtools) - Visualización interna de TanStack Table
- [@hookform/DevTools](https://react-hook-form.com/dev-tools) - Depuración de formularios con React Hook Form

Se incluyen componentes utilitarios en src/components/utils/development-tools/. Estos wrappers verifican si la app corre en desarrollo o producción y renderizan el devtool solo cuando corresponde.

TanStack Query Devtools está listo para usar. Si quieres renderizarlo en producción, sigue la documentación oficial. El componente está en src/App.tsx.

TanStack Router Devtools se usa mediante su wrapper en este proyecto. Puedes modificar o removerlo en src/App.tsx.

TanStack Table Devtools no tiene documentación tan completa, pero su uso es similar. Se renderiza dentro de la tabla (no en modo flotante) y requiere pasar la instancia table de useReactTable(). Si tienes varias tablas, cada una necesita su propio devtool.

```tsx
function Table(): FunctionComponent {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      {/* tabla */}
      <TanStackTableDevelopmentTools table={table} />
    </>
  );
}
```

React Hook Form DevTools también requiere props desde useForm(), específicamente control. Igual que con tablas, cada formulario necesita su propio componente de devtools.

Si quieres restringir devtools a desarrollo, usa los wrappers de src/components/utils/development-tools en lugar de los componentes nativos.

### Devtools Integrados

- Zustand

Zustand incluye middleware de devtools para usar con Redux DevTools.

## Paquetes Instalados

Una lista simplificada está en la sección Resumen.

### Base

- [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vitejs.dev)
- [React](https://react.dev)

### Enrutado

- [TanStack Router](https://tanstack.com/router/v1)

### Linting y Formato

- [ESLint](https://eslint.org)
  - [typescript-eslint](https://typescript-eslint.io)
  - [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier#readme)
  - [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react#readme)
  - [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)
  - [eslint-plugin-react-refresh](https://github.com/ArnaudBarre/eslint-plugin-react-refresh)
  - [eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn#readme)
  - [eslint-plugin-storybook](https://github.com/storybookjs/eslint-plugin-storybook#readme)
- [Prettier](https://prettier.io)

### Gestión de Estado

- [TanStack Query (React Query)](https://tanstack.com/query/latest)
- [Zustand](https://zustand-demo.pmnd.rs)

### UI

- [Tailwind CSS](https://tailwindcss.com)
- [HeadlessUI](https://headlessui.com)
- [heroicons](https://heroicons.com)
- [TanStack Table](https://tanstack.com/table/v8)
- [Storybook](https://storybook.js.org)

### Formularios

- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)

### Visualización de Datos

- [Nivo](https://nivo.rocks)
  - [Line](https://nivo.rocks/line/)
  - [Bar](https://nivo.rocks/bar/)
  - [Pie](https://nivo.rocks/pie/)

### Pruebas

- [Vitest](https://vitest.dev)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright](https://playwright.dev)

### Herramientas de Desarrollo

- [TanStack Query Devtools](https://tanstack.com/query/latest/docs/react/devtools?from=reactQueryV3&original=https%3A%2F%2Ftanstack.com%2Fquery%2Fv3%2Fdocs%2Fdevtools)
- [TanStack Router Devtools](https://tanstack.com/router/v1/docs/devtools)
- [TanStack Table Devtools](https://www.npmjs.com/package/@tanstack/react-table-devtools)
- [React Hook Form Devtools](https://react-hook-form.com/dev-tools)

### Git

- [Husky](https://github.com/typicode/husky#readme)
- [Commitizen](https://github.com/commitizen/cz-cli#readme)
- [Commitlint](https://github.com/conventional-changelog/commitlint#readme)

### Otros

- [i18next-browser-languageDetector](https://github.com/i18next/i18next-browser-languageDetector)
- [i18next](https://www.i18next.com/)
- [react-i18next](https://react.i18next.com/)
- [ts-reset](https://github.com/total-typescript/ts-reset#readme)
- [Faker](https://fakerjs.dev/)
- [Dayjs](https://day.js.org/en/)

## Scripts disponibles

- `pnpm run dev` → inicia entorno de desarrollo
- `pnpm run build` → genera build de producción
- `pnpm run preview` → sirve el build localmente
- `pnpm run storybook` → abre Storybook en http://localhost:6006
- `pnpm run test` → ejecuta unitarias + e2e
- `pnpm run test:unit` → pruebas unitarias
- `pnpm run test:e2e` → pruebas end-to-end
- `pnpm run lint` → revisa errores de lint
- `pnpm run lint:fix` → corrige errores automáticamente
- `pnpm run format` → formatea el código

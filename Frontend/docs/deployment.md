# Guía de Despliegue

Este documento describe los pasos necesarios para desplegar la aplicación, tanto con Docker como sin él, y las mejores prácticas para garantizar un despliegue exitoso.

## Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Despliegue sin Docker](#despliegue-sin-docker)
- [Despliegue con Docker](#despliegue-con-docker)
- [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
- [Mejores Prácticas](#mejores-prácticas)

## Requisitos Previos

Antes de comenzar el despliegue, asegúrate de cumplir con los siguientes requisitos:

- Node.js 18+ instalado en el servidor.
- Acceso al repositorio del proyecto.
- [pnpm](https://pnpm.io) instalado globalmente.
- (Opcional) Docker y Docker Compose instalados si planeas usar contenedores.

## Despliegue sin Docker

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/No-Country-simulation/S03-26-Equipo-09-Web-App-Development.git
   cd S03-26-Equipo-09-Web-App-Development/Frontend
   ```

2. **Instalar dependencias:**
   ```bash
   pnpm install
   ```

3. **Construir la aplicación:**
   ```bash
   pnpm run build
   ```

4. **Servir la aplicación:**
   - Usa un servidor web como NGINX o Apache para servir los archivos estáticos generados en la carpeta `dist/`.
   - Configura el servidor para apuntar a `dist/index.html` como archivo principal.

## Despliegue con Docker

1. **Construir la imagen de Docker:**
   ```bash
   docker build . -t nombre-del-contenedor
   ```
   - Ejemplo: `docker build . -t crm-frontend`

2. **Ejecutar el contenedor:**
   ```bash
   docker run -p 8080:80 nombre-del-contenedor
   ```
   - Ejemplo: `docker run -p 8080:80 crm-frontend`

3. **Acceder a la aplicación:**
   - Abre un navegador y ve a `http://localhost:8080`.

## Configuración de Variables de Entorno

- Las variables de entorno deben definirse en un archivo `.env` en la raíz del proyecto.
- Ejemplo de archivo `.env`:
  ```env
  VITE_API_URL=https://api.example.com
  VITE_ENV=production
  ```
- Asegúrate de no incluir el archivo `.env` en el control de versiones añadiéndolo al `.gitignore`.

## Mejores Prácticas

1. **Automatización:**
   - Usa herramientas de CI/CD como GitHub Actions, Jenkins o GitLab CI para automatizar el proceso de despliegue.

2. **Seguridad:**
   - No expongas variables sensibles en el código fuente.
   - Usa un gestor de secretos para manejar credenciales y claves API.

3. **Backups:**
   - Realiza copias de seguridad regulares de la base de datos y otros recursos críticos.

5. **Pruebas:**
   - Asegúrate de ejecutar las pruebas unitarias y end-to-end antes de desplegar.

Con estos pasos y prácticas, tu aplicación estará lista para ser desplegada de manera eficiente y segura.
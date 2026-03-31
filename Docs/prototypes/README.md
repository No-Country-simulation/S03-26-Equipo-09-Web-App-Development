# 🧩 CRM Intelligent - Prototipado Funcional y Guía de Implementación

Este documento presenta el prototipado funcional del **CRM Intelligent**. Es fundamental recalcar que esta versión ha sido desarrollada utilizando **HTML5, CSS3 y JavaScript en forma pura (Vanilla)** para validar flujos, animaciones y experiencia de usuario (UX). 

**Nota para el equipo de Frontend:** Si este prototipo es aprobado, el código deberá ser migrado a la arquitectura de producción definida en el README.md del frontend, la cual utiliza un stack moderno basado en **Vite, React, TypeScript, Tailwind CSS y TanStack**. La lógica de manipulación del DOM y los *template literals* aquí presentados servirán como base para la creación de componentes reutilizables y la gestión de estados con **Zustand**.

---

## 🎨 Filosofía de Diseño: "The Predictive Curator"
El sistema se rige por el concepto de **Diseño Invisible**, donde la interfaz retrocede para priorizar los datos.
*   **Estética:** Uso de "Tonal Layering" y fondos `surface` (#f8f9fa) para una apariencia limpia.
*   **Identidad:** Colores corporativos basados en Indigo profundo (`primary`) y Esmeralda suave (`secondary`).

---

## 🖥️ Análisis de Prototipos

### 1. 🎞️ Página de Presentación (Splash Screen)

Esta pantalla es la experiencia de marca cinematográfica que inicializa el ecosistema. No es solo una pantalla de carga, es una declaración de intenciones estética y funcional que utiliza animaciones coreografiadas para transmitir inteligencia y precisión editorial.

Es una experiencia cinematográfica de 9.9 segundos diseñada para la inmersión de marca.

*   **Flujo:** Ensamblaje del logo (0-2.5s), activación de la "Pupila Inteligente" (animación `eye-lid-anim` que simula IA) y transición de salida hacia el Hero.
*   **Implementación Actual:** Basada en `@keyframes` de CSS y `setTimeout` en JS para coordinar la navegación.
*   **Migración:** Deberá implementarse como un componente de entrada con hooks de ciclo de vida de React.


### 2. 🚀 Página Hero & Autenticación (`hero_2.html`)

Este prototipo actúa como la puerta de entrada operativa al sistema. 
Su diseño busca generar confianza inmediata mediante métricas de éxito y una interfaz de acceso simplificada que reduce la fricción para el usuario. 
El usuario puede cambiar instantáneamente entre el formulario de Inicio de Sesión y el de Registro de Empresa sin recargas de página, gracias a la manipulación de clases de JavaScript.


*   **Componentes:** Tarjeta de autenticación minimalista con gradientes radiales (`aura-gradient`) y secciones de métricas de eficiencia (91% en cierres).
*   **Interactividad:** Permite alternar entre **Login** y **Registro** mediante manipulación de clases de JS sin recargar la página.
*   **Campos de Datos:** Captura de correo corporativo, empresa y contraseñas validadas visualmente.


### 3. 📝  Dashboard - Módulo de Resumen General

El Panel de Control General es el centro neurálgico para la supervisión administrativa del CRM. Está diseñado para ofrecer al administrador una visión inmediata y de alto nivel sobre el estado operativo de su empresa, la salud de las conexiones y el rendimiento del equipo de ventas . 👀 ¿Qué puede ver el usuario? Al ingresar, el usuario es recibido por una interfaz limpia que utiliza el sistema de capas tonales para priorizar la información crítica : Estado del Sistema en Tiempo Real: Un indicador con animación de pulso (ping) confirma que el sistema está "Online" . Tarjetas de Conectividad (APIs): WhatsApp Cloud API: Muestra el estado de la instancia (Activa) y la latencia actual (120ms) . Email (Brevo/SMTP): Indica la cuota de uso de correos (ej. 2,450 / 3,000) y el estado de sincronización . Métricas de Rendimiento (Key Results): En una franja de color Indigo profundo (primary), se destacan tres KPIs fundamentales : Conversaciones Totales: Volumen acumulado con indicadores de crecimiento mensual (+15%). Respuesta Media: Tiempo promedio de atención (ej. 12m) para medir la eficiencia del equipo. Fuerza de Ventas: Número de vendedores activos en la plataforma . Sidebar de Navegación: Acceso rápido a módulos como Inbox, Funnel, Tareas, Contactos y Métricas.

🕹️ ¿Qué puede hacer el usuario? Este prototipo permite realizar acciones de gestión y supervisión fundamentales: Conmutar Vistas: Mediante la barra lateral, el usuario puede alternar por el momento entre el Resumen y el Inbox Unificado sin recargar la página gracias a la función switchView . Gestión de Conexiones: Botones directos para vincular nuevas cuentas de WhatsApp o conectar correos electrónicos corporativos . Acciones Rápidas de Administración: Añadir nuevos vendedores al equipo . Exportar la base de datos de leads para análisis externo . Acceder a los ajustes globales del sistema . Búsqueda Global: Una barra de búsqueda persistente en la cabecera permite localizar clientes rápidamente en toda la base de datos .

--------------------------------------------------------------------------------

📝 Detalle de los Componentes Indicador de Latencia: Un pequeño tag dinámico (text-[10px] font-bold text-secondary) que ayuda a los administradores a saber si hay retrasos en la red de WhatsApp . Barra de Cuota de Email: Permite visualizar cuántos mensajes de marketing o notificaciones quedan disponibles en el plan de Brevo/SMTP . Modales de Desarrollo: Al ser un prototipo, la mayoría de los botones secundarios (como "Exportar" o "Ajustes") activan un modal de "¡En Construcción!", informando al usuario que la funcionalidad está en camino .


*   **Visualización:** Indicadores de estado del sistema (en vivo), tarjetas de conectividad para **WhatsApp Cloud API** (latencia) y **Brevo/SMTP** (cuotas de email).
*   **KPIs:** Métricas en tiempo real de conversaciones totales y tiempo de respuesta media.
*   **Lógica JS:** La función `switchView` gestiona la visibilidad de los módulos en el DOM, una lógica que se transformará en el enrutamiento de **TanStack Router** en producción.


### 4. 👀  Inbox Unificado (WhatsApp & Email)
Módulo crítico que centraliza la comunicación omnicanal eliminando el ruido visual.
El Inbox Unificado es el corazón operativo del CRM. Siguiendo la lógica de "The Predictive Curator", este módulo centraliza las interacciones de WhatsApp Cloud API y Email (Brevo/SMTP) en una sola interfaz, eliminando la necesidad de saltar entre aplicaciones . 👀 ¿Qué puede ver el usuario? La interfaz está dividida en un esquema de tres columnas optimizado para la productividad : Lista de Conversaciones (Panel Izquierdo): Filtros Inteligentes: Selectores para filtrar por vendedor asignado (ej. "José") y por fecha . Segmentación por Canal: Pestañas para alternar rápidamente entre "Todos", "WhatsApp" o "Email" . Tarjetas de Lead: Cada tarjeta muestra el nombre del cliente, el último mensaje, la hora/fecha, el vendedor responsable y una etiqueta de estado (ej. EN_SEGUIMIENTO o LEAD_ACTIVO) . Visor de Chat (Panel Central): Cabecera de Contexto: Nombre del lead, estado de la negociación y el vendedor asignado . Área de Mensajes Dinámica: Dependiendo del canal, el diseño cambia automáticamente para adaptarse al formato (burbujas para WhatsApp o hilos editoriales para Email) . Barra de Supervisión (Panel Inferior): Un indicador de "Modo Supervisión Activo". Informa al administrador que la vista es de "Solo Observación", bloqueando la escritura para evitar interferencias accidentales en la venta .

🕹️ ¿Qué puede hacer el usuario por el momento? Gestión Omnicanal: Al hacer clic en un lead de WhatsApp, el usuario ve burbujas de chat; si cambia a un lead de Email, el sistema renderiza un formato de correo con asunto y remitentes . Reasignación de Leads: Un botón de "Reasignar" en la cabecera permite mover la conversación a otro miembro del equipo de ventas . Auditoría en Tiempo Real: Los administradores pueden "entrar" a cualquier chat para ver el historial completo y el desempeño del vendedor sin que el cliente lo note . Navegación Móvil: En dispositivos pequeños, el inbox se vuelve responsivo, permitiendo cerrar el visor para volver a la lista de mensajes mediante una flecha de retroceso .
--------------------------------------------------------------------------------
📝 Detalle de los Campos y Componentes Identificadores de Canal: Los leads de WhatsApp muestran el icono oficial de la plataforma en verde, mientras que los de Email utilizan el icono de sobre en azul/indigo para una diferenciación visual instantánea . Avatar Dinámico: El sistema genera un avatar con las iniciales del cliente o un icono representativo según el canal . Etiquetas de Estado (Tags): Componentes visuales de alto contraste (EN_SEGUIMIENTO en verde, LEAD_ACTIVO en azul) que indican en qué fase del embudo se encuentra el prospecto .


*   **Estructura de 3 Columnas:** 
    1.  **Lista de Conversaciones:** Con filtros por vendedor y canal.
    2.  **Visor de Chat:** Renderizado dinámico que cambia según el canal (burbujas para WhatsApp, hilos para Email).
    3.  **Barra de Supervisión:** Modo de "Solo Observación" para administradores que bloquea la escritura.
*   **Funcionalidad:** Reasignación de leads y auditoría en tiempo real del desempeño de ventas.

---

## 🛠️ Hoja de Ruta Tecnológica (Stack de Producción)

Para la implementación definitiva, el equipo de desarrollo seguirá las pautas definida en el README.md del frontend:

*   **Lenguaje y Tooling:** **TypeScript** para tipado fuerte y **Vite** para un desarrollo optimizado.
*   **Gestión de Datos:** **TanStack Query** para la sincronización con las APIs de WhatsApp y Email, y **Zustand** para el estado global del inbox.
*   **Interfaz y Tablas:** **Tailwind CSS** para los estilos y **TanStack Table** para los grids de gestión de leads y métricas.
*   **Calidad:** Pruebas unitarias con **Vitest** y E2E con **Playwright** para asegurar la fiabilidad del flujo de mensajes.
*   **Validación:** **Zod** para asegurar la integridad de los datos en los formularios de registro y configuración de APIs.

Este prototipo en **JS puro** garantiza que la lógica de negocio y la experiencia de usuario estén validadas antes de proceder con el ensamblaje en el stack escalable de React.

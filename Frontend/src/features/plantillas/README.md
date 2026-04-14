# Feature: Plantillas

Módulo de gestión de plantillas de respuesta reutilizables para Email y WhatsApp (integración Brevo).

## 📁 Estructura Modular

```
plantillas/
├── pages/               # Páginas (no componentes)
│   └── Plantillas.tsx
├── hooks/               # Lógica (próximamente)
├── services/            # API Brevo (próximamente)
├── mocks/               # Datos simulados
│   ├── plantillas.mock.ts
│   └── index.ts
├── types/               # Interfaces
│   └── index.ts
└── README.md
```

## 📝 Características de Plantillas

- **Nombre**: Identificador único
- **Contenido**: Cuerpo de la plantilla
- **Canal**: Email o WhatsApp
- **Variables**: Lista de campos dinámicos ({{nombre}}, {{producto}}, etc)
- **Contador de usos**: Tracking de popularidad

## 🎯 Variables Soportadas

```
{{nombre}}        - Nombre del contacto
{{producto}}      - Producto/servicio
{{precio}}        - Valor económico
{{plan}}          - Plan específico
{{empresa}}       - Empresa del contacto
```

## 🔄 Flujo de Uso

1. Vendedor selecciona plantilla en Inbox
2. Sistema detecta variables
3. Vendedor rellena valores en modal
4. Plantilla se reemplaza y previsualiza
5. Vendedor envía o personaliza antes de enviar
6. Sistema registra uso en contador

## 📊 Mock Data

- 5 plantillas predefinidas
- 3 para WhatsApp, 2 para Email
- Variables de 1 a 3 según complejidad

## 🔗 Dependencias

- `../../../common/plantillasHelper` - Lógica de variables y usos
- Brevo API (futura integración)

## 📝 Tags

`plantillas` `omnicanal` `brevo` `variables` `respuestas`

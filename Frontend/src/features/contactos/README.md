# Feature: Contactos

Módulo de gestión y administración de contactos (leads, clientes) en el CRM.

## 📁 Estructura Modular

```
contactos/
├── components/          # Componentes UI
│   └── ContactoTable.tsx
├── hooks/               # Lógica reutilizable (próximamente)
├── services/            # API (próximamente)
├── mocks/               # Datos simulados
│   ├── contactos.mock.ts
│   └── index.ts
├── types/               # Interfaces
│   └── index.ts
└── README.md
```

## 🎯 Estados de Contacto

- `LEAD_NUEVO` - Primer contacto
- `CONTACTADO` - Ya hay comunicación
- `NEGOCIACION` - En proceso de venta
- `CLIENTE` - Venta cerrada
- `PERDIDO` - Lead rechazado

## 🔍 Filtros Soportados

- Por estado
- Por vendedor asignado
- Búsqueda por nombre/email

## 📊 Mock Data

- 6 contactos con variadas etapas
- Distribución: 1 LEAD_NUEVO, 1 CONTACTADO, 2 NEGOCIACION, 1 CLIENTE, 1 PERDIDO

## 🔗 Dependencias

- React hooks
- Tipos de Inbox (para referencias de vendedores)

## 📝 Tags

`leads` `contactos` `crm` `gestión` `estados`

# Feature: Metricas

Módulo de análisis y seguimiento de métricas de vendedores y negocio (disponible solo para ADMIN).

## 📁 Estructura Modular

```
metricas/
├── components/          # Componentes UI
│   └── AdminMetrics.tsx
├── hooks/               # Lógica (próximamente)
├── services/            # API (próximamente)
├── mocks/               # Datos simulados
│   ├── metricas.mock.ts
│   └── index.ts
├── types/               # Interfaces
│   └── index.ts
└── README.md
```

## 📊 Métricas de Admin

- Total de contactos
- Mensajes por canal (WhatsApp, Email)
- Leads activos
- Vendedores activos
- Tasa de conversión global

## 📈 Métricas por Vendedor

- Mensajes suministrados
- Tasa de respuesta
- Tiempo promedio de respuesta
- Leads asignados
- Leads convertidos
- Tasa de conversión individual

## 🔒 Control de Acceso

- Solo ADMIN puede ver métricas globales
- Vendedores ven solo sus propias métricas

## 🔗 Dependencias

- React hooks
- Charts (para visualización)

## 📝 Tags

`analytics` `vendedores` `admin` `kpi` `conversión`

# Feature: Inbox

Módulo centralizado para gestión de conversaciones omnicanal (Email, WhatsApp) en el CRM.

## 📁 Estructura Modular

```
inbox/
├── components/          # Componentes UI (presentacionales)
│   ├── InboxVendedor.tsx
│   ├── InboxAdmin.tsx
│   ├── ConversacionesPanel.tsx
│   ├── SeguimientosPanel.tsx
│   ├── CalificadoPanel.tsx
│   └── UnifiedInbox.tsx
├── hooks/               # Lógica de estado y negocio (reutilizable)
│   └── useConversaciones.ts
├── services/            # Comunicación con API (centralizable)
│   └── inboxService.ts
├── mocks/               # Datos simulados para testing/desarrollo
│   ├── conversaciones.mock.ts
│   ├── usuarios.mock.ts
│   └── index.ts
├── types/               # TypeScript interfaces
│   └── index.ts
└── README.md
```

## 🎯 Principios de Arquitectura

### 1. **Separación de Responsabilidades**
- **`components/`**: Solo UI, sin lógica de datos
- **`hooks/`**: Lógica de estado y filtrado (reutilizable)
- **`services/`**: Comunicación API (mockeable para testing)
- **`mocks/`**: Datos simulados centralizados
- **`types/`**: Interfaces compartidas

### 2. **Importación Correcta**
```typescript
// ✅ CORRECTO - Desde mocks/
import { CONVERSACIONES_MOCK_VENDEDOR } from '../mocks/conversaciones.mock';

// ✅ CORRECTO - Desde hooks/
import { useConversaciones } from '../hooks/useConversaciones';

// ✅ CORRECTO - Desde services/
import { inboxService } from '../services/inboxService';

// ❌ EVITAR - Datos esparcidos en componentes
```

### 3. **Patrón de Uso en Componentes**
```typescript
export const InboxVendedor = ({ vendedorId, vendedorNombre }) => {
  // 1. Usar hook para lógica
  const { conversacionesFiltradas, enviarRespuesta, ... } = useConversaciones(vendedorId);

  // 2. Componente enfocado solo en UI
  return (
    <div>
      {/* Renderizar conversacionesFiltradas */}
    </div>
  );
};
```

## 🔄 Transición Mock → API Real

### Paso 1: Backend listo
```typescript
// src/features/inbox/services/inboxService.ts
async getConversacionesPorVendedor(vendedorId: number): Promise<Conversacion[]> {
  // Descomentar líneas de API real, comentar mock
  const response = await fetch(`${this.apiBaseUrl}/conversaciones/vendedor/${vendedorId}`);
  return response.json();
}
```

### Paso 2: Sin tocar componentes ✨
- Componentes siguen importando desde hooks
- Hooks siguen llamando a `inboxService`
- Solo el servicio cambia

## 📊 Estadísticas

- **Conversaciones mock**: 5 de vendedor + 1 adicional de admin
- **Usuarios mock**: 3 vendedores
- **Filtros soportados**: Canal (Email/WhatsApp), Estado, Búsqueda
- **Canales**: Email, WhatsApp
- **Estados**: pendiente, respondido, cerrado

## 🔗 Dependencias

- `react` - UI base
- `@tanstack/react-router` - Routing
- `jsPDF` - Exportación PDF (InboxVendedor)
- `../../../common/plantillasHelper` - Gestión de plantillas

## 📝 Tags

`omnicanal` `conversaciones` `email/whatsapp` `mock` `modular` `servicios`

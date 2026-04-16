// Estos datos simulan lo que nos enviará el Java después
export const MOCK_DASHBOARD_STATS = {
  totalContactos: 150,
  interaccionesTotales: 1240,
  mensajesSinLeer: 8,
  nuevosLeadsHoy: 12,
  tareasPendientes: 5,
  productosVendidos: 87, // ← Nuevo campo
  contactosPorEstado: {
    "LEAD_ACTIVO": 75,
    "CLIENTE": 60,
    "INACTIVO": 15
  }
};
export const dashboardMockData = { 
  revenue: [
    { month: 'Enero', ingresos: 12000 },
    { month: 'Febrero', ingresos: 15000 },
    { month: 'Marzo', ingresos: 18000 },
    { month: 'Abril', ingresos: 22000 },
    { month: 'Mayo', ingresos: 20000 },
    { month: 'Junio', ingresos: 25000 }
  ],
  sources: [
    { fuente: 'Google Ads', leads: 40 },
    { fuente: 'Facebook Ads', leads: 30 },
    { fuente: 'Email Marketing', leads: 20 },
    { fuente: 'Referidos', leads: 10 }
  ],
  leadsByStatus: [
    { estado: 'Lead Activo', cantidad: 75 },
    { estado: 'Cliente', cantidad: 60 },
    { estado: 'Inactivo', cantidad: 15 }
  ]
};

// Estos datos simulan lo que nos enviará el Java después
export const MOCK_DASHBOARD_STATS = {
  totalContactos: 150,
  interaccionesTotales: 1240,
  mensajesSinLeer: 8,
  nuevosLeadsHoy: 12,
  tareasPendientes: 5,
  contactosPorEstado: {
    "NUEVO": 45,
    "EN_SEGUIMIENTO": 30,
    "CLIENTE": 60,
    "PERDIDO": 15
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
    { estado: 'NUEVO', cantidad: 45 },
    { estado: 'EN_SEGUIMIENTO', cantidad: 30 },
    { estado: 'CLIENTE', cantidad: 60 },
    { estado: 'PERDIDO', cantidad: 15 }
  ]
};

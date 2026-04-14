/**
 * Export Service - CSV/PDF Export para Leads y Reportes
 * ⚠️ ADMIN ONLY - Verificar permisos antes de usar
 */

export const exportService = {
  /**
   * Exportar Leads a CSV (ADMIN ONLY)
   */
  exportLeadstoCSV: (leads: any[], filename = 'leads.csv'): void => {
    if (!validateAdminAccess()) {
      throw new Error('Acceso denegado: Solo administradores pueden exportar');
    }

    const headers = ['ID', 'Nombre', 'Email', 'Teléfono', 'Estado', 'Fuente', 'Fecha'];
    const rows = leads.map((lead: any) => [
      lead.id,
      lead.nombre,
      lead.email,
      lead.telefono,
      lead.estado,
      lead.fuente,
      new Date(lead.fechaCreacion).toLocaleDateString()
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row: any[]) => row.map((cell: any) => `"${cell}"`).join(','))
    ].join('\n');

    downloadFile(csv, filename, 'text/csv');
  },

  /**
   * Exportar Reporte PDF (ADMIN ONLY)
   */
  exportReportToPDF: async (reportData: any, filename = 'reporte.pdf'): Promise<void> => {
    if (!validateAdminAccess()) {
      throw new Error('Acceso denegado: Solo administradores pueden exportar');
    }

    try {
      // Simulación: En producción usar pdfkit o similar
      const htmlContent = generatePDFContent(reportData);
      const blob = new Blob([htmlContent], { type: 'text/html' });
      downloadFile(blob as any, filename, 'application/pdf');
    } catch (error) {
      console.error('Error generando PDF:', error);
      throw new Error('Error al generar el PDF');
    }
  },

  /**
   * Exportar Resumen de Ventas (ADMIN ONLY)
   */
  exportSalesSummary: (leads: any[], filename = 'resumen-ventas.csv'): void => {
    if (!validateAdminAccess()) {
      throw new Error('Acceso denegado');
    }

    const summary = generateSalesSummary(leads);
    const csv = summary.map((row: any) => Object.values(row).join(',')).join('\n');
    downloadFile(csv, filename, 'text/csv');
  }
};

/**
 * Validar acceso ADMIN
 */
function validateAdminAccess(): boolean {
  const userRole = localStorage.getItem('userRole');
  return userRole === 'ADMIN';
}

/**
 * Descargar archivo
 */
function downloadFile(content: any, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

/**
 * Generar contenido PDF
 */
function generatePDFContent(data: any): string {
  return `
    <html>
      <head><title>Reporte CRM</title></head>
      <body>
        <h1>Reporte ${new Date().toLocaleDateString()}</h1>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      </body>
    </html>
  `;
}

/**
 * Generar resumen de ventas
 */
function generateSalesSummary(leads: any[]): any[] {
  const estados = ['LEAD_NUEVO', 'EN_SEGUIMIENTO', 'CLIENTE_GANADO'];
  return estados.map(estado => ({
    estado,
    cantidad: leads.filter((l: any) => l.estado === estado).length
  }));
}

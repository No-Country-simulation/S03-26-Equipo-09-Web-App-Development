# Guía de Exportación de Reportes - CRM Backend

## Descripción General

El CRM ahora ofrece funcionalidad completa de exportación de reportes en **PDF** y **CSV**. Todos los datos de métricas pueden ser descargados directamente desde los endpoints del API.

---

## Endpoints de Exportación

### 📊 Exportación en PDF

#### 1. Resumen de Métricas General (PDF)
```bash
curl -X GET http://localhost:8080/api/metricas/descargar/resumen-pdf \
  -H "Accept: application/pdf" \
  -o CRM_Resumen_Metricas.pdf
```

**Contenido:**
- Total de contactos
- Total de conversaciones
- Total de seguimientos
- Contactos por estado (LEAD_ACTIVO, EN_SEGUIMIENTO, CALIFICADO, CLIENTE)
- Canales de comunicación (Email, WhatsApp, Otros)
- Tasas y porcentajes

**Archivo:** `CRM_Resumen_Metricas.pdf`

---

#### 2. Embudo de Ventas (PDF)
```bash
curl -X GET http://localhost:8080/api/metricas/descargar/funnel-pdf \
  -H "Accept: application/pdf" \
  -o CRM_Funnel_Ventas.pdf
```

**Contenido:**
- Etapas del funnel (Leads → Clientes)
- Cantidad en cada etapa
- Tasas de conversión entre etapas
- Análisis de progresión

**Archivo:** `CRM_Funnel_Ventas.pdf`

---

#### 3. Estadísticas de Seguimientos (PDF)
```bash
curl -X GET http://localhost:8080/api/metricas/descargar/seguimientos-pdf \
  -H "Accept: application/pdf" \
  -o CRM_Seguimientos.pdf
```

**Contenido:**
- Total de seguimientos
- Seguimientos completados
- Seguimientos pendientes
- Porcentajes de completitud

**Archivo:** `CRM_Seguimientos.pdf`

---

### 📄 Exportación en CSV

#### 1. Resumen de Métricas General (CSV)
```bash
curl -X GET http://localhost:8080/api/metricas/descargar/resumen-csv \
  -o CRM_Resumen_Metricas.csv
```

**Formato:** Compatible con Excel, Google Sheets, etc.

**Estructura:**
```csv
RESUMEN CRM - Fecha: 10/04/2026 17:11:26

MÉTRICA,VALOR
Total Contactos,5
Total Conversaciones,0
Total Seguimientos,0
Seguimientos Completados,0
...
```

**Archivo:** `CRM_Resumen_Metricas.csv`

---

#### 2. Embudo de Ventas (CSV)
```bash
curl -X GET http://localhost:8080/api/metricas/descargar/funnel-csv \
  -o CRM_Funnel_Ventas.csv
```

**Estructura:**
```csv
EMBUDO DE VENTAS - Fecha: 10/04/2026 17:11:26

ETAPA,CANTIDAD
Leads Activos,100
En Seguimiento,45
Calificados,20
Clientes,8

TASAS DE CONVERSIÓN
Etapa,Tasa (%)
Lead Activo → En Seguimiento,45.00
...
```

**Archivo:** `CRM_Funnel_Ventas.csv`

---

#### 3. Estadísticas de Seguimientos (CSV)
```bash
curl -X GET http://localhost:8080/api/metricas/descargar/seguimientos-csv \
  -o CRM_Seguimientos.csv
```

**Archivo:** `CRM_Seguimientos.csv`

---

## Cómo Usar desde el Frontend

### Opción 1: Link de Descarga Directo
```html
<a href="http://localhost:8080/api/metricas/descargar/resumen-pdf" download>
  Descargar PDF
</a>
```

### Opción 2: Fetch API
```javascript
fetch('http://localhost:8080/api/metricas/descargar/resumen-pdf')
  .then(response => response.blob())
  .then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CRM_Resumen_Metricas.pdf';
    a.click();
  });
```

### Opción 3: Axios
```javascript
import axios from 'axios';

const descargarPDF = async () => {
  try {
    const response = await axios.get(
      'http://localhost:8080/api/metricas/descargar/resumen-pdf',
      { responseType: 'blob' }
    );
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'CRM_Resumen_Metricas.pdf');
    document.body.appendChild(link);
    link.click();
    link.parentElement.removeChild(link);
  } catch (error) {
    console.error('Error descargando PDF:', error);
  }
};
```

---

## Configuración en CORS (Si es necesario)

Si el frontend está en un dominio diferente, añade esto a `application.properties`:

```properties
cors.allowed-origins=http://localhost:5173,http://localhost:3000
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
cors.allowed-headers=*
cors.max-age=3600
```

---

## Especificaciones Técnicas

### Librerías Utilizadas

- **iText 7** - Generación de PDFs profesionales
- **Apache Commons CSV** - Exportación a CSV

### Características

✅ Generación automática con fecha y hora  
✅ Formatos profesionales y listos para imprimir  
✅ Datos actualizados en tiempo real  
✅ Sin límite de descargas  
✅ Archivos comprimidos (77 MB de JAR incluye todas las dependencias)  

---

## Posibles Mejoras Futuras

- [ ] Exportación a Excel (.xlsx) con estilos avanzados
- [ ] Exportación a PowerPoint con gráficos interactivos
- [ ] Programación automática de reportes (agenda diaria/semanal)
- [ ] Validación y filtrado de datos antes de exportar
- [ ] Firma digital de reportes
- [ ] Exportación con marca de agua (branding)

---

## Troubleshooting

**P: El PDF se descarga vacío**
R: Verifica que hay datos en el CRM. Si no hay contactos, el PDF tendrá solo encabezados.

**P: El CSV se ve mal en Excel**
R: Asegúrate de usar UTF-8 como encoding al abrir el archivo.

**P: ¿Cuál es el tamaño máximo del reporte?**
R: No hay límite configurado, pero reportes muy grandes (>100MB) pueden tardar.

---

## Ejemplos Completos

### Ejemplo 1: Descargar y compartir reportes en bash
```bash
#!/bin/bash

# Crear directorio para reportes
mkdir -p reportes

# Descargar todos los reportes
curl -s http://localhost:8080/api/metricas/descargar/resumen-pdf \
  -o reportes/CRM_Resumen_$(date +%Y%m%d_%H%M%S).pdf

curl -s http://localhost:8080/api/metricas/descargar/funnel-pdf \
  -o reportes/CRM_Funnel_$(date +%Y%m%d_%H%M%S).pdf

# Comprimir
zip -r reportes_crm_$(date +%Y%m%d).zip reportes/

echo "✅ Reportes generados en reportes_crm_$(date +%Y%m%d).zip"
```

### Ejemplo 2: Componente React para descargas
```jsx
import Button from '@/components/ui/Button';

function ReporteExportWidget() {
  const descargarReporte = async (tipo) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/metricas/descargar/${tipo}`
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_${tipo}_${new Date().toISOString()}.${tipo === 'pdf' ? 'pdf' : 'csv'}`;
      a.click();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex gap-4">
      <Button onClick={() => descargarReporte('resumen-pdf')}>
        📊 Descargar PDF
      </Button>
      <Button onClick={() => descargarReporte('resumen-csv')}>
        📄 Descargar CSV
      </Button>
    </div>
  );
}
```


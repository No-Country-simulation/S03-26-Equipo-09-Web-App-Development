package com.startupcrm.crm_backend.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.io.font.constants.StandardFonts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

/**
 * Servicio para exportar reportes de métricas a PDF
 */
@Service
public class PdfExportService {

    private static final Logger logger = LoggerFactory.getLogger(PdfExportService.class);

    @Autowired
    private MetricasService metricasService;

    /**
     * Generar reporte PDF con resumen de métricas
     */
    public byte[] generarReporteResumenPDF() {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfDocument pdfDoc = new PdfDocument(new PdfWriter(baos));
            Document document = new Document(pdfDoc);

            // Configurar fuentes
            PdfFont fontTitle = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
            PdfFont fontNormal = PdfFontFactory.createFont(StandardFonts.HELVETICA);
            PdfFont fontSmall = PdfFontFactory.createFont(StandardFonts.HELVETICA);

            // Título
            Paragraph title = new Paragraph("REPORTE DE MÉTRICAS CRM")
                    .setFont(fontTitle)
                    .setFontSize(20);
            document.add(title);

            // Fecha de generación
            String fecha = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
            Paragraph fechaGen = new Paragraph("Fecha de generación: " + fecha)
                    .setFont(fontSmall)
                    .setFontSize(10);
            document.add(fechaGen);

            document.add(new Paragraph("\n"));

            // Obtener datos
            Map<String, Object> metricas = metricasService.obtenerResumenMetricas();

            // Sección 1: Resumen General
            agregarSeccionResumen(document, fontTitle, fontNormal, metricas);

            document.add(new Paragraph("\n"));

            // Sección 2: Contactos por Estado
            agregarSeccionContactosPorEstado(document, fontTitle, fontNormal, metricas);

            document.add(new Paragraph("\n"));

            // Sección 3: Comunicación por Canal
            agregarSeccionComunicacionPorCanal(document, fontTitle, fontNormal, metricas);

            document.close();

            logger.info("Reporte PDF generado exitosamente");
            return baos.toByteArray();

        } catch (Exception e) {
            logger.error("Error al generar reporte PDF: {}", e.getMessage());
            throw new RuntimeException("Error al generar PDF: " + e.getMessage());
        }
    }

    /**
     * Generar reporte PDF del embudo de ventas
     */
    public byte[] generarReporteFunnelPDF() {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfDocument pdfDoc = new PdfDocument(new PdfWriter(baos));
            Document document = new Document(pdfDoc);

            PdfFont fontTitle = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
            PdfFont fontNormal = PdfFontFactory.createFont(StandardFonts.HELVETICA);

            // Título
            Paragraph title = new Paragraph("REPORTE DE EMBUDO DE VENTAS (FUNNEL)")
                    .setFont(fontTitle)
                    .setFontSize(20);
            document.add(title);

            String fecha = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
            Paragraph fechaGen = new Paragraph("Fecha de generación: " + fecha)
                    .setFont(fontNormal)
                    .setFontSize(10);
            document.add(fechaGen);

            document.add(new Paragraph("\n"));

            Map<String, Object> funnel = metricasService.obtenerMetricasFunnel();

            // Tabla del funnel
            Table table = new Table(new float[]{3, 3});
            table.setWidth(UnitValue.createPercentValue(100));

            // Headers
            Cell headerEtapa = new Cell().add(new Paragraph("ETAPA").setFont(fontTitle));
            Cell headerCantidad = new Cell().add(new Paragraph("CANTIDAD").setFont(fontTitle));
            table.addCell(headerEtapa);
            table.addCell(headerCantidad);

            // Datos
            table.addCell(new Cell().add(new Paragraph("Leads Activos").setFont(fontNormal)));
            table.addCell(new Cell().add(new Paragraph(funnel.get("leadsActivos").toString())));

            table.addCell(new Cell().add(new Paragraph("En Seguimiento").setFont(fontNormal)));
            table.addCell(new Cell().add(new Paragraph(funnel.get("enSeguimiento").toString())));

            table.addCell(new Cell().add(new Paragraph("Calificados").setFont(fontNormal)));
            table.addCell(new Cell().add(new Paragraph(funnel.get("calificados").toString())));

            table.addCell(new Cell().add(new Paragraph("Clientes").setFont(fontNormal)));
            table.addCell(new Cell().add(new Paragraph(funnel.get("clientes").toString())));

            document.add(table);

            document.add(new Paragraph("\n"));

            // Tasas de conversión
            Paragraph tasasTitle = new Paragraph("TASAS DE CONVERSIÓN")
                    .setFont(fontTitle)
                    .setFontSize(14);
            document.add(tasasTitle);

            Paragraph tasaLead = new Paragraph(
                    String.format("Lead Activo → En Seguimiento: %.2f%%",
                            (Double) funnel.getOrDefault("tasaConversion_LED_a_Seguimiento", 0.0)));
            tasaLead.setFont(fontNormal);
            document.add(tasaLead);

            Paragraph tasaSeguimiento = new Paragraph(
                    String.format("En Seguimiento → Calificado: %.2f%%",
                            (Double) funnel.getOrDefault("tasaConversion_Seguimiento_a_Calificado", 0.0)));
            tasaSeguimiento.setFont(fontNormal);
            document.add(tasaSeguimiento);

            Paragraph tasaCliente = new Paragraph(
                    String.format("Calificado → Cliente: %.2f%%",
                            (Double) funnel.getOrDefault("tasaConversion_Calificado_a_Cliente", 0.0)));
            tasaCliente.setFont(fontNormal);
            document.add(tasaCliente);

            document.close();

            logger.info("Reporte Funnel PDF generado exitosamente");
            return baos.toByteArray();

        } catch (Exception e) {
            logger.error("Error al generar reporte Funnel PDF: {}", e.getMessage());
            throw new RuntimeException("Error al generar PDF: " + e.getMessage());
        }
    }

    /**
     * Generar reporte PDF de seguimientos
     */
    public byte[] generarReporteSeguimientosPDF() {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfDocument pdfDoc = new PdfDocument(new PdfWriter(baos));
            Document document = new Document(pdfDoc);

            PdfFont fontTitle = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
            PdfFont fontNormal = PdfFontFactory.createFont(StandardFonts.HELVETICA);

            // Título
            Paragraph title = new Paragraph("REPORTE DE SEGUIMIENTOS")
                    .setFont(fontTitle)
                    .setFontSize(20);
            document.add(title);

            String fecha = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
            document.add(new Paragraph("Fecha de generación: " + fecha)
                    .setFont(fontNormal)
                    .setFontSize(10));

            document.add(new Paragraph("\n"));

            Map<String, Object> stats = metricasService.obtenerEstadisticasSeguimientos();

            // Tabla
            Table table = new Table(new float[]{3, 3});
            table.setWidth(UnitValue.createPercentValue(100));

            Cell header1 = new Cell().add(new Paragraph("MÉTRICA").setFont(fontTitle));
            Cell header2 = new Cell().add(new Paragraph("VALOR").setFont(fontTitle));
            table.addCell(header1);
            table.addCell(header2);

            table.addCell(new Cell().add(new Paragraph("Total Seguimientos").setFont(fontNormal)));
            table.addCell(new Cell().add(new Paragraph(stats.get("totalSeguimientos").toString())));

            table.addCell(new Cell().add(new Paragraph("Completados").setFont(fontNormal)));
            table.addCell(new Cell().add(new Paragraph(stats.get("completados").toString())));

            table.addCell(new Cell().add(new Paragraph("Pendientes").setFont(fontNormal)));
            table.addCell(new Cell().add(new Paragraph(stats.get("pendientes").toString())));

            table.addCell(new Cell().add(new Paragraph("% Completados").setFont(fontNormal)));
            table.addCell(new Cell().add(new Paragraph(
                    String.format("%.2f%%", (Double) stats.getOrDefault("porcentajeCompletados", 0.0)))));

            table.addCell(new Cell().add(new Paragraph("% Pendientes").setFont(fontNormal)));
            table.addCell(new Cell().add(new Paragraph(
                    String.format("%.2f%%", (Double) stats.getOrDefault("porcentajePendientes", 0.0)))));

            document.add(table);

            document.close();

            logger.info("Reporte Seguimientos PDF generado exitosamente");
            return baos.toByteArray();

        } catch (Exception e) {
            logger.error("Error al generar reporte Seguimientos PDF: {}", e.getMessage());
            throw new RuntimeException("Error al generar PDF: " + e.getMessage());
        }
    }

    // ========== MÉTODOS AUXILIARES ==========

    private void agregarSeccionResumen(Document document, PdfFont fontTitle, PdfFont fontNormal, 
                                       Map<String, Object> metricas) throws Exception {
        Paragraph seccionTitle = new Paragraph("RESUMEN GENERAL")
                .setFont(fontTitle)
                .setFontSize(14);
        document.add(seccionTitle);

        Table table = new Table(new float[]{3, 3});
        table.setWidth(UnitValue.createPercentValue(100));

        Cell header1 = new Cell().add(new Paragraph("MÉTRICA").setFont(fontTitle));
        Cell header2 = new Cell().add(new Paragraph("VALOR").setFont(fontTitle));
        table.addCell(header1);
        table.addCell(header2);

        table.addCell(new Cell().add(new Paragraph("Total Contactos").setFont(fontNormal)));
        table.addCell(new Cell().add(new Paragraph(metricas.get("totalContactos").toString())));

        table.addCell(new Cell().add(new Paragraph("Total Conversaciones").setFont(fontNormal)));
        table.addCell(new Cell().add(new Paragraph(metricas.get("totalConversaciones").toString())));

        table.addCell(new Cell().add(new Paragraph("Total Seguimientos").setFont(fontNormal)));
        table.addCell(new Cell().add(new Paragraph(metricas.get("totalSeguimientos").toString())));

        table.addCell(new Cell().add(new Paragraph("Seguimientos Completados").setFont(fontNormal)));
        table.addCell(new Cell().add(new Paragraph(metricas.get("seguimientosCompletados").toString())));

        table.addCell(new Cell().add(new Paragraph("Seguimientos Pendientes").setFont(fontNormal)));
        table.addCell(new Cell().add(new Paragraph(metricas.get("seguimientosPendientes").toString())));

        table.addCell(new Cell().add(new Paragraph("Tasa Completitud (%)").setFont(fontNormal)));
        table.addCell(new Cell().add(new Paragraph(
                String.format("%.2f%%", (Double) metricas.getOrDefault("tasaCompletitudSeguimientos", 0.0)))));

        document.add(table);
    }

    private void agregarSeccionContactosPorEstado(Document document, PdfFont fontTitle, PdfFont fontNormal,
                                                  Map<String, Object> metricas) throws Exception {
        Paragraph seccionTitle = new Paragraph("CONTACTOS POR ESTADO")
                .setFont(fontTitle)
                .setFontSize(14);
        document.add(seccionTitle);

        @SuppressWarnings("unchecked")
        Map<String, Long> contactosPorEstado = (Map<String, Long>) metricas.get("contactosPorEstado");

        Table table = new Table(new float[]{3, 3});
        table.setWidth(UnitValue.createPercentValue(100));

        Cell header1 = new Cell().add(new Paragraph("ESTADO").setFont(fontTitle));
        Cell header2 = new Cell().add(new Paragraph("CANTIDAD").setFont(fontTitle));
        table.addCell(header1);
        table.addCell(header2);

        for (Map.Entry<String, Long> entry : contactosPorEstado.entrySet()) {
            table.addCell(new Cell().add(new Paragraph(entry.getKey()).setFont(fontNormal)));
            table.addCell(new Cell().add(new Paragraph(entry.getValue().toString())));
        }

        document.add(table);
    }

    private void agregarSeccionComunicacionPorCanal(Document document, PdfFont fontTitle, PdfFont fontNormal,
                                                    Map<String, Object> metricas) throws Exception {
        Paragraph seccionTitle = new Paragraph("COMUNICACIÓN POR CANAL")
                .setFont(fontTitle)
                .setFontSize(14);
        document.add(seccionTitle);

        @SuppressWarnings("unchecked")
        Map<String, Long> comunicacionPorCanal = (Map<String, Long>) metricas.get("comunicacionPorCanal");

        Table table = new Table(new float[]{3, 3});
        table.setWidth(UnitValue.createPercentValue(100));

        Cell header1 = new Cell().add(new Paragraph("CANAL").setFont(fontTitle));
        Cell header2 = new Cell().add(new Paragraph("CONVERSACIONES").setFont(fontTitle));
        table.addCell(header1);
        table.addCell(header2);

        for (Map.Entry<String, Long> entry : comunicacionPorCanal.entrySet()) {
            table.addCell(new Cell().add(new Paragraph(entry.getKey()).setFont(fontNormal)));
            table.addCell(new Cell().add(new Paragraph(entry.getValue().toString())));
        }

        document.add(table);
    }
}

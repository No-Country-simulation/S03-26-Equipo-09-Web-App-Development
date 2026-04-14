package com.startupcrm.crm_backend.service;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

/**
 * Servicio para exportar reportes de métricas a CSV
 */
@Service
public class CsvExportService {

    private static final Logger logger = LoggerFactory.getLogger(CsvExportService.class);

    @Autowired
    private MetricasService metricasService;

    /**
     * Generar reporte CSV con resumen de métricas
     */
    public byte[] generarResumenesCSV() {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            OutputStreamWriter osw = new OutputStreamWriter(baos);
            CSVPrinter csvPrinter = new CSVPrinter(osw, CSVFormat.DEFAULT.withHeader());

            Map<String, Object> metricas = metricasService.obtenerResumenMetricas();

            // Escribir datos de resumen
            csvPrinter.printRecord(
                    "RESUMEN CRM - Fecha: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"))
            );
            csvPrinter.println();

            csvPrinter.printRecord("MÉTRICA", "VALOR");
            csvPrinter.printRecord("Total Contactos", metricas.get("totalContactos"));
            csvPrinter.printRecord("Total Conversaciones", metricas.get("totalConversaciones"));
            csvPrinter.printRecord("Total Seguimientos", metricas.get("totalSeguimientos"));
            csvPrinter.printRecord("Seguimientos Completados", metricas.get("seguimientosCompletados"));
            csvPrinter.printRecord("Seguimientos Pendientes", metricas.get("seguimientosPendientes"));
            csvPrinter.printRecord("Tasa Completitud (%)", 
                    String.format("%.2f%%", (Double) metricas.getOrDefault("tasaCompletitudSeguimientos", 0.0)));

            csvPrinter.println();
            csvPrinter.printRecord("CONTACTOS POR ESTADO");
            
            @SuppressWarnings("unchecked")
            Map<String, Long> contactosPorEstado = (Map<String, Long>) metricas.get("contactosPorEstado");
            csvPrinter.printRecord("ESTADO", "CANTIDAD");
            for (Map.Entry<String, Long> entry : contactosPorEstado.entrySet()) {
                csvPrinter.printRecord(entry.getKey(), entry.getValue());
            }

            csvPrinter.printRecord();
            csvPrinter.printRecord("CANALES DE COMUNICACIÓN");
            
            @SuppressWarnings("unchecked")
            Map<String, Long> comunicacionPorCanal = (Map<String, Long>) metricas.get("comunicacionPorCanal");
            csvPrinter.printRecord("CANAL", "CONVERSACIONES");
            for (Map.Entry<String, Long> entry : comunicacionPorCanal.entrySet()) {
                csvPrinter.printRecord(entry.getKey(), entry.getValue());
            }

            csvPrinter.flush();
            csvPrinter.close();

            logger.info("Reporte CSV generado exitosamente");
            return baos.toByteArray();

        } catch (IOException e) {
            logger.error("Error al generar reporte CSV: {}", e.getMessage());
            throw new RuntimeException("Error al generar CSV: " + e.getMessage());
        }
    }

    /**
     * Generar reporte CSV del embudo de ventas
     */
    public byte[] generarFunnelCSV() {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            OutputStreamWriter osw = new OutputStreamWriter(baos);
            CSVPrinter csvPrinter = new CSVPrinter(osw, CSVFormat.DEFAULT.withHeader());

            Map<String, Object> funnel = metricasService.obtenerMetricasFunnel();

            csvPrinter.printRecord("EMBUDO DE VENTAS - Fecha: " + 
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")));
            csvPrinter.println();

            csvPrinter.printRecord("ETAPA", "CANTIDAD");
            csvPrinter.printRecord("Leads Activos", funnel.get("leadsActivos"));
            csvPrinter.printRecord("En Seguimiento", funnel.get("enSeguimiento"));
            csvPrinter.printRecord("Calificados", funnel.get("calificados"));
            csvPrinter.printRecord("Clientes", funnel.get("clientes"));

            csvPrinter.println();
            csvPrinter.printRecord("TASAS DE CONVERSIÓN");
            csvPrinter.printRecord("Etapa", "Tasa (%)");
            csvPrinter.printRecord("Lead Activo → En Seguimiento",
                    String.format("%.2f", (Double) funnel.getOrDefault("tasaConversion_LED_a_Seguimiento", 0.0)));
            csvPrinter.printRecord("En Seguimiento → Calificado",
                    String.format("%.2f", (Double) funnel.getOrDefault("tasaConversion_Seguimiento_a_Calificado", 0.0)));
            csvPrinter.printRecord("Calificado → Cliente",
                    String.format("%.2f", (Double) funnel.getOrDefault("tasaConversion_Calificado_a_Cliente", 0.0)));

            csvPrinter.flush();
            csvPrinter.close();

            logger.info("Reporte Funnel CSV generado exitosamente");
            return baos.toByteArray();

        } catch (IOException e) {
            logger.error("Error al generar reporte Funnel CSV: {}", e.getMessage());
            throw new RuntimeException("Error al generar CSV: " + e.getMessage());
        }
    }

    /**
     * Generar reporte CSV de seguimientos
     */
    public byte[] generarSeguimientosCSV() {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            OutputStreamWriter osw = new OutputStreamWriter(baos);
            CSVPrinter csvPrinter = new CSVPrinter(osw, CSVFormat.DEFAULT.withHeader());

            Map<String, Object> stats = metricasService.obtenerEstadisticasSeguimientos();

            csvPrinter.printRecord("ESTADÍSTICAS DE SEGUIMIENTOS - Fecha: " +
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")));
            csvPrinter.println();

            csvPrinter.printRecord("MÉTRICA", "VALOR");
            csvPrinter.printRecord("Total Seguimientos", stats.get("totalSeguimientos"));
            csvPrinter.printRecord("Completados", stats.get("completados"));
            csvPrinter.printRecord("Pendientes", stats.get("pendientes"));
            csvPrinter.printRecord("% Completados",
                    String.format("%.2f%%", (Double) stats.getOrDefault("porcentajeCompletados", 0.0)));
            csvPrinter.printRecord("% Pendientes",
                    String.format("%.2f%%", (Double) stats.getOrDefault("porcentajePendientes", 0.0)));

            csvPrinter.flush();
            csvPrinter.close();

            logger.info("Reporte Seguimientos CSV generado exitosamente");
            return baos.toByteArray();

        } catch (IOException e) {
            logger.error("Error al generar reporte Seguimientos CSV: {}", e.getMessage());
            throw new RuntimeException("Error al generar CSV: " + e.getMessage());
        }
    }
}

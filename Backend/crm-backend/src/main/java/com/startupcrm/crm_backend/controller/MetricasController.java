package com.startupcrm.crm_backend.controller;

import com.startupcrm.crm_backend.dto.ApiResponse;
import com.startupcrm.crm_backend.service.MetricasService;
import com.startupcrm.crm_backend.service.MetricasVendedorService;
import com.startupcrm.crm_backend.service.PdfExportService;
import com.startupcrm.crm_backend.service.CsvExportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.List;

/**
 * Controlador para endpoints de métricas y analítica del CRM
 */
@RestController
@RequestMapping("/api/metricas")
public class MetricasController {

    private static final Logger logger = LoggerFactory.getLogger(MetricasController.class);

    @Autowired
    private MetricasService metricasService;

    @Autowired
    private MetricasVendedorService metricasVendedorService;

    @Autowired
    private PdfExportService pdfExportService;

    @Autowired
    private CsvExportService csvExportService;

    /**
     * Obtener resumen general de métricas del CRM
     * GET /api/metricas/resumen
     */
    @GetMapping("/resumen")
    public ApiResponse<Map<String, Object>> obtenerResumenMetricas() {
        logger.info("Solicitando resumen de métricas");
        Map<String, Object> metricas = metricasService.obtenerResumenMetricas();
        return new ApiResponse<>(true, metricas, null);
    }

    /**
     * Obtener métricas del embudo de ventas (funnel)
     * GET /api/metricas/funnel
     */
    @GetMapping("/funnel")
    public ApiResponse<Map<String, Object>> obtenerMetricasFunnel() {
        logger.info("Solicitando métricas del funnel");
        Map<String, Object> funnel = metricasService.obtenerMetricasFunnel();
        return new ApiResponse<>(true, funnel, null);
    }

    /**
     * Obtener estadísticas de seguimientos
     * GET /api/metricas/seguimientos
     */
    @GetMapping("/seguimientos")
    public ApiResponse<Map<String, Object>> obtenerEstadisticasSeguimientos() {
        logger.info("Solicitando estadísticas de seguimientos");
        Map<String, Object> stats = metricasService.obtenerEstadisticasSeguimientos();
        return new ApiResponse<>(true, stats, null);
    }

    /**
     * Obtener estadísticas de conversaciones
     * GET /api/metricas/conversaciones
     */
    @GetMapping("/conversaciones")
    public ApiResponse<Map<String, Object>> obtenerEstadisticasConversaciones() {
        logger.info("Solicitando estadísticas de conversaciones");
        Map<String, Object> stats = metricasService.obtenerEstadisticasConversaciones();
        return new ApiResponse<>(true, stats, null);
    }

    /**
     * Obtener distribución de comunicación por canal
     * GET /api/metricas/canales
     */
    @GetMapping("/canales")
    public ApiResponse<Map<String, Long>> obtenerComunicacionPorCanal() {
        logger.info("Solicitando comunicación por canal");
        Map<String, Long> canales = metricasService.obtenerComunicacionPorCanal();
        return new ApiResponse<>(true, canales, null);
    }

    // ==================== ENDPOINTS DE MÉTRICAS POR VENDEDOR ====================

    /**
     * Obtener métricas de conversión para un vendedor específico
     * GET /api/metricas/vendedor/{vendedorId}
     * 
     * Retorna: tasaConversion, leadsAsignados, clientesConvertidos, totalLeads, etc.
     */
    @GetMapping("/vendedor/{vendedorId}")
    public ApiResponse<Map<String, Object>> obtenerMetricasVendedor(@PathVariable Long vendedorId) {
        logger.info("Solicitando métricas del vendedor: {}", vendedorId);
        Map<String, Object> metricas = metricasVendedorService.obtenerMetricasVendedor(vendedorId);
        return new ApiResponse<>(true, metricas, null);
    }

    /**
     * Obtener métricas de todos los vendedores activos
     * GET /api/metricas/vendedores
     * 
     * Retorna: Lista de vendedores con sus respectivas tasas de conversión
     */
    @GetMapping("/vendedores")
    public ApiResponse<List<Map<String, Object>>> obtenerMetricasTodosVendedores() {
        logger.info("Solicitando métricas de todos los vendedores");
        List<Map<String, Object>> metricas = metricasVendedorService.obtenerMetricasTodosVendedores();
        return new ApiResponse<>(true, metricas, null);
    }

    // ==================== ENDPOINTS DE EXPORTACIÓN ====================

    /**
     * Descargar resumen de métricas en PDF
     * GET /api/metricas/descargar/resumen-pdf
     */
    @GetMapping("/descargar/resumen-pdf")
    public ResponseEntity<byte[]> descargarResumenPDF() {
        logger.info("Descargando resumen de métricas en PDF");
        byte[] pdfContent = pdfExportService.generarReporteResumenPDF();
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"CRM_Resumen_Metricas.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfContent);
    }

    /**
     * Descargar embudo de ventas en PDF
     * GET /api/metricas/descargar/funnel-pdf
     */
    @GetMapping("/descargar/funnel-pdf")
    public ResponseEntity<byte[]> descargarFunnelPDF() {
        logger.info("Descargando embudo de ventas en PDF");
        byte[] pdfContent = pdfExportService.generarReporteFunnelPDF();
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"CRM_Funnel_Ventas.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfContent);
    }

    /**
     * Descargar seguimientos en PDF
     * GET /api/metricas/descargar/seguimientos-pdf
     */
    @GetMapping("/descargar/seguimientos-pdf")
    public ResponseEntity<byte[]> descargarSeguimientosPDF() {
        logger.info("Descargando seguimientos en PDF");
        byte[] pdfContent = pdfExportService.generarReporteSeguimientosPDF();
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"CRM_Seguimientos.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfContent);
    }

    /**
     * Descargar resumen de métricas en CSV
     * GET /api/metricas/descargar/resumen-csv
     */
    @GetMapping("/descargar/resumen-csv")
    public ResponseEntity<byte[]> descargarResumenCSV() {
        logger.info("Descargando resumen de métricas en CSV");
        byte[] csvContent = csvExportService.generarResumenesCSV();
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"CRM_Resumen_Metricas.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvContent);
    }

    /**
     * Descargar embudo de ventas en CSV
     * GET /api/metricas/descargar/funnel-csv
     */
    @GetMapping("/descargar/funnel-csv")
    public ResponseEntity<byte[]> descargarFunnelCSV() {
        logger.info("Descargando embudo de ventas en CSV");
        byte[] csvContent = csvExportService.generarFunnelCSV();
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"CRM_Funnel_Ventas.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvContent);
    }

    /**
     * Descargar seguimientos en CSV
     * GET /api/metricas/descargar/seguimientos-csv
     */
    @GetMapping("/descargar/seguimientos-csv")
    public ResponseEntity<byte[]> descargarSeguimientosCSV() {
        logger.info("Descargando seguimientos en CSV");
        byte[] csvContent = csvExportService.generarSeguimientosCSV();
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"CRM_Seguimientos.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvContent);
    }
}

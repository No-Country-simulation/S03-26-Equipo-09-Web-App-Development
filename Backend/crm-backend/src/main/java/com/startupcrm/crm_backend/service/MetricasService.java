package com.startupcrm.crm_backend.service;

import com.startupcrm.crm_backend.model.EstadoLead;
import com.startupcrm.crm_backend.repository.ContactoRepository;
import com.startupcrm.crm_backend.repository.ConversacionRepository;
import com.startupcrm.crm_backend.repository.SeguimientoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

/**
 * Servicio para generar métricas y estadísticas del CRM
 */
@Service
public class MetricasService {

    private static final Logger logger = LoggerFactory.getLogger(MetricasService.class);

    @Autowired
    private ContactoRepository contactoRepository;

    @Autowired
    private ConversacionRepository conversacionRepository;

    @Autowired
    private SeguimientoRepository seguimientoRepository;

    /**
     * Obtener resumen general de métricas del CRM
     */
    public Map<String, Object> obtenerResumenMetricas() {
        Map<String, Object> metricas = new HashMap<>();

        try {
            // Totales generales
            long totalContactos = contactoRepository.count();
            long totalConversaciones = conversacionRepository.count();
            long totalSeguimientos = seguimientoRepository.count();
            long seguimientosCompletados = seguimientoRepository.findByCompletadoTrue().size();
            long seguimientosPendientes = seguimientoRepository.findByCompletadoFalse().size();

            metricas.put("totalContactos", totalContactos);
            metricas.put("totalConversaciones", totalConversaciones);
            metricas.put("totalSeguimientos", totalSeguimientos);
            metricas.put("seguimientosCompletados", seguimientosCompletados);
            metricas.put("seguimientosPendientes", seguimientosPendientes);

            // Tasas
            if (totalSeguimientos > 0) {
                double tasaCompletitud = (double) seguimientosCompletados / totalSeguimientos * 100;
                metricas.put("tasaCompletitudSeguimientos", Math.round(tasaCompletitud * 100.0) / 100.0);
            }

            // Segmentación por estado
            Map<String, Long> contactosPorEstado = new HashMap<>();
            long leadsActivosCount = (long) contactoRepository.findByEstado(EstadoLead.LEAD_ACTIVO).size();
            long clientesCount = (long) contactoRepository.findByEstado(EstadoLead.CLIENTE).size();
            long inactivosCount = (long) contactoRepository.findByEstado(EstadoLead.INACTIVO).size();
            
            contactosPorEstado.put(EstadoLead.LEAD_ACTIVO.toString(), leadsActivosCount);
            contactosPorEstado.put(EstadoLead.CLIENTE.toString(), clientesCount);
            contactosPorEstado.put(EstadoLead.INACTIVO.toString(), inactivosCount);

            metricas.put("contactosPorEstado", contactosPorEstado);

            // PRODUCTOS VENDIDOS = Contactos en estado CLIENTE
            metricas.put("productosVendidos", clientesCount);

            // Canales de comunicación
            Map<String, Long> comunicacionPorCanal = obtenerComunicacionPorCanal();
            metricas.put("comunicacionPorCanal", comunicacionPorCanal);

            logger.info("Resumen de métricas generado exitosamente. Productos Vendidos: {}", clientesCount);

        } catch (Exception e) {
            logger.error("Error al generar resumen de métricas: {}", e.getMessage());
            throw new RuntimeException("Error al generar métricas: " + e.getMessage());
        }

        return metricas;
    }

    /**
     * Obtener distribución por canal de comunicación
     */
    public Map<String, Long> obtenerComunicacionPorCanal() {
        Map<String, Long> canales = new HashMap<>();
        
        // Aquí puedes agregar lógica para contar por canal
        // Este es un ejemplo básico - lo ideal sería tener una query JPQL o native
        long totalConversaciones = conversacionRepository.count();
        
        canales.put("Email", Math.round(totalConversaciones * 0.6)); // Asumiendo 60% email
        canales.put("WhatsApp", Math.round(totalConversaciones * 0.3)); // 30% WhatsApp
        canales.put("Otros", Math.round(totalConversaciones * 0.1)); // 10% otros
        
        return canales;
    }

    /**
     * Obtener métricas de embudo de ventas (funnel) - Simplificado a 3 estados
     */
    public Map<String, Object> obtenerMetricasFunnel() {
        Map<String, Object> funnel = new HashMap<>();

        try {
            long leadsActivos = contactoRepository.findByEstado(EstadoLead.LEAD_ACTIVO).size();
            long clientes = contactoRepository.findByEstado(EstadoLead.CLIENTE).size();
            long inactivos = contactoRepository.findByEstado(EstadoLead.INACTIVO).size();

            funnel.put("leadsActivos", leadsActivos);
            funnel.put("clientes", clientes);
            funnel.put("inactivos", inactivos);

            // Tasas de conversión
            long totalLeads = leadsActivos + clientes + inactivos;
            if (totalLeads > 0) {
                double tasaConversion = ((double) clientes / totalLeads) * 100;
                funnel.put("tasaConversion", Math.round(tasaConversion * 100.0) / 100.0);
            }

            logger.info("Métricas del funnel generadas exitosamente");

        } catch (Exception e) {
            logger.error("Error al generar métricas del funnel: {}", e.getMessage());
            throw new RuntimeException("Error al generar métricas del funnel: " + e.getMessage());
        }

        return funnel;
    }

    /**
     * Obtener estadísticas de seguimientos
     */
    public Map<String, Object> obtenerEstadisticasSeguimientos() {
        Map<String, Object> stats = new HashMap<>();

        try {
            long totalSeguimientos = seguimientoRepository.count();
            long completados = seguimientoRepository.findByCompletadoTrue().size();
            long pendientes = seguimientoRepository.findByCompletadoFalse().size();

            stats.put("totalSeguimientos", totalSeguimientos);
            stats.put("completados", completados);
            stats.put("pendientes", pendientes);

            if (totalSeguimientos > 0) {
                double porcentajeCompletados = ((double) completados / totalSeguimientos) * 100;
                stats.put("porcentajeCompletados", Math.round(porcentajeCompletados * 100.0) / 100.0);
                stats.put("porcentajePendientes", Math.round((100 - porcentajeCompletados) * 100.0) / 100.0);
            }

            logger.info("Estadísticas de seguimientos generadas exitosamente");

        } catch (Exception e) {
            logger.error("Error al generar estadísticas de seguimientos: {}", e.getMessage());
            throw new RuntimeException("Error al generar estadísticas: " + e.getMessage());
        }

        return stats;
    }

    /**
     * Obtener estadísticas de conversaciones
     */
    public Map<String, Object> obtenerEstadisticasConversaciones() {
        Map<String, Object> stats = new HashMap<>();

        try {
            long totalConversaciones = conversacionRepository.count();
            stats.put("totalConversaciones", totalConversaciones);
            
            // Promedio de conversaciones por contacto
            long totalContactos = contactoRepository.count();
            if (totalContactos > 0) {
                double promedioConversaciones = (double) totalConversaciones / totalContactos;
                stats.put("promedioConversacionesPorContacto", Math.round(promedioConversaciones * 100.0) / 100.0);
            }

            logger.info("Estadísticas de conversaciones generadas exitosamente");

        } catch (Exception e) {
            logger.error("Error al generar estadísticas de conversaciones: {}", e.getMessage());
            throw new RuntimeException("Error al generar estadísticas: " + e.getMessage());
        }

        return stats;
    }
}

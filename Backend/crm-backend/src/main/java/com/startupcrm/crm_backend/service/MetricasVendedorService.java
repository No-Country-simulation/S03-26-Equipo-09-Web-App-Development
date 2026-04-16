package com.startupcrm.crm_backend.service;

import com.startupcrm.crm_backend.model.EstadoLead;
import com.startupcrm.crm_backend.model.Usuario;
import com.startupcrm.crm_backend.repository.ContactoRepository;
import com.startupcrm.crm_backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

/**
 * Servicio para calcular métricas individuales de cada vendedor.
 * Calcula: tasa de conversión, leads asignados, clientes, etc.
 */
@Service
public class MetricasVendedorService {

    private static final Logger logger = LoggerFactory.getLogger(MetricasVendedorService.class);

    @Autowired
    private ContactoRepository contactoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Obtener métricas de conversión para un vendedor específico.
     * 
     * @param vendedorId ID del vendedor
     * @return Map con: tasaConversion, leadsAsignados, clientesConvertidos
     */
    public Map<String, Object> obtenerMetricasVendedor(Long vendedorId) {
        Map<String, Object> metricas = new HashMap<>();

        try {
            // Verificar que el vendedor existe
            Usuario vendedor = usuarioRepository.findById(vendedorId)
                    .orElseThrow(() -> new RuntimeException("Vendedor no encontrado con ID: " + vendedorId));

            // Contar leads asignados al vendedor
            var leadsActivos = contactoRepository.findByVendedorAsignadoAndEstado(vendedor, EstadoLead.LEAD_ACTIVO);
            var clientes = contactoRepository.findByVendedorAsignadoAndEstado(vendedor, EstadoLead.CLIENTE);
            var inactivos = contactoRepository.findByVendedorAsignadoAndEstado(vendedor, EstadoLead.INACTIVO);

            long leadsActivosCount = leadsActivos.size();
            long clientesCount = clientes.size();
            long inactivosCount = inactivos.size();
            long totalLeads = leadsActivosCount + clientesCount + inactivosCount;

            // Guardar en respuesta
            metricas.put("vendedorId", vendedorId);
            metricas.put("vendedorNombre", vendedor.getNombre());
            metricas.put("leadsAsignados", leadsActivosCount);
            metricas.put("clientesConvertidos", clientesCount);
            metricas.put("leadsInactivos", inactivosCount);
            metricas.put("totalLeads", totalLeads);

            // Calcular tasa de conversión
            if (totalLeads > 0) {
                double tasaConversion = ((double) clientesCount / totalLeads) * 100;
                metricas.put("tasaConversion", Math.round(tasaConversion * 100.0) / 100.0);
            } else {
                metricas.put("tasaConversion", 0.0);
            }

            logger.info("Métricas del vendedor {} calculadas exitosamente. Tasa: {}%", 
                vendedor.getNombre(), metricas.get("tasaConversion"));

        } catch (Exception e) {
            logger.error("Error al calcular métricas del vendedor {}: {}", vendedorId, e.getMessage());
            throw new RuntimeException("Error al obtener métricas: " + e.getMessage());
        }

        return metricas;
    }

    /**
     * Obtener métricas de todos los vendedores activos.
     * 
     * @return Lista de metricas por vendedor
     */
    public java.util.List<Map<String, Object>> obtenerMetricasTodosVendedores() {
        java.util.List<Map<String, Object>> metricasList = new java.util.ArrayList<>();

        try {
            // Obtener todos los vendedores activos
            java.util.List<Usuario> vendedores = usuarioRepository.findByRoleAndActivo(Usuario.Role.VENDEDOR, true);

            // Calcular métricas para cada uno
            for (Usuario vendedor : vendedores) {
                Map<String, Object> metricasVendedor = obtenerMetricasVendedor(vendedor.getId());
                metricasList.add(metricasVendedor);
            }

            logger.info("Métricas de {} vendedores calculadas exitosamente", metricasList.size());

        } catch (Exception e) {
            logger.error("Error al calcular métricas de todos los vendedores: {}", e.getMessage());
            throw new RuntimeException("Error al obtener métricas: " + e.getMessage());
        }

        return metricasList;
    }
}

package com.startupcrm.crm_backend.controller;

import com.startupcrm.crm_backend.dto.ApiResponse;
import com.startupcrm.crm_backend.dto.ConversacionDTO;
import com.startupcrm.crm_backend.exception.ForbiddenAccessException;
import com.startupcrm.crm_backend.mapper.ConversacionMapper;
import com.startupcrm.crm_backend.model.Conversacion;
import com.startupcrm.crm_backend.model.Usuario;
import com.startupcrm.crm_backend.security.CustomUserDetailsService;
import com.startupcrm.crm_backend.service.ConversacionService;
import com.startupcrm.crm_backend.service.UsuarioService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador Admin Inbox - Unificado para WhatsApp + Email Omnicanal.
 * 
 * RBAC:
 * - ADMIN: Acceso a TODAS las conversaciones de todos los vendedores
 * - VENDEDOR: Acceso solo a sus conversaciones asignadas (usado por su Inbox personal)
 * 
 * Endpoints:
 * - GET /api/admin/conversaciones/todas → Page de TODAS las conversaciones (ADMIN only)
 * - GET /api/admin/conversaciones/{id}/detalles → Detalles completos + historial (ADMIN only)
 * - GET /api/admin/inbox/resumen → Dashboard del Inbox para Admin (estadísticas, no-leidos, etc)
 * 
 * @author Backend Team
 * @version 1.0 - Admin Inbox Module
 */
@RestController
@RequestMapping("/api/admin")
public class AdminInboxController {

    private final ConversacionService conversacionService;
    private final UsuarioService usuarioService;
    private final CustomUserDetailsService customUserDetailsService;

    public AdminInboxController(
            ConversacionService conversacionService,
            UsuarioService usuarioService,
            CustomUserDetailsService customUserDetailsService) {
        this.conversacionService = conversacionService;
        this.usuarioService = usuarioService;
        this.customUserDetailsService = customUserDetailsService;
    }

    /**
     * GET /api/admin/conversaciones/todas
     * 
     * Retorna TODAS las conversaciones del sistema (Inbox Admin Unificado).
     * Requiere: Rol ADMIN
     * 
     * Parametros de query:
     * - page: número de página (default: 0)
     * - size: tamaño de página (default: 20)
     * - canal: filtro por canal (WhatsApp, Email, omitir para todos)
     * - estado: filtro por estado (NO_LEIDO, LEIDO, RESPONDIDO, omitir para todos)
     * 
     * Ejemplo:
     * GET /api/admin/conversaciones/todas?page=0&size=20&canal=WhatsApp&estado=NO_LEIDO
     */
    @GetMapping("/conversaciones/todas")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<ConversacionDTO>>> getAllConversaciones(
            @RequestParam(required = false) String canal,
            @RequestParam(required = false) String estado,
            @PageableDefault(size = 20, sort = "fechaHora", direction = Sort.Direction.DESC) Pageable pageable) {
        
        Page<Conversacion> conversaciones;
        
        // Aplicar filtros si existen
        if (canal != null && !canal.isEmpty()) {
            conversaciones = conversacionService.getByCanal(canal, pageable);
        } else {
            // Sin filtros: todas las conversaciones
            conversaciones = conversacionService.getAllPaged(pageable);
        }
        
        Page<ConversacionDTO> dtos = conversaciones.map(ConversacionMapper::toDTO);
        return ResponseEntity.ok(new ApiResponse<>(true, dtos, null));
    }

    /**
     * GET /api/admin/conversaciones/{id}/detalles
     * 
     * Retorna detalles completos de una conversación (incluyendo vendedor actual).
     * Requiere: Rol ADMIN
     */
    @GetMapping("/conversaciones/{id}/detalles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ConversacionDTO>> getConversacionDetalles(@PathVariable Long id) {
        Conversacion conversacion = conversacionService.getById(id);
        ConversacionDTO dto = ConversacionMapper.toDTO(conversacion);
        return ResponseEntity.ok(new ApiResponse<>(true, dto, null));
    }

    /**
     * GET /api/admin/inbox/resumen
     * 
     * Dashboard del Inbox para Admin: estadísticas generales.
     * 
     * Retorna:
     * - totalConversaciones: Total de conversaciones activas
     * - noLeidosTotal: Conversaciones no leídas
     * - porCanal: Desglose por canal (WhatsApp, Email)
     * - porVendedor: Desglose por vendedor asignado
     * - pendientesRespuesta: Conversaciones que requieren respuesta
     */
    @GetMapping("/inbox/resumen")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<java.util.Map<String, Object>>> getInboxResumen() {
        java.util.Map<String, Object> resumen = new java.util.HashMap<>();
        
        // Estadísticas generales
        java.util.List<Conversacion> todas = conversacionService.getAll();
        resumen.put("totalConversaciones", todas.size());
        
        // Contar no leídas
        long noLeidas = todas.stream()
                .filter(c -> c.getEstado().toString().equals("NO_LEIDO"))
                .count();
        resumen.put("noLeidosTotal", noLeidas);
        
        // Desglose por canal
        java.util.Map<String, Long> porCanal = todas.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        Conversacion::getCanal,
                        java.util.stream.Collectors.counting()
                ));
        resumen.put("porCanal", porCanal);
        
        // Desglose por vendedor
        java.util.Map<String, Long> porVendedor = todas.stream()
                .filter(c -> c.getVendedorAsignado() != null)
                .collect(java.util.stream.Collectors.groupingBy(
                        c -> c.getVendedorAsignado().getNombre(),
                        java.util.stream.Collectors.counting()
                ));
        resumen.put("porVendedor", porVendedor);
        
        return ResponseEntity.ok(new ApiResponse<>(true, resumen, null));
    }

    /**
     * PUT /api/admin/conversaciones/{id}/reasignar
     * 
     * Admin puede reasignar una conversación a otro vendedor.
     * Requiere: Rol ADMIN
     */
    @PutMapping("/conversaciones/{id}/reasignar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ConversacionDTO>> reasignarConversacion(
            @PathVariable Long id,
            @RequestParam Long nuevoVendedorId) {
        
        // Obtener conversación
        Conversacion conversacion = conversacionService.getById(id);
        
        // Obtener nuevo vendedor
        Usuario nuevoVendedor = usuarioService.getById(nuevoVendedorId);
        
        // Validar que sea VENDEDOR
        if (!nuevoVendedor.getRole().toString().equals("VENDEDOR")) {
            throw new ForbiddenAccessException("Solo se pueden asignar conversaciones a vendedores");
        }
        
        // Reasignar
        conversacion.setVendedorAsignado(nuevoVendedor);
        Conversacion updated = conversacionService.save(conversacion);
        
        ConversacionDTO dto = ConversacionMapper.toDTO(updated);
        return ResponseEntity.ok(new ApiResponse<>(true, dto, null));
    }

    /**
     * Helper: Obtener usuario autenticado actual
     */
    private CustomUserDetailsService.CustomUserDetails getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (CustomUserDetailsService.CustomUserDetails) auth.getPrincipal();
    }
}

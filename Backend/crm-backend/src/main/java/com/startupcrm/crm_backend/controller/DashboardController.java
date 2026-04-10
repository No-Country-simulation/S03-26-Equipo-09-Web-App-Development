package com.startupcrm.crm_backend.controller;

import com.startupcrm.crm_backend.dto.ApiResponse;
import com.startupcrm.crm_backend.dto.DashboardDTO;
import com.startupcrm.crm_backend.model.EstadoLead;
import com.startupcrm.crm_backend.repository.ContactoRepository;
import com.startupcrm.crm_backend.repository.ConversacionRepository;
import com.startupcrm.crm_backend.repository.SeguimientoRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final ContactoRepository contactoRepo;
    private final ConversacionRepository conversacionRepo;
    private final SeguimientoRepository seguimientoRepo;

    public DashboardController(ContactoRepository contactoRepo,
                               ConversacionRepository conversacionRepo,
                               SeguimientoRepository seguimientoRepo) {
        this.contactoRepo = contactoRepo;
        this.conversacionRepo = conversacionRepo;
        this.seguimientoRepo = seguimientoRepo;
    }

    @GetMapping("/stats")
    public ApiResponse<DashboardDTO> getStats() {
        DashboardDTO dto = new DashboardDTO();

        // 1. Métricas generales
        dto.setTotalContactos(contactoRepo.count());
        dto.setInteraccionesTotales(conversacionRepo.count());
        dto.setMensajesSinLeer(conversacionRepo.countByLeidoFalseAndEsEntranteTrue());

        // 2. Leads de hoy (desde las 00:00)
        LocalDateTime inicioHoy = LocalDateTime.now().with(LocalTime.MIN);
        LocalDateTime finHoy = LocalDateTime.now().with(LocalTime.MAX);
        dto.setNuevosLeadsHoy(contactoRepo.countByFechaCreacionBetween(inicioHoy, finHoy));

        // 3. Tareas vencidas o para hoy
        dto.setTareasPendientes(seguimientoRepo.findByCompletadoFalseAndFechaBefore(LocalDateTime.now()).size());

        // 4. Distribución por estados (para la gráfica de pastel)
        Map<String, Long> statsPorEstado = new HashMap<>();
        for (EstadoLead estado : EstadoLead.values()) {
            statsPorEstado.put(estado.name(), contactoRepo.countByEstado(estado));
        }
        dto.setContactosPorEstado(statsPorEstado);

        return new ApiResponse<>(true, dto, null);
    }
}
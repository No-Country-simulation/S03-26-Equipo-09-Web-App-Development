package com.startupcrm.crm_backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.Map;

@Getter
@Setter
public class DashboardDTO {
    private long totalContactos;
    private long nuevosLeadsHoy;
    private long tareasPendientes;
    private long mensajesSinLeer;

    // Un mapa para la gráfica de pastel: "NUEVO": 10, "CLIENTE": 5, etc.
    private Map<String, Long> contactosPorEstado;

    // Una métrica de actividad
    private long interaccionesTotales;
}
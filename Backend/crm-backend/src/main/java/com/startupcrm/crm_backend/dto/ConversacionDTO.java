package com.startupcrm.crm_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para Conversacion (Interacción omnicanal).
 * 
 * Perfectamente alineado con la interface Conversacion del frontend (apiClient.ts).
 * Soporta WhatsApp Cloud API y Brevo Email webhooks en una estructura unificada.
 * 
 * @author Backend Team
 * @version 2.0 - Refactorización MVP
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversacionDTO {

    private Long id;

    @NotBlank(message = "El canal es obligatorio")
    private String canal; // 'Email' | 'WhatsApp' - Valores literales para el frontend

    @NotBlank(message = "El contenido es obligatorio")
    private String contenido;

    @NotNull(message = "La fecha/hora es obligatoria")
    private LocalDateTime fechaHora;

    @NotNull(message = "El contactoId es obligatorio")
    private Long contactoId;

    private Long vendedorAsignadoId; // Opcional: puede ser null si mensaje sin asignar

    private String vendedorAsignadoNombre; // Necesario para UnifiedInbox del frontend
}


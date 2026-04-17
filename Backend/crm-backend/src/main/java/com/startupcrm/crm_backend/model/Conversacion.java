package com.startupcrm.crm_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entidad Conversacion (Interacción Omnicanal).
 * 
 * Almacena mensajes de WhatsApp Cloud API y Emails de Brevo en una estructura unificada.
 * Permite al frontend renderizar el UnifiedInbox sin transformaciones complejas.
 * 
 * NOTA: Para escalabilidad futura, considerar migrar hilos largos a MongoDB.
 * 
 * @author Backend Team
 * @version 2.0 - Refactorización MVP
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "conversaciones")
public class Conversacion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String canal; // 'WhatsApp' | 'Email'

    @Column(columnDefinition = "TEXT")
    private String contenido;

    @Column(nullable = false)
    private LocalDateTime fechaHora;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contacto_id", nullable = false)
    private Contacto contacto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendedor_asignado_id")
    private Usuario vendedorAsignado; // Puede ser null si es mensaje entrante sin asignar

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EstadoConversacion estado = EstadoConversacion.NO_LEIDO;

    /**
     * MEJORAS FUTURAS (POST-MVP):
     * - tipoOrigen: WEBHOOK_WHATSAPP | WEBHOOK_BREVO | MANUAL_SENDGRID
     * - timestampRecibido vs timestampEnviado
     * - id_externo para rastrear en sistemas terceros
     * - etiquetas para filtrado avanzado
     */
}

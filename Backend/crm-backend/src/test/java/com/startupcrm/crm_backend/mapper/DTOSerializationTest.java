package com.startupcrm.crm_backend.mapper;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.startupcrm.crm_backend.dto.ContactoDTO;
import com.startupcrm.crm_backend.dto.ConversacionDTO;
import com.startupcrm.crm_backend.model.Contacto;
import com.startupcrm.crm_backend.model.Conversacion;
import com.startupcrm.crm_backend.model.EstadoLead;
import com.startupcrm.crm_backend.model.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests para validar que los DTOs se serializan correctamente a JSON
 * y que el contrato con el frontend (apiClient.ts) es exacto.
 * 
 * @author Backend Team
 * @version 2.0 - MVP
 */
@DisplayName("DTO Serialization Tests - MVP Alignment")
public class DTOSerializationTest {

    private ObjectMapper objectMapper;
    private Usuario vendedor;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        
        // Crear vendedor para pruebas
        vendedor = Usuario.builder()
                .id(1L)
                .nombre("Juan García")
                .email("juan@example.com")
                .password("hash123")
                .role(Usuario.Role.VENDEDOR)
                .telefono("+34 600 123 456")
                .activo(true)
                .build();
    }

    @Test
    @DisplayName("ContactoDTO se mapea sin conversaciones ni seguimientos")
    void testContactoDTOMapping() {
        // Arrange
        Contacto contacto = Contacto.builder()
                .id(1L)
                .nombre("Carlos Pérez")
                .email("carlos@example.com")
                .telefono("+34 601 234 567")
                .estado(EstadoLead.LEAD_ACTIVO)
                .vendedorAsignado(vendedor)
                .build();

        // Act
        ContactoDTO dto = ContactoMapper.toDTO(contacto);

        // Assert - Todos los campos se mapean correctamente
        assertNotNull(dto);
        assertEquals(1L, dto.getId());
        assertEquals("Carlos Pérez", dto.getNombre());
        assertEquals("carlos@example.com", dto.getEmail());
        assertEquals("+34 601 234 567", dto.getTelefono());
        assertEquals(EstadoLead.LEAD_ACTIVO, dto.getEstado());
        assertEquals(1L, dto.getVendedorAsignadoId());

        System.out.println("✅ ContactoDTO mapea correctamente: " + dto);
    }

    @Test
    @DisplayName("ConversacionDTO mapea vendedorAsignadoNombre correctamente")
    void testConversacionDTOMapping() {
        // Arrange
        Contacto contacto = Contacto.builder()
                .id(5L)
                .nombre("María López")
                .email("maria@example.com")
                .build();

        Conversacion conversacion = Conversacion.builder()
                .id(100L)
                .canal("WhatsApp")
                .contenido("¿Hola, cómo estás?")
                .fechaHora(LocalDateTime.of(2026, 4, 14, 10, 30, 0))
                .contacto(contacto)
                .vendedorAsignado(vendedor)
                .build();

        // Act
        ConversacionDTO dto = ConversacionMapper.toDTO(conversacion);

        // Assert - Campos críticos para UnifiedInbox
        assertNotNull(dto);
        assertEquals(100L, dto.getId());
        assertEquals("WhatsApp", dto.getCanal());
        assertEquals("¿Hola, cómo estás?", dto.getContenido());
        assertEquals(5L, dto.getContactoId());
        assertEquals(1L, dto.getVendedorAsignadoId());
        assertEquals("Juan García", dto.getVendedorAsignadoNombre()); // ✅ CRÍTICO

        System.out.println("✅ ConversacionDTO mapea vendedorAsignadoNombre: " + dto.getVendedorAsignadoNombre());
    }

    @Test
    @DisplayName("Conversacion sin vendedor asignado maneja null correctamente")
    void testConversacionDTOWithoutVendedor() {
        // Arrange
        Contacto contacto = Contacto.builder()
                .id(10L)
                .nombre("Roberto Sánchez")
                .build();

        Conversacion conversacion = Conversacion.builder()
                .id(200L)
                .canal("Email")
                .contenido("Mensaje sin procesar")
                .fechaHora(LocalDateTime.of(2026, 4, 14, 15, 45, 0))
                .contacto(contacto)
                .vendedorAsignado(null)  // Sin asignar
                .build();

        // Act
        ConversacionDTO dto = ConversacionMapper.toDTO(conversacion);

        // Assert - Maneja null correctamente
        assertNotNull(dto);
        assertEquals(200L, dto.getId());
        assertNull(dto.getVendedorAsignadoId());
        assertNull(dto.getVendedorAsignadoNombre());
        assertEquals(10L, dto.getContactoId());

        System.out.println("✅ ConversacionDTO con null manejado correctamente");
    }

    @Test
    @DisplayName("ContactoDTO deserialización desde JSON funciona")
    void testContactoDTODeserialization() throws Exception {
        // Arrange
        String json = "{" +
                "\"id\":1," +
                "\"nombre\":\"Test User\"," +
                "\"email\":\"test@example.com\"," +
                "\"telefono\":\"+34 600 123 456\"," +
                "\"estado\":\"LEAD_ACTIVO\"," +
                "\"vendedorAsignadoId\":5" +
                "}";

        // Act
        ContactoDTO dto = objectMapper.readValue(json, ContactoDTO.class);

        // Assert
        assertNotNull(dto);
        assertEquals(1L, dto.getId());
        assertEquals("Test User", dto.getNombre());
        assertEquals("test@example.com", dto.getEmail());
        assertEquals(EstadoLead.LEAD_ACTIVO, dto.getEstado());
        assertEquals(5L, dto.getVendedorAsignadoId());

        System.out.println("✅ ContactoDTO deserialización correcta");
    }

    @Test
    @DisplayName("ContactoDTO Entity-to-DTO y de vuelta funciona")
    void testContactoDTORoundTrip() {
        // Arrange
        Contacto original = Contacto.builder()
                .id(42L)
                .nombre("Ana García")
                .email("ana@example.com")
                .telefono("+34 777 888 999")
                .estado(EstadoLead.CLIENTE)
                .vendedorAsignado(vendedor)
                .build();

        // Act
        ContactoDTO dto = ContactoMapper.toDTO(original);
        Contacto reconstructed = ContactoMapper.toEntity(dto);

        // Assert - Los datos se preservan
        assertEquals(original.getId(), reconstructed.getId());
        assertEquals(original.getNombre(), reconstructed.getNombre());
        assertEquals(original.getEmail(), reconstructed.getEmail());
        assertEquals(original.getTelefono(), reconstructed.getTelefono());
        assertEquals(original.getEstado(), reconstructed.getEstado());

        System.out.println("✅ Contacto roundtrip Entity->DTO->Entity exitoso");
    }

    @Test
    @DisplayName("Contacto null retorna DTO null")
    void testContactoMapperNullHandling() {
        // Act & Assert
        assertNull(ContactoMapper.toDTO(null));
        assertNull(ContactoMapper.toEntity(null));

        System.out.println("✅ ContactoMapper maneja null correctamente");
    }

    @Test
    @DisplayName("Conversacion null retorna DTO null")
    void testConversacionMapperNullHandling() {
        // Act & Assert
        assertNull(ConversacionMapper.toDTO(null));
        assertNull(ConversacionMapper.toEntity(null));

        System.out.println("✅ ConversacionMapper maneja null correctamente");
    }
}

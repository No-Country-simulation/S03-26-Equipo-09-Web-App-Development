package com.startupcrm.crm_backend.repository;

import com.startupcrm.crm_backend.model.Plantilla;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlantillaRepository extends JpaRepository<Plantilla, Long> {
    List<Plantilla> findByTipo(String tipo); // Ej: "WHATSAPP" o "EMAIL"
}
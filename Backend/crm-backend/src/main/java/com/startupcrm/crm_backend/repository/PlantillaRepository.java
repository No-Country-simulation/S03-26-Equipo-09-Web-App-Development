package com.startupcrm.crm_backend.repository;

import com.startupcrm.crm_backend.model.Plantilla;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlantillaRepository extends JpaRepository<Plantilla, Long> {
    Optional<Plantilla> findByNombre(String nombre);
    List<Plantilla> findByTipo(Plantilla.TipoPlantilla tipo);
    List<Plantilla> findByActiva(Boolean activa);
    List<Plantilla> findByTipoAndActiva(Plantilla.TipoPlantilla tipo, Boolean activa);
}

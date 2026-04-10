package com.startupcrm.crm_backend.config;

import com.startupcrm.crm_backend.model.Contacto;
import com.startupcrm.crm_backend.model.Conversacion;
import com.startupcrm.crm_backend.model.EstadoLead;
import com.startupcrm.crm_backend.repository.ContactoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Profile("dev")
public class DatabaseSeeder implements CommandLineRunner {

    private final ContactoRepository contactoRepository;
    private final Random random = new Random();

    //para nombres "realistas" usamos listas
    private static final List<String> NOMBRES = List.of(
            "Carlos", "Ana", "Luis", "María", "Pedro",
            "Sofía", "Jorge", "Lucía", "Miguel", "Valeria"
    );

    private static final List<String> APELLIDOS = List.of(
            "Pérez", "García", "López", "Hernández", "Jimenez",
            "Ramírez", "Torres", "Flores", "Vargas","Ortega"
    );

    @Override
    public void run(String... args) {

        System.out.println("🔥 DatabaseSeeder ejecutándose...");

        if (contactoRepository.count() > 0) {
            System.out.println("⚠️ Ya existen datos, no se ejecuta seeder");
            return;
        }

        List<Contacto> contactos = new ArrayList<>();

        for (int i = 0; i < 20; i++) {
            String nombre = getRandom(NOMBRES);
            String apellido = getRandom(APELLIDOS);

            Contacto contacto = new Contacto();
            contacto.setNombre(nombre + " " + apellido);
            contacto.setEmail((nombre + "." + apellido + i + "@example.com")
                    .toLowerCase().replace(" ", ""));
            contacto.setTelefono(generarTelefono());
            contacto.setEstado(getEstado(i));

            List<Conversacion> conversaciones = generarConversaciones(contacto);
            contacto.setConversaciones(conversaciones);

            contactos.add(contacto);
        }

        contactoRepository.saveAll(contactos);

    }

    private String getRandom(List<String> lista) {
        return lista.get(random.nextInt(lista.size()));
    }

    private String generarTelefono() {
        return "55" + (10000000 + random.nextInt(89999999));
    }

    private EstadoLead getEstado(int i) {
        if (i < 7) return EstadoLead.LEAD_ACTIVO;
        if (i < 14) return EstadoLead.EN_SEGUIMIENTO;
        if (i < 17) return EstadoLead.CALIFICADO;
        return EstadoLead.CLIENTE;
    }

    private List<Conversacion> generarConversaciones(Contacto contacto) {
        List<Conversacion> lista = new ArrayList<>();

        for (int i = 0; i < 2; i++) {
            Conversacion c = new Conversacion();
            c.setCanal(i % 2 == 0 ? "WHATSAPP" : "EMAIL");
            c.setContenido("Mensaje de prueba " + (i + 1));
            c.setEsEntrante(i % 2 == 0);
            c.setLeido(i % 2 != 0);
            c.setFechaHora(LocalDateTime.now().minusDays(i));
            c.setContacto(contacto);

            lista.add(c);
        }

        return lista;
    }


    private void seedContactos() {
        // lógica aquí
    }



}


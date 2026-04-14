package com.startupcrm.crm_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Configuración de beans para la aplicación
 */
@Configuration
public class AppConfiguration {

    /**
     * Configurar RestTemplate para llamadas HTTP
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    /**
     * Configurar ObjectMapper para mapeo de objetos JSON
     */
    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}

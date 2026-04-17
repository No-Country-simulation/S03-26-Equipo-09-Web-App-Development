package com.startupcrm.crm_backend.config;

import com.startupcrm.crm_backend.security.CustomUserDetailsService;
import com.startupcrm.crm_backend.security.JwtAuthenticationFilter;
import com.startupcrm.crm_backend.security.JwtProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Configuración de Seguridad con RBAC Granular y JWT.
 * 
 * Estrategia:
 * - Endpoints públicos: /login, /usuarios/register, /api/whatsapp/webhook
 * - Endpoints ADMIN only: /api/admin/*, /api/metricas/*, /api/exportar/*
 * - Endpoints protegidos por rol: Validados con @PreAuthorize
 * - JWT Stateless: Cada request debe llevar el token en Authorization header
 * 
 * @author Backend Team
 * @version 2.0 - RBAC Implementation
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtProvider jwtProvider;
    private final CustomUserDetailsService customUserDetailsService;

    public SecurityConfig(JwtProvider jwtProvider, CustomUserDetailsService customUserDetailsService) {
        this.jwtProvider = jwtProvider;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // ✅ PÚBLICOS - LECTURA (sin autenticación)
                        .requestMatchers(HttpMethod.POST, "/api/usuarios/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/usuarios/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/usuarios").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/usuarios/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/usuarios/vendedores").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/usuarios").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/contactos").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/contactos/por-vendedor/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/conversaciones").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/conversaciones/por-vendedor/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/conversaciones/por-contacto/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/seguimientos").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/metricas/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/whatsapp/webhook").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/email/webhook").permitAll()
                        
                        // 🔐 ADMIN ONLY (validado con @PreAuthorize)
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/exportar/**").hasRole("ADMIN")
                        
                        // 🔐 RESTO: requiere autenticación (cualquier rol)
                        .anyRequest().authenticated()
                );

        // Agregar filtro JWT antes del filtro de autenticación estándar
        http.addFilterBefore(
                jwtAuthenticationFilter(),
                UsernamePasswordAuthenticationFilter.class
        );

        return http.build();
    }

    /**
     * Instanciar el JwtAuthenticationFilter
     */
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtProvider, customUserDetailsService);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Permitir desde cualquier origen (desarrollo)
        configuration.setAllowedOrigins(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(false);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
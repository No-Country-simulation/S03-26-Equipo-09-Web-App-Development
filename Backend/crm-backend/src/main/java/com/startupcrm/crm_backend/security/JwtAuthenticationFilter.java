package com.startupcrm.crm_backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro JWT que valida el token en cada request y establece el contexto de seguridad.
 * 
 * Flujo:
 * 1. Extrae el token del header Authorization: Bearer <token>
 * 2. Valida el token usando JwtProvider
 * 3. Carga los detalles del usuario desde CustomUserDetailsService
 * 4. Establece el contexto de autenticación en Spring Security
 * 
 * @author Backend Team
 * @version 1.0 - RBAC Implementation
 */
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final CustomUserDetailsService customUserDetailsService;

    public JwtAuthenticationFilter(JwtProvider jwtProvider, CustomUserDetailsService customUserDetailsService) {
        this.jwtProvider = jwtProvider;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // Extraer JWT del header Authorization
            String jwt = extractJwtFromRequest(request);

            // Si existe JWT y es válido
            if (StringUtils.hasText(jwt) && jwtProvider.validateToken(jwt)) {
                // Obtener userId del token
                Long userId = jwtProvider.getUserIdFromToken(jwt);

                // Cargar detalles del usuario
                UserDetails userDetails = customUserDetailsService.loadUserById(userId);

                // Crear authentication token
                UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                // Establecer detalles de la solicitud
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Establecer el contexto de seguridad
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            log.error("No se pudo establecer autenticación de usuario", e);
        }

        // Continuar con la cadena de filtros
        filterChain.doFilter(request, response);
    }

    /**
     * Extraer JWT del header Authorization
     * Formato esperado: "Bearer <token>"
     */
    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring("Bearer ".length());
        }
        
        return null;
    }
}

package com.startupcrm.crm_backend.security;

import com.startupcrm.crm_backend.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * Proveedor JWT para generar y validar tokens de autenticación.
 * 
 * Estructura del token:
 * - Subject: userId
 * - Claims: email, nombre, role
 * - Expiración: configurable
 * 
 * @author Backend Team
 * @version 1.0 - RBAC Implementation
 */
@Component
public class JwtProvider {

    @Value("${jwt.secret:CrmIntelligentSecretKeyForJwtTokenGenerationAndValidationAndRBACSecurityImplementation2026BuildingTheNewFutureOfOmniChannelCommunicationPlatform}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}") // 24 hours por defecto
    private long jwtExpirationMs;

    /**
     * Generar JWT a partir de un Usuario
     * Usa JJWT 0.12.5 con sintaxis moderna: signWith(key) deduce HS512 del tipo de clave
     */
    public String generateToken(Usuario usuario) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        
        return Jwts.builder()
                .subject(usuario.getId().toString())
                .claim("email", usuario.getEmail())
                .claim("nombre", usuario.getNombre())
                .claim("role", usuario.getRole().toString())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key)
                .compact();
    }

    /**
     * Extraer userId del token
     */
    public Long getUserIdFromToken(String token) {
        Claims claims = extractClaims(token);
        return Long.parseLong(claims.getSubject());
    }

    /**
     * Extraer email del token
     */
    public String getEmailFromToken(String token) {
        return extractClaims(token).get("email", String.class);
    }

    /**
     * Extraer role del token
     */
    public String getRoleFromToken(String token) {
        return extractClaims(token).get("role", String.class);
    }

    /**
     * Extraer nombre del token
     */
    public String getNombreFromToken(String token) {
        return extractClaims(token).get("nombre", String.class);
    }

    /**
     * Validar que el token sea válido
     */
    public boolean validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            // Token inválido, expirado o con firma incorrecta
            return false;
        }
    }

    /**
     * Extraer todos los claims del token
     */
    private Claims extractClaims(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}

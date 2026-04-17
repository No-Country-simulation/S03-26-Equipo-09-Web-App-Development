package com.startupcrm.crm_backend.exception;

/**
 * Excepción lanzada cuando un usuario intenta acceder a un recurso sin permisos suficientes.
 * 
 * @author Backend Team
 * @version 1.0 - RBAC Implementation
 */
public class ForbiddenAccessException extends RuntimeException {
    
    public ForbiddenAccessException(String message) {
        super(message);
    }

    public ForbiddenAccessException(String message, Throwable cause) {
        super(message, cause);
    }
}

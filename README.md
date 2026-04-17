# CRM Backend - Equipo 09

[![DeepWiki Documentation](https://deepwiki.com/badge-maker?url=https%3A%2F%2Fdeepwiki.com%2FNo-Country-simulation%2FS03-26-Equipo-09-Web-App-Development)](https://deepwiki.com/No-Country-simulation/S03-26-Equipo-09-Web-App-Development)

## 📖 Descripción
Este proyecto corresponde al **CRM Backend** desarrollado por el **Equipo 09** en la simulación de No-Country.  
El sistema permite gestionar **contactos, conversaciones, seguimientos, usuarios y plantillas**, además de proveer un **dashboard de métricas** y un **scheduler automático de recordatorios**.

La documentación completa y actualizada se genera automáticamente en **DeepWiki**:  
👉 [Ver documentación](https://deepwiki.com/No-Country-simulation/S03-26-Equipo-09-Web-App-Development)



## 🚀 Tecnologías
- **Java 17**
- **Spring Boot 3.x**
- **Spring Security**
- **Spring Data JPA / Hibernate**
- **PostgreSQL**
- **SpringDoc OpenAPI (Swagger)**



## ⚙️ Instalación

1. Clonar el repositorio:
   bash
   git clone https://github.com/No-Country-simulation/S03-26-Equipo-09-Web-App-Development.git
   cd S03-26-Equipo-09-Web-App-Development/Backend/crm-backend
   

2. Configurar base de datos en application.properties:
   properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/crm_backend
   spring.datasource.username=postgres
   spring.datasource.password=postgres
   spring.jpa.hibernate.ddl-auto=update
   

3. Ejecutar el proyecto:
   bash
   mvn spring-boot:run
   

4. Acceder a Swagger UI:
   
   http://localhost:8080/swagger-ui.html
 

## 📡 Endpoints principales

### Contactos
GET /api/contactos
GET /api/contactos/{id}
POST /api/contactos
PUT /api/contactos/{id}
DELETE /api/contactos/{id}

### Conversaciones
GET /api/conversaciones
GET /api/conversaciones/{id}
POST /api/conversaciones
PUT /api/conversaciones/{id}
DELETE /api/conversaciones/{id}

### Seguimientos
  GET /api/seguimientos
  POST /api/seguimientos
  PUT /api/seguimientos/{id}
  DELETE /api/seguimientos/{id}

### Dashboard
GET /api/dashboard/stats


## 🗄️ Esquema de Base de Datos

sql
CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL
);

CREATE TABLE contactos (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE,
    telefono VARCHAR(50),
    estado VARCHAR(50) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id BIGINT REFERENCES usuarios(id)
);

CREATE TABLE conversaciones (
    id BIGSERIAL PRIMARY KEY,
    canal VARCHAR(50) NOT NULL,
    contenido TEXT NOT NULL,
    fecha_hora TIMESTAMP NOT NULL,
    es_entrante BOOLEAN,
    leido BOOLEAN,
    contacto_id BIGINT REFERENCES contactos(id) ON DELETE CASCADE
);

CREATE TABLE seguimientos (
    id BIGSERIAL PRIMARY KEY,
    tarea VARCHAR(255) NOT NULL,
    fecha TIMESTAMP NOT NULL,
    completado BOOLEAN DEFAULT FALSE,
    recordatorio_activado BOOLEAN DEFAULT FALSE,
    contacto_id BIGINT REFERENCES contactos(id) ON DELETE CASCADE
);

CREATE TABLE plantillas (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    contenido TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id BIGINT REFERENCES usuarios(id)
);
## 👥 Equipo
- **Equipo 09 - Web App Development (No-Country Simulation)**

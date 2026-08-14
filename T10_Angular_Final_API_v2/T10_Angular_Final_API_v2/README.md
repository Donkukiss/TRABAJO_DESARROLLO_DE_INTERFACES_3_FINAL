# API - Sistema de Gestión de Usuarios y Cursos

API REST desarrollada con **Spring Boot 3 + Spring Security + JWT**, que expone los
servicios de autenticación y de gestión de usuarios y cursos consumidos por el
frontend en Angular.

## Requisitos previos

- Java 17
- Maven (o usar el wrapper `./mvnw` incluido en el proyecto)
- MySQL 8 corriendo en `localhost:3306`

## Configuración de la base de datos

1. Crear la base de datos:
   ```sql
   CREATE DATABASE bd_final;
   ```
2. Revisar las credenciales en `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/bd_final
   spring.datasource.username=root
   spring.datasource.password=admin
   ```
   Ajustar usuario/contraseña según tu instalación local de MySQL.

Las tablas (`usuarios`, `telefonos`, `cursos`) se crean/actualizan automáticamente
gracias a `spring.jpa.hibernate.ddl-auto=update`.

## Instalación y ejecución

```bash
# Desde la carpeta del backend
./mvnw spring-boot:run
```

La API queda disponible en `http://localhost:9090`.

Al iniciar por primera vez, `DataInitializer` crea automáticamente 3 usuarios de
prueba (uno por cada rol) y 3 cursos de ejemplo:

| Rol         | DNI      | Contraseña      |
|-------------|----------|-----------------|
| Administrador | 00000000 | admin123      |
| Profesor      | 11111111 | profesor123   |
| Estudiante    | 22222222 | estudiante123 |

## Endpoints principales

### Autenticación (públicos)
| Método | Endpoint          | Descripción                              |
|--------|-------------------|-------------------------------------------|
| POST   | `/api/auth/login` | Recibe `{ dni, contrasena }`, devuelve el token JWT y datos del usuario (incluye `rol`) |

### Usuarios (requiere token, escritura solo rol `ADMIN`)
| Método | Endpoint                       | Descripción            |
|--------|---------------------------------|------------------------|
| GET    | `/api/users`                   | Listar usuarios        |
| GET    | `/api/users/{id}`              | Obtener un usuario     |
| POST   | `/api/users`                   | Crear usuario          |
| PUT    | `/api/users/{id}`              | Actualizar usuario     |
| DELETE | `/api/users/{id}`              | Eliminar usuario       |
| GET    | `/api/users/check-dni/{dni}`   | Verificar DNI único    |
| GET    | `/api/users/check-correo/{correo}` | Verificar correo único |

### Cursos (requiere token, escritura solo roles `ADMIN`/`PROFESOR`)
| Método | Endpoint             | Descripción       |
|--------|-----------------------|-------------------|
| GET    | `/api/courses`        | Listar cursos     |
| GET    | `/api/courses/{id}`   | Obtener un curso   |
| POST   | `/api/courses`        | Crear curso        |
| PUT    | `/api/courses/{id}`   | Actualizar curso   |
| DELETE | `/api/courses/{id}`   | Eliminar curso     |

Todas las rutas protegidas requieren el header:
```
Authorization: Bearer <token>
```

## Seguridad implementada

- Contraseñas cifradas con `BCryptPasswordEncoder`.
- Autenticación *stateless* con JWT (`JwtUtil`, `JwtFilter`), token válido por 24h.
- El token incluye el rol del usuario (`ADMIN`, `PROFESOR`, `ESTUDIANTE`) como claim.
- Autorización por rol a nivel de backend con `SecurityConfig`
  (`hasRole` / `hasAnyRole`), además de la protección en el frontend con guards.
- CORS habilitado solo para `http://localhost:4200` (origen del frontend Angular).

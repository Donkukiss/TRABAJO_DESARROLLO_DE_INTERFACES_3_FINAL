# Sistema Académico de Gestión de Usuarios, Cursos y Matrículas

Proyecto final del curso **Desarrollo de Interfaces 3** - IDAT, Escuela de Tecnología.

Aplicación web tipo SPA (Single Page Application) desarrollada en **Angular**, que consume una **API REST** construida con **Spring Boot**, con autenticación mediante **JWT** y control de acceso según el rol del usuario (Administrador, Profesor, Estudiante).

## Integrantes

- Erick Sumari Huaita
- Gino Llanes Calero
- Esteffen Medina Silva

## Estructura del repositorio

```
├── T10_Angular_Final_v2/        → Frontend (Angular)
└── T10_Angular_Final_API_v2/    → Backend (Spring Boot + MySQL)
```

Cada carpeta tiene su propio `README.md` con las instrucciones detalladas de instalación y ejecución:

- [Instrucciones del Frontend (Angular)](./T10_Angular_Final_v2/T10_Angular_Final_v2/README.md)
- [Instrucciones del Backend (Spring Boot)](./T10_Angular_Final_API_v2/T10_Angular_Final_API_v2/README.md)

## Tecnologías utilizadas

- **Frontend:** Angular, TypeScript, HttpClient, Reactive Forms
- **Backend:** Spring Boot, Spring Security, JWT, JPA/Hibernate
- **Base de datos:** MySQL

## Funcionalidades principales

- Login con validación JWT
- Enrutamiento protegido mediante Guards (autenticación y roles)
- Carga dinámica de componentes según el tipo de usuario
- Gestión de usuarios, cursos, secciones, asignaciones de docentes, matrículas y notas
- Consumo de API REST (GET, POST, PUT, DELETE) mediante HttpClient

## Orden de ejecución

1. Levantar la base de datos MySQL (ver instrucciones en el README del backend).
2. Ejecutar el backend (Spring Boot) en `http://localhost:9090`.
3. Ejecutar el frontend (Angular) en `http://localhost:4200`.

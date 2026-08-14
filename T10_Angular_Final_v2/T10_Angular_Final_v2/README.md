# Frontend - Sistema de Gestión de Usuarios y Cursos (Angular)

SPA desarrollada en **Angular** que consume la API REST (Spring Boot + JWT) para
gestionar usuarios y cursos de forma centralizada, con navegación protegida según
el rol del usuario (Administrador, Profesor, Estudiante).

## Requisitos previos

- Node.js 18+ y npm
- Backend corriendo en `http://localhost:9090` (ver README del backend)

## Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Levantar servidor de desarrollo
ng serve
```

La aplicación queda disponible en `http://localhost:4200`.

## Usuarios de prueba

El backend crea automáticamente estos usuarios al iniciar (también visibles en la
pantalla de login):

| Rol           | DNI      | Contraseña      |
|---------------|----------|-----------------|
| Administrador | 00000000 | admin123        |
| Profesor      | 11111111 | profesor123     |
| Estudiante    | 22222222 | estudiante123   |

## Estructura del proyecto

```
src/app/
├── core/
│   ├── guards/          # authGuard, roleGuard, loginGuard
│   ├── interceptors/    # authInterceptor, errorInterceptor
│   ├── models/          # interfaces de User, Course, Auth
│   ├── pipes/           # rolLabel (pipe personalizado)
│   ├── directives/      # appHasRole (directiva estructural personalizada)
│   ├── services/        # AuthService, UserService, CourseService
│   └── validators/      # validador async de DNI/correo únicos
└── components/
    ├── login/            # ruta pública
    ├── dashboard/         # layout privado con sidebar por rol
    ├── dashboard-home/    # página de inicio, contenido dinámico según rol
    ├── user-management/   # CRUD de usuarios (solo ADMIN)
    ├── course-management/ # CRUD de cursos (ADMIN/PROFESOR editan, todos ven)
    └── not-found/          # página 404
```

## Rutas y navegación

| Ruta                  | Acceso                          | Carga            |
|------------------------|----------------------------------|-------------------|
| `/login`               | Público (bloqueado si ya hay sesión, vía `loginGuard`) | Lazy |
| `/dashboard`            | Requiere sesión (`authGuard`)   | Lazy, layout con rutas anidadas |
| `/dashboard` (hijo `''`) | Requiere sesión                | Lazy, resumen según rol |
| `/dashboard/usuarios`   | Solo rol `ADMIN` (`roleGuard`)  | Lazy |
| `/dashboard/cursos`     | Cualquier rol autenticado (`roleGuard`) | Lazy |
| `/404`, `**`            | Público                        | Lazy, ruta comodín para URLs inexistentes |

Todos los componentes se cargan mediante **lazy loading** (`loadComponent`), y las
rutas de usuarios/cursos están anidadas como hijas de `/dashboard`, que actúa como
layout compartido (sidebar + `router-outlet`).

## Guards implementados

- **`authGuard`**: bloquea el acceso a `/dashboard` y sus hijos si no hay token válido.
- **`roleGuard`**: además de validar sesión, revisa `route.data['roles']` y compara
  contra el rol del usuario autenticado; si no coincide, redirige a `/dashboard`
  con un aviso de acceso denegado.
- **`loginGuard`**: si el usuario ya tiene sesión activa, lo redirige directo al
  dashboard en vez de mostrarle el login nuevamente.

## Autenticación JWT

- `AuthService.login()` envía las credenciales a `/api/auth/login` y guarda el
  token y los datos del usuario (nombre, rol) en `sessionStorage`.
- `authInterceptor` inyecta automáticamente el header `Authorization: Bearer <token>`
  en cada petición HTTP saliente.
- `errorInterceptor` intercepta respuestas `401`/`403`, cierra la sesión y
  redirige al login automáticamente.

## Consumo de la API REST

`UserService` y `CourseService` encapsulan toda la comunicación HTTP con el
backend usando `HttpClient`, con un método por operación (GET, POST, PUT, DELETE),
devolviendo `Observable` para que los componentes se suscriban y gestionen el
flujo de datos de forma reactiva.

## Pipe y directiva personalizados

- **`RolLabelPipe`** (`rolLabel`): traduce el rol técnico (`ADMIN`, `PROFESOR`,
  `ESTUDIANTE`) a una etiqueta legible en español.
- **`HasRoleDirective`** (`*appHasRole`): directiva estructural que muestra u
  oculta elementos del DOM según el rol del usuario autenticado (por ejemplo,
  ocultar los botones de "Editar/Eliminar" a quien no sea administrador).

## Pruebas funcionales sugeridas

1. Ingresar con el usuario **Estudiante** → verificar que no aparece el menú
   "Usuarios" y que al intentar entrar a `/dashboard/usuarios` manualmente por
   la URL, el `roleGuard` redirige de vuelta con el aviso de acceso denegado.
2. Ingresar con el usuario **Administrador** → crear, editar y eliminar un
   usuario y un curso; verificar que los cambios se reflejan en la tabla.
3. Cerrar sesión y verificar que `/dashboard` ya no es accesible (redirige a
   `/login`).
4. Ingresar a una URL inexistente (ej. `/foo`) y verificar que se muestra la
   página 404.

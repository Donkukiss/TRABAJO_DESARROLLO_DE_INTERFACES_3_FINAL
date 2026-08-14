export type UserRole = 'ADMIN' | 'PROFESOR' | 'ESTUDIANTE';

export interface LoginRequest {
  dni: string;
  contrasena: string;
}

export interface AuthResponse {
  token: string;
  dni: string;
  nombres: string;
  apellidos: string;
  rol: UserRole;
}
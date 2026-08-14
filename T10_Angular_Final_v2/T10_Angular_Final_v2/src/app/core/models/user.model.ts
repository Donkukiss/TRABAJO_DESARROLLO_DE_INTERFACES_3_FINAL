import { UserRole } from './auth.model';

export interface Rol {
  idRol?: number;
  nombreRol: UserRole;
  descripcion?: string;
}

export interface User {
  idUsuario?: number;
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  password?: string;
  idRol: number;
  estado?: boolean;
  rol?: Rol;

  especialidad?: string;
  gradoAcademico?: string;
  dniApoderado?: string;
  fechaNacimiento?: string;
  telefono?: string;
}

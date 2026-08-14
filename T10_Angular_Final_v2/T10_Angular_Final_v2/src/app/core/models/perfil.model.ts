export interface UsuarioResumen {
  idUsuario: number;
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
}

export interface DocentePerfil {
  idDocente: number;
  usuario: UsuarioResumen;
  especialidad?: string;
  gradoAcademico?: string;
  telefono?: string;
}

export interface AlumnoPerfil {
  idAlumno: number;
  usuario: UsuarioResumen;
  dniApoderado?: string;
  telefono?: string;
  fechaNacimiento?: string;
}

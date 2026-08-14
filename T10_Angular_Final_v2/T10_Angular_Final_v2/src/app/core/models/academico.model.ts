import { DocentePerfil, AlumnoPerfil } from './perfil.model';
import { Course, Seccion } from './course.model';

export interface AsignacionCurso {
  idAsignacion?: number;
  idDocente: number;
  idCurso: number;
  estado?: boolean;
  docente?: DocentePerfil;
  curso?: Course;
}

export interface Matricula {
  idMatricula?: number;
  idAlumno: number;
  idSeccion: number;
  estado?: boolean;
  fechaMatricula?: string;
  alumno?: AlumnoPerfil;
  seccion?: Seccion;
}

export interface NotaCurso {
  idNota?: number;
  idCurso: number;
  idAlumno: number;
  nombreEvaluacion: string;
  calificacion: number;
  ponderacion: number;
  curso?: Course;
  alumno?: AlumnoPerfil;
}

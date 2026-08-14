export interface Seccion {
  idSeccion?: number;
  nombreSeccion: string;
  periodoAcademico: string;
  capacidadMaxima: number;
  estado: boolean;
}

export interface Course {
  idCurso?: number;
  nombre: string;
  descripcion: string;
  idSeccion: number;
  estado: boolean;
  seccion?: Seccion;
}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotaCursoService } from '../../core/services/nota-curso.service';
import { AlumnoService } from '../../core/services/alumno.service';
import { CourseService } from '../../core/services/course.service';
import { NotaCurso } from '../../core/models/academico.model';
import { AlumnoPerfil } from '../../core/models/perfil.model';
import { Course } from '../../core/models/course.model';

@Component({
  selector: 'app-nota-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nota-management.html',
  styleUrls: ['./nota-management.css']
})
export class NotaManagement implements OnInit {
  notaForm!: FormGroup;
  notas: NotaCurso[] = [];
  alumnos: AlumnoPerfil[] = [];
  cursos: Course[] = [];
  editingNotaId: number | null = null;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private notaService: NotaCursoService,
    private alumnoService: AlumnoService,
    private courseService: CourseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.notaForm = this.fb.group({
      idCurso: [null, [Validators.required]],
      idAlumno: [null, [Validators.required]],
      nombreEvaluacion: ['', [Validators.required, Validators.minLength(3)]],
      calificacion: [null, [Validators.required, Validators.min(0), Validators.max(20)]],
      ponderacion: [null, [Validators.required, Validators.min(0), Validators.max(100)]]
    });

    this.loadAlumnos();
    this.loadCursos();
    this.loadNotas();
  }

  loadAlumnos(): void {
    this.alumnoService.getAll().subscribe({
      next: (data) => { this.alumnos = data; this.cdr.detectChanges(); },
      error: () => {}
    });
  }

  loadCursos(): void {
    this.courseService.getAll().subscribe({
      next: (data) => { this.cursos = data; this.cdr.detectChanges(); },
      error: () => {}
    });
  }

  loadNotas(): void {
    this.notaService.getAll().subscribe({
      next: (data) => { this.notas = data; this.cdr.detectChanges(); },
      error: () => { this.errorMessage = 'No se pudieron cargar las notas.'; }
    });
  }

  onSubmit(): void {
    if (this.notaForm.invalid) {
      this.notaForm.markAllAsTouched();
      return;
    }

    if (this.editingNotaId) {
      this.notaService.update(this.editingNotaId, this.notaForm.value).subscribe({
        next: () => {
          this.resetForm();
          this.loadNotas();
        },
        error: () => { this.errorMessage = 'No se pudo actualizar la nota.'; }
      });
    } else {
      this.notaService.create(this.notaForm.value).subscribe({
        next: () => {
          this.resetForm();
          this.loadNotas();
        },
        error: () => { this.errorMessage = 'No se pudo registrar la nota.'; }
      });
    }
  }

  onEdit(nota: NotaCurso): void {
    this.editingNotaId = nota.idNota!;
    this.notaForm.patchValue({
      idCurso: nota.curso?.idCurso ?? nota.idCurso,
      idAlumno: nota.alumno?.idAlumno ?? nota.idAlumno,
      nombreEvaluacion: nota.nombreEvaluacion,
      calificacion: nota.calificacion,
      ponderacion: nota.ponderacion
    });
  }

  onDelete(id: number): void {
    if (confirm('¿Está seguro de eliminar esta nota?')) {
      this.notaService.delete(id).subscribe({
        next: () => this.loadNotas(),
        error: () => { this.errorMessage = 'No se pudo eliminar la nota.'; }
      });
    }
  }

  resetForm(): void {
    this.editingNotaId = null;
    this.errorMessage = '';
    this.notaForm.reset();
  }
}

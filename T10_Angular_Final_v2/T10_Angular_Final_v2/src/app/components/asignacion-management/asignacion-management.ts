import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsignacionCursoService } from '../../core/services/asignacion-curso.service';
import { DocenteService } from '../../core/services/docente.service';
import { CourseService } from '../../core/services/course.service';
import { AsignacionCurso } from '../../core/models/academico.model';
import { DocentePerfil } from '../../core/models/perfil.model';
import { Course } from '../../core/models/course.model';

@Component({
  selector: 'app-asignacion-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './asignacion-management.html',
  styleUrls: ['./asignacion-management.css']
})
export class AsignacionManagement implements OnInit {
  asignacionForm!: FormGroup;
  asignaciones: AsignacionCurso[] = [];
  docentes: DocentePerfil[] = [];
  cursos: Course[] = [];
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private asignacionService: AsignacionCursoService,
    private docenteService: DocenteService,
    private courseService: CourseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.asignacionForm = this.fb.group({
      idDocente: [null, [Validators.required]],
      idCurso: [null, [Validators.required]],
      estado: [true, [Validators.required]]
    });

    this.loadDocentes();
    this.loadCursos();
    this.loadAsignaciones();
  }

  loadDocentes(): void {
    this.docenteService.getAll().subscribe({
      next: (data) => { this.docentes = data; this.cdr.detectChanges(); },
      error: () => {}
    });
  }

  loadCursos(): void {
    this.courseService.getAll().subscribe({
      next: (data) => { this.cursos = data; this.cdr.detectChanges(); },
      error: () => {}
    });
  }

  loadAsignaciones(): void {
    this.asignacionService.getAll().subscribe({
      next: (data) => { this.asignaciones = data; this.cdr.detectChanges(); },
      error: () => { this.errorMessage = 'No se pudieron cargar las asignaciones.'; }
    });
  }

  onSubmit(): void {
    if (this.asignacionForm.invalid) {
      this.asignacionForm.markAllAsTouched();
      return;
    }

    this.asignacionService.create(this.asignacionForm.value).subscribe({
      next: () => {
        this.resetForm();
        this.loadAsignaciones();
      },
      error: () => { this.errorMessage = 'No se pudo crear la asignación.'; }
    });
  }

  onDelete(id: number): void {
    if (confirm('¿Está seguro de eliminar esta asignación?')) {
      this.asignacionService.delete(id).subscribe({
        next: () => this.loadAsignaciones(),
        error: () => { this.errorMessage = 'No se pudo eliminar la asignación.'; }
      });
    }
  }

  resetForm(): void {
    this.errorMessage = '';
    this.asignacionForm.reset({ estado: true });
  }
}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatriculaService } from '../../core/services/matricula.service';
import { AlumnoService } from '../../core/services/alumno.service';
import { SeccionService } from '../../core/services/seccion.service';
import { Matricula } from '../../core/models/academico.model';
import { AlumnoPerfil } from '../../core/models/perfil.model';
import { Seccion } from '../../core/models/course.model';

@Component({
  selector: 'app-matricula-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './matricula-management.html',
  styleUrls: ['./matricula-management.css']
})
export class MatriculaManagement implements OnInit {
  matriculaForm!: FormGroup;
  matriculas: Matricula[] = [];
  alumnos: AlumnoPerfil[] = [];
  secciones: Seccion[] = [];
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private matriculaService: MatriculaService,
    private alumnoService: AlumnoService,
    private seccionService: SeccionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.matriculaForm = this.fb.group({
      idAlumno: [null, [Validators.required]],
      idSeccion: [null, [Validators.required]],
      estado: [true, [Validators.required]]
    });

    this.loadAlumnos();
    this.loadSecciones();
    this.loadMatriculas();
  }

  loadAlumnos(): void {
    this.alumnoService.getAll().subscribe({
      next: (data) => { this.alumnos = data; this.cdr.detectChanges(); },
      error: () => {}
    });
  }

  loadSecciones(): void {
    this.seccionService.getAll().subscribe({
      next: (data) => { this.secciones = data; this.cdr.detectChanges(); },
      error: () => {}
    });
  }

  loadMatriculas(): void {
    this.matriculaService.getAll().subscribe({
      next: (data) => { this.matriculas = data; this.cdr.detectChanges(); },
      error: () => { this.errorMessage = 'No se pudieron cargar las matrículas.'; }
    });
  }

  onSubmit(): void {
    if (this.matriculaForm.invalid) {
      this.matriculaForm.markAllAsTouched();
      return;
    }

    this.matriculaService.create(this.matriculaForm.value).subscribe({
      next: () => {
        this.resetForm();
        this.loadMatriculas();
      },
      error: () => { this.errorMessage = 'No se pudo registrar la matrícula.'; }
    });
  }

  onDelete(id: number): void {
    if (confirm('¿Está seguro de eliminar esta matrícula?')) {
      this.matriculaService.delete(id).subscribe({
        next: () => this.loadMatriculas(),
        error: () => { this.errorMessage = 'No se pudo eliminar la matrícula.'; }
      });
    }
  }

  resetForm(): void {
    this.errorMessage = '';
    this.matriculaForm.reset({ estado: true });
  }
}

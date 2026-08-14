import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SeccionService } from '../../core/services/seccion.service';
import { Seccion } from '../../core/models/course.model';

@Component({
  selector: 'app-seccion-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './seccion-management.html',
  styleUrls: ['./seccion-management.css']
})
export class SeccionManagement implements OnInit {
  seccionForm!: FormGroup;
  secciones: Seccion[] = [];
  editingSeccionId: number | null = null;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private seccionService: SeccionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.seccionForm = this.fb.group({
      nombreSeccion: ['', [Validators.required, Validators.minLength(2)]],
      periodoAcademico: ['', [Validators.required]],
      capacidadMaxima: [30, [Validators.required, Validators.min(1)]],
      estado: [true, [Validators.required]]
    });

    this.loadSecciones();
  }

  loadSecciones(): void {
    this.seccionService.getAll().subscribe({
      next: (data) => { this.secciones = data; this.cdr.detectChanges(); },
      error: () => { this.errorMessage = 'No se pudieron cargar las secciones.'; }
    });
  }

  onSubmit(): void {
    if (this.seccionForm.invalid) {
      this.seccionForm.markAllAsTouched();
      return;
    }

    if (this.editingSeccionId) {
      this.seccionService.update(this.editingSeccionId, this.seccionForm.value).subscribe({
        next: () => {
          this.resetForm();
          this.loadSecciones();
        },
        error: () => { this.errorMessage = 'No se pudo actualizar la sección.'; }
      });
    } else {
      this.seccionService.create(this.seccionForm.value).subscribe({
        next: () => {
          this.resetForm();
          this.loadSecciones();
        },
        error: () => { this.errorMessage = 'No se pudo crear la sección.'; }
      });
    }
  }

  onEdit(seccion: Seccion): void {
    this.editingSeccionId = seccion.idSeccion!;
    this.seccionForm.patchValue({
      nombreSeccion: seccion.nombreSeccion,
      periodoAcademico: seccion.periodoAcademico,
      capacidadMaxima: seccion.capacidadMaxima,
      estado: seccion.estado
    });
  }

  onDelete(id: number): void {
    if (confirm('¿Está seguro de eliminar esta sección? Esto puede afectar cursos y matrículas relacionadas.')) {
      this.seccionService.delete(id).subscribe({
        next: () => this.loadSecciones(),
        error: () => { this.errorMessage = 'No se pudo eliminar la sección (verifique que no tenga cursos o matrículas asociadas).'; }
      });
    }
  }

  resetForm(): void {
    this.editingSeccionId = null;
    this.errorMessage = '';
    this.seccionForm.reset({ capacidadMaxima: 30, estado: true });
  }
}

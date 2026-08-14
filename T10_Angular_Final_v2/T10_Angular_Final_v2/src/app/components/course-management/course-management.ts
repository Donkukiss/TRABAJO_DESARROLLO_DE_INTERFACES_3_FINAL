import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseService } from '../../core/services/course.service';
import { SeccionService } from '../../core/services/seccion.service';
import { Course, Seccion } from '../../core/models/course.model';
import { HasRoleDirective } from '../../core/directives/has-role.directive';

@Component({
  selector: 'app-course-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HasRoleDirective],
  templateUrl: './course-management.html',
  styleUrls: ['./course-management.css']
})
export class CourseManagement implements OnInit {
  courseForm!: FormGroup;
  courses: Course[] = [];
  secciones: Seccion[] = [];
  editingCourseId: number | null = null;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private seccionService: SeccionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSecciones();
    this.loadCourses();
  }

  private initForm(): void {
    this.courseForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required]],
      idSeccion: [null, [Validators.required]],
      estado: [true, [Validators.required]]
    });
  }

  loadSecciones(): void {
    this.seccionService.getAll().subscribe({
      next: (data) => {
        this.secciones = data;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  loadCourses(): void {
    this.courseService.getAll().subscribe({
      next: (data) => {
        this.courses = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar los cursos.';
      }
    });
  }

  onSubmit(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }

    const courseData: Course = this.courseForm.value;

    if (this.editingCourseId) {
      this.courseService.update(this.editingCourseId, courseData).subscribe({
        next: () => {
          this.resetForm();
          this.loadCourses();
        },
        error: () => this.errorMessage = 'No se pudo actualizar el curso.'
      });
    } else {
      this.courseService.create(courseData).subscribe({
        next: () => {
          this.resetForm();
          this.loadCourses();
        },
        error: () => this.errorMessage = 'No se pudo crear el curso.'
      });
    }
  }

  onEdit(course: Course): void {
    this.editingCourseId = course.idCurso!;
    this.courseForm.patchValue({
      nombre: course.nombre,
      descripcion: course.descripcion,
      idSeccion: course.seccion?.idSeccion ?? course.idSeccion,
      estado: course.estado
    });
  }

  onDelete(id: number): void {
    if (confirm('¿Está seguro de eliminar este curso?')) {
      this.courseService.delete(id).subscribe({
        next: () => this.loadCourses(),
        error: () => this.errorMessage = 'No se pudo eliminar el curso.'
      });
    }
  }

  resetForm(): void {
    this.editingCourseId = null;
    this.errorMessage = '';
    this.courseForm.reset({ estado: true });
  }
}

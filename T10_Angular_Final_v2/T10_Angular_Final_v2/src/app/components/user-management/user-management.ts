import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { RolService } from '../../core/services/rol.service';
import { User, Rol } from '../../core/models/user.model';
import { UniqueUserValidator } from '../../core/validators/unique-user.validator';
import { RolLabelPipe } from '../../core/pipes/rol-label.pipe';
import { HasRoleDirective } from '../../core/directives/has-role.directive';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RolLabelPipe, HasRoleDirective],
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.css']
})
export class UserManagement implements OnInit {
  userForm!: FormGroup;
  users: User[] = [];
  roles: Rol[] = [];
  editingUserId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private rolService: RolService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadRoles();
    this.loadUsers();
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
      dni: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{8}$')],
        [UniqueUserValidator.dniExists(this.userService, () => this.getCurrentDni())]
      ],
      email: [
        '',
        [Validators.required, Validators.email],
        [UniqueUserValidator.correoExists(this.userService, () => this.getCurrentEmail())]
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      idRol: [null, [Validators.required]],
      estado: [true],
      especialidad: [''],
      gradoAcademico: [''],
      dniApoderado: [''],
      fechaNacimiento: [''],
      telefono: ['', [Validators.pattern('^[0-9]{9}$')]]
    });
  }

  private getCurrentDni(): string | null {
    if (!this.editingUserId) return null;
    const u = this.users.find(x => x.idUsuario === this.editingUserId);
    return u ? u.dni : null;
  }

  private getCurrentEmail(): string | null {
    if (!this.editingUserId) return null;
    const u = this.users.find(x => x.idUsuario === this.editingUserId);
    return u ? u.email : null;
  }

  get selectedRolNombre(): string | undefined {
    const idRol = this.userForm.get('idRol')?.value;
    return this.roles.find(r => r.idRol === idRol)?.nombreRol;
  }

  loadRoles(): void {
    this.rolService.getAll().subscribe({
      next: (data) => {
        this.roles = data;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const userData: User = this.userForm.value;

    if (this.editingUserId) {
      this.userService.update(this.editingUserId, userData).subscribe(() => {
        this.resetForm();
        this.loadUsers();
      });
    } else {
      this.userService.create(userData).subscribe(() => {
        this.resetForm();
        this.loadUsers();
      });
    }
  }

  onEdit(user: User): void {
    this.editingUserId = user.idUsuario!;

    this.userForm.patchValue({
      nombre: user.nombre,
      apellido: user.apellido,
      dni: user.dni,
      email: user.email,
      password: 'DEFAULT_PASSWORD',
      idRol: user.rol?.idRol ?? user.idRol,
      estado: user.estado ?? true
    });
  }

  onDelete(id: number): void {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      this.userService.delete(id).subscribe(() => this.loadUsers());
    }
  }

  resetForm(): void {
    this.editingUserId = null;
    this.userForm.reset({ estado: true });
  }
}

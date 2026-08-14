import { Pipe, PipeTransform } from '@angular/core';
import { UserRole } from '../models/auth.model';

@Pipe({
  name: 'rolLabel',
  standalone: true
})
export class RolLabelPipe implements PipeTransform {
  private labels: Record<UserRole, string> = {
    ADMIN: 'Administrador',
    PROFESOR: 'Profesor',
    ESTUDIANTE: 'Estudiante'
  };

  transform(value: UserRole | string | null | undefined): string {
    if (!value) return '-';
    return this.labels[value as UserRole] ?? value;
  }
}

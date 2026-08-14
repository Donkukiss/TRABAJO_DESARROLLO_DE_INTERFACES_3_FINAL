import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { UserService } from '../services/user.service';

export class UniqueUserValidator {
  static dniExists(userService: UserService, currentDniGetter: () => string | null): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value || control.value === currentDniGetter()) {
        return of(null);
      }
      return timer(400).pipe(
        switchMap(() => userService.checkDniExists(control.value)),
        map(exists => (exists ? { dniExists: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  static correoExists(userService: UserService, currentCorreoGetter: () => string | null): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value || control.value === currentCorreoGetter()) {
        return of(null);
      }
      return timer(400).pipe(
        switchMap(() => userService.checkCorreoExists(control.value)),
        map(exists => (exists ? { correoExists: true } : null)),
        catchError(() => of(null))
      );
    };
  }
}
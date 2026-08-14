import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { loginGuard } from './core/guards/login.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [loginGuard],
    loadComponent: () => import('./components/login/login').then(m => m.Login)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./components/dashboard/dashboard').then(m => m.Dashboard),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./components/dashboard-home/dashboard-home').then(m => m.DashboardHome)
      },
      {
        path: 'usuarios',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () => import('./components/user-management/user-management').then(m => m.UserManagement)
      },
      {
        path: 'cursos',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'PROFESOR', 'ESTUDIANTE'] },
        loadComponent: () => import('./components/course-management/course-management').then(m => m.CourseManagement)
      },
      {
        path: 'secciones',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () => import('./components/seccion-management/seccion-management').then(m => m.SeccionManagement)
      },
      {
        path: 'asignaciones',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () => import('./components/asignacion-management/asignacion-management').then(m => m.AsignacionManagement)
      },
      {
        path: 'matriculas',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () => import('./components/matricula-management/matricula-management').then(m => m.MatriculaManagement)
      },
      {
        path: 'notas',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'PROFESOR'] },
        loadComponent: () => import('./components/nota-management/nota-management').then(m => m.NotaManagement)
      },
      {
        path: 'mis-notas',
        canActivate: [roleGuard],
        data: { roles: ['ESTUDIANTE'] },
        loadComponent: () => import('./components/mis-notas/mis-notas').then(m => m.MisNotas)
      }
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./components/not-found/not-found').then(m => m.NotFound)
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: '404' }
];

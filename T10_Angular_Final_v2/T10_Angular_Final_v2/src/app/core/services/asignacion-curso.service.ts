import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AsignacionCurso } from '../models/academico.model';

@Injectable({
  providedIn: 'root'
})
export class AsignacionCursoService {
  private apiUrl = 'http://localhost:9090/api/asignaciones';

  constructor(private http: HttpClient) {}

  getAll(): Observable<AsignacionCurso[]> {
    return this.http.get<AsignacionCurso[]>(this.apiUrl);
  }

  create(asignacion: AsignacionCurso): Observable<AsignacionCurso> {
    return this.http.post<AsignacionCurso>(this.apiUrl, asignacion);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotaCurso } from '../models/academico.model';

@Injectable({
  providedIn: 'root'
})
export class NotaCursoService {
  private apiUrl = 'http://localhost:9090/api/notas';

  constructor(private http: HttpClient) {}

  getAll(): Observable<NotaCurso[]> {
    return this.http.get<NotaCurso[]>(this.apiUrl);
  }

  getMisNotas(): Observable<NotaCurso[]> {
    return this.http.get<NotaCurso[]>(`${this.apiUrl}/mis-notas`);
  }

  create(nota: NotaCurso): Observable<NotaCurso> {
    return this.http.post<NotaCurso>(this.apiUrl, nota);
  }

  update(id: number, nota: NotaCurso): Observable<NotaCurso> {
    return this.http.put<NotaCurso>(`${this.apiUrl}/${id}`, nota);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

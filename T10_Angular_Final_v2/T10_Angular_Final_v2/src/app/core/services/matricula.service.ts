import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Matricula } from '../models/academico.model';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {
  private apiUrl = 'http://localhost:9090/api/matriculas';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Matricula[]> {
    return this.http.get<Matricula[]>(this.apiUrl);
  }

  getMisMatriculas(): Observable<Matricula[]> {
    return this.http.get<Matricula[]>(`${this.apiUrl}/mis-matriculas`);
  }

  create(matricula: Matricula): Observable<Matricula> {
    return this.http.post<Matricula>(this.apiUrl, matricula);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

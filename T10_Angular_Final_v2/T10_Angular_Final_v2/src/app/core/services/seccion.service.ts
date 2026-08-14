import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Seccion } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class SeccionService {
  private apiUrl = 'http://localhost:9090/api/secciones';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Seccion[]> {
    return this.http.get<Seccion[]>(this.apiUrl);
  }

  create(seccion: Seccion): Observable<Seccion> {
    return this.http.post<Seccion>(this.apiUrl, seccion);
  }

  update(id: number, seccion: Seccion): Observable<Seccion> {
    return this.http.put<Seccion>(`${this.apiUrl}/${id}`, seccion);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

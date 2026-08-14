import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlumnoPerfil } from '../models/perfil.model';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  private apiUrl = 'http://localhost:9090/api/alumnos';

  constructor(private http: HttpClient) {}

  getAll(): Observable<AlumnoPerfil[]> {
    return this.http.get<AlumnoPerfil[]>(this.apiUrl);
  }
}

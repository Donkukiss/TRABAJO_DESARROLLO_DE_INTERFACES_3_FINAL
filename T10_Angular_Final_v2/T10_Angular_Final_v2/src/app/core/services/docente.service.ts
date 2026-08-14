import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocentePerfil } from '../models/perfil.model';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {
  private apiUrl = 'http://localhost:9090/api/docentes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<DocentePerfil[]> {
    return this.http.get<DocentePerfil[]>(this.apiUrl);
  }
}

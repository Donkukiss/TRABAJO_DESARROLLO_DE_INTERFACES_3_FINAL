import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotaCursoService } from '../../core/services/nota-curso.service';
import { MatriculaService } from '../../core/services/matricula.service';
import { NotaCurso, Matricula } from '../../core/models/academico.model';

@Component({
  selector: 'app-mis-notas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-notas.html',
  styleUrls: ['./mis-notas.css']
})
export class MisNotas implements OnInit {
  notas: NotaCurso[] = [];
  matriculas: Matricula[] = [];

  constructor(
    private notaService: NotaCursoService,
    private matriculaService: MatriculaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.notaService.getMisNotas().subscribe({
      next: (data) => { this.notas = data; this.cdr.detectChanges(); },
      error: () => {}
    });

    this.matriculaService.getMisMatriculas().subscribe({
      next: (data) => { this.matriculas = data; this.cdr.detectChanges(); },
      error: () => {}
    });
  }
}

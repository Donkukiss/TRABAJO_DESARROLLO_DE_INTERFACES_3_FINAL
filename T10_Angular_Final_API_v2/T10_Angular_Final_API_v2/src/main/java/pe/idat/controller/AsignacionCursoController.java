package pe.idat.controller;

import pe.idat.dto.AsignacionCursoRequest;
import pe.idat.model.AsignacionCurso;
import pe.idat.model.Curso;
import pe.idat.model.Docente;
import pe.idat.repository.AsignacionCursoRepository;
import pe.idat.repository.CursoRepository;
import pe.idat.repository.DocenteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/asignaciones")
public class AsignacionCursoController {

    private final AsignacionCursoRepository asignacionRepository;
    private final DocenteRepository docenteRepository;
    private final CursoRepository cursoRepository;

    public AsignacionCursoController(AsignacionCursoRepository asignacionRepository, DocenteRepository docenteRepository, CursoRepository cursoRepository) {
        this.asignacionRepository = asignacionRepository;
        this.docenteRepository = docenteRepository;
        this.cursoRepository = cursoRepository;
    }

    @GetMapping
    public List<AsignacionCurso> getAll() {
        return asignacionRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<AsignacionCurso> create(@RequestBody AsignacionCursoRequest request) {
        Docente docente = docenteRepository.findById(request.getIdDocente())
                .orElseThrow(() -> new RuntimeException("Docente no encontrado"));
        Curso curso = cursoRepository.findById(request.getIdCurso())
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        AsignacionCurso asignacion = new AsignacionCurso();
        asignacion.setDocente(docente);
        asignacion.setCurso(curso);
        asignacion.setEstado(request.getEstado() != null ? request.getEstado() : true);

        return ResponseEntity.ok(asignacionRepository.save(asignacion));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (asignacionRepository.existsById(id)) {
            asignacionRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

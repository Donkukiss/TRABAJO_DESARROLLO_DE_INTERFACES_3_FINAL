package pe.idat.controller;

import pe.idat.dto.CursoRequest;
import pe.idat.model.Curso;
import pe.idat.model.Seccion;
import pe.idat.repository.CursoRepository;
import pe.idat.repository.SeccionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CursoController {

    private final CursoRepository cursoRepository;
    private final SeccionRepository seccionRepository;

    public CursoController(CursoRepository cursoRepository, SeccionRepository seccionRepository) {
        this.cursoRepository = cursoRepository;
        this.seccionRepository = seccionRepository;
    }

    @GetMapping
    public List<Curso> getAll() {
        return cursoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Curso> getById(@PathVariable Long id) {
        return cursoRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Curso> create(@RequestBody CursoRequest request) {
        Seccion seccion = seccionRepository.findById(request.getIdSeccion())
                .orElseThrow(() -> new RuntimeException("Sección no encontrada"));

        Curso curso = new Curso();
        curso.setNombre(request.getNombre());
        curso.setDescripcion(request.getDescripcion());
        curso.setSeccion(seccion);
        curso.setEstado(request.getEstado() != null ? request.getEstado() : true);

        return ResponseEntity.ok(cursoRepository.save(curso));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Curso> update(@PathVariable Long id, @RequestBody CursoRequest request) {
        return cursoRepository.findById(id).map(c -> {
            c.setNombre(request.getNombre());
            c.setDescripcion(request.getDescripcion());
            if (request.getIdSeccion() != null) {
                Seccion seccion = seccionRepository.findById(request.getIdSeccion())
                        .orElseThrow(() -> new RuntimeException("Sección no encontrada"));
                c.setSeccion(seccion);
            }
            if (request.getEstado() != null) c.setEstado(request.getEstado());
            return ResponseEntity.ok(cursoRepository.save(c));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (cursoRepository.existsById(id)) {
            cursoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

package pe.idat.controller;

import pe.idat.model.Seccion;
import pe.idat.repository.SeccionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/secciones")
public class SeccionController {

    private final SeccionRepository seccionRepository;

    public SeccionController(SeccionRepository seccionRepository) {
        this.seccionRepository = seccionRepository;
    }

    @GetMapping
    public List<Seccion> getAll() {
        return seccionRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Seccion> getById(@PathVariable Long id) {
        return seccionRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Seccion> create(@RequestBody Seccion seccion) {
        return ResponseEntity.ok(seccionRepository.save(seccion));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Seccion> update(@PathVariable Long id, @RequestBody Seccion details) {
        return seccionRepository.findById(id).map(s -> {
            s.setNombreSeccion(details.getNombreSeccion());
            s.setPeriodoAcademico(details.getPeriodoAcademico());
            s.setCapacidadMaxima(details.getCapacidadMaxima());
            if (details.getEstado() != null) s.setEstado(details.getEstado());
            return ResponseEntity.ok(seccionRepository.save(s));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (seccionRepository.existsById(id)) {
            seccionRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

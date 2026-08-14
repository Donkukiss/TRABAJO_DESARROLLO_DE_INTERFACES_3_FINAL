package pe.idat.controller;

import pe.idat.dto.MatriculaRequest;
import pe.idat.model.Alumno;
import pe.idat.model.Matricula;
import pe.idat.model.Seccion;
import pe.idat.model.Usuario;
import pe.idat.repository.AlumnoRepository;
import pe.idat.repository.MatriculaRepository;
import pe.idat.repository.SeccionRepository;
import pe.idat.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/matriculas")
public class MatriculaController {

    private final MatriculaRepository matriculaRepository;
    private final AlumnoRepository alumnoRepository;
    private final SeccionRepository seccionRepository;
    private final UsuarioRepository usuarioRepository;

    public MatriculaController(MatriculaRepository matriculaRepository, AlumnoRepository alumnoRepository,
                                SeccionRepository seccionRepository, UsuarioRepository usuarioRepository) {
        this.matriculaRepository = matriculaRepository;
        this.alumnoRepository = alumnoRepository;
        this.seccionRepository = seccionRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public List<Matricula> getAll() {
        return matriculaRepository.findAll();
    }

    @GetMapping("/mis-matriculas")
    public List<Matricula> getMisMatriculas() {
        String dni = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByDni(dni).orElse(null);
        if (usuario == null) return Collections.emptyList();

        Alumno alumno = alumnoRepository.findByUsuario_IdUsuario(usuario.getIdUsuario()).orElse(null);
        if (alumno == null) return Collections.emptyList();

        return matriculaRepository.findAll().stream()
                .filter(m -> m.getAlumno().getIdAlumno().equals(alumno.getIdAlumno()))
                .toList();
    }

    @PostMapping
    public ResponseEntity<Matricula> create(@RequestBody MatriculaRequest request) {
        Alumno alumno = alumnoRepository.findById(request.getIdAlumno())
                .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));
        Seccion seccion = seccionRepository.findById(request.getIdSeccion())
                .orElseThrow(() -> new RuntimeException("Sección no encontrada"));

        Matricula matricula = new Matricula();
        matricula.setAlumno(alumno);
        matricula.setSeccion(seccion);
        matricula.setEstado(request.getEstado() != null ? request.getEstado() : true);

        return ResponseEntity.ok(matriculaRepository.save(matricula));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (matriculaRepository.existsById(id)) {
            matriculaRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

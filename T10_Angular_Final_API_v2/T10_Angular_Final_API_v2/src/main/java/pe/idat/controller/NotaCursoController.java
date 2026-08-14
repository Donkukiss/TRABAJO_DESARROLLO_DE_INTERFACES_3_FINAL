package pe.idat.controller;

import pe.idat.dto.NotaCursoRequest;
import pe.idat.model.Alumno;
import pe.idat.model.Curso;
import pe.idat.model.NotaCurso;
import pe.idat.model.Usuario;
import pe.idat.repository.AlumnoRepository;
import pe.idat.repository.CursoRepository;
import pe.idat.repository.NotaCursoRepository;
import pe.idat.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/notas")
public class NotaCursoController {

    private final NotaCursoRepository notaCursoRepository;
    private final CursoRepository cursoRepository;
    private final AlumnoRepository alumnoRepository;
    private final UsuarioRepository usuarioRepository;

    public NotaCursoController(NotaCursoRepository notaCursoRepository, CursoRepository cursoRepository,
                                AlumnoRepository alumnoRepository, UsuarioRepository usuarioRepository) {
        this.notaCursoRepository = notaCursoRepository;
        this.cursoRepository = cursoRepository;
        this.alumnoRepository = alumnoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public List<NotaCurso> getAll() {
        return notaCursoRepository.findAll();
    }

    @GetMapping("/mis-notas")
    public List<NotaCurso> getMisNotas() {
        String dni = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByDni(dni).orElse(null);
        if (usuario == null) return Collections.emptyList();

        Alumno alumno = alumnoRepository.findByUsuario_IdUsuario(usuario.getIdUsuario()).orElse(null);
        if (alumno == null) return Collections.emptyList();

        return notaCursoRepository.findAll().stream()
                .filter(n -> n.getAlumno().getIdAlumno().equals(alumno.getIdAlumno()))
                .toList();
    }

    @PostMapping
    public ResponseEntity<NotaCurso> create(@RequestBody NotaCursoRequest request) {
        Curso curso = cursoRepository.findById(request.getIdCurso())
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));
        Alumno alumno = alumnoRepository.findById(request.getIdAlumno())
                .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));

        NotaCurso nota = new NotaCurso();
        nota.setCurso(curso);
        nota.setAlumno(alumno);
        nota.setNombreEvaluacion(request.getNombreEvaluacion());
        nota.setCalificacion(request.getCalificacion());
        nota.setPonderacion(request.getPonderacion());

        return ResponseEntity.ok(notaCursoRepository.save(nota));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NotaCurso> update(@PathVariable Long id, @RequestBody NotaCursoRequest request) {
        return notaCursoRepository.findById(id).map(n -> {
            if (request.getIdCurso() != null) {
                Curso curso = cursoRepository.findById(request.getIdCurso())
                        .orElseThrow(() -> new RuntimeException("Curso no encontrado"));
                n.setCurso(curso);
            }
            if (request.getIdAlumno() != null) {
                Alumno alumno = alumnoRepository.findById(request.getIdAlumno())
                        .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));
                n.setAlumno(alumno);
            }
            n.setNombreEvaluacion(request.getNombreEvaluacion());
            n.setCalificacion(request.getCalificacion());
            n.setPonderacion(request.getPonderacion());
            return ResponseEntity.ok(notaCursoRepository.save(n));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (notaCursoRepository.existsById(id)) {
            notaCursoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

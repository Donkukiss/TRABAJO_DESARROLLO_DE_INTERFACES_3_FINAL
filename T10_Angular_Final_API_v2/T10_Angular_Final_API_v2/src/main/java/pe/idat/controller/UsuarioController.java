package pe.idat.controller;

import pe.idat.dto.UsuarioRequest;
import pe.idat.model.Alumno;
import pe.idat.model.Docente;
import pe.idat.model.Rol;
import pe.idat.model.Usuario;
import pe.idat.repository.AlumnoRepository;
import pe.idat.repository.DocenteRepository;
import pe.idat.repository.RolRepository;
import pe.idat.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UsuarioController {

    private static final String ROL_PROFESOR = "PROFESOR";
    private static final String ROL_ESTUDIANTE = "ESTUDIANTE";

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final DocenteRepository docenteRepository;
    private final AlumnoRepository alumnoRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioController(UsuarioRepository usuarioRepository, RolRepository rolRepository,
                              DocenteRepository docenteRepository, AlumnoRepository alumnoRepository,
                              PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.docenteRepository = docenteRepository;
        this.alumnoRepository = alumnoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<Usuario> getAll() {
        return usuarioRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getById(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody UsuarioRequest request) {
        Rol rol = rolRepository.findById(request.getIdRol())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        Usuario usuario = new Usuario();
        usuario.setDni(request.getDni());
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setEmail(request.getEmail());
        usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(rol);
        usuario.setEstado(request.getEstado() != null ? request.getEstado() : true);

        Usuario guardado = usuarioRepository.save(usuario);
        crearPerfilSegunRol(guardado, rol, request);

        return ResponseEntity.ok(guardado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody UsuarioRequest request) {
        return usuarioRepository.findById(id).map(u -> {
            u.setNombre(request.getNombre());
            u.setApellido(request.getApellido());
            u.setEmail(request.getEmail());
            if (request.getEstado() != null) {
                u.setEstado(request.getEstado());
            }

            Rol rol = u.getRol();
            if (request.getIdRol() != null) {
                rol = rolRepository.findById(request.getIdRol())
                        .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
                u.setRol(rol);
            }

            if (request.getPassword() != null && !request.getPassword().isBlank()
                    && !request.getPassword().equals("DEFAULT_PASSWORD")) {
                u.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            }

            Usuario actualizado = usuarioRepository.save(u);

            docenteRepository.findByUsuario_IdUsuario(actualizado.getIdUsuario()).ifPresent(docenteRepository::delete);
            alumnoRepository.findByUsuario_IdUsuario(actualizado.getIdUsuario()).ifPresent(alumnoRepository::delete);
            crearPerfilSegunRol(actualizado, rol, request);

            return ResponseEntity.ok(actualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!usuarioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        docenteRepository.findByUsuario_IdUsuario(id).ifPresent(docenteRepository::delete);
        alumnoRepository.findByUsuario_IdUsuario(id).ifPresent(alumnoRepository::delete);
        usuarioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check-dni/{dni}")
    public ResponseEntity<Boolean> checkDni(@PathVariable String dni) {
        return ResponseEntity.ok(usuarioRepository.existsByDni(dni));
    }

    @GetMapping("/check-email/{email}")
    public ResponseEntity<Boolean> checkEmail(@PathVariable String email) {
        return ResponseEntity.ok(usuarioRepository.existsByEmail(email));
    }

    private void crearPerfilSegunRol(Usuario usuario, Rol rol, UsuarioRequest request) {
        if (ROL_PROFESOR.equalsIgnoreCase(rol.getNombreRol())) {
            Docente docente = new Docente();
            docente.setUsuario(usuario);
            docente.setEspecialidad(request.getEspecialidad());
            docente.setGradoAcademico(request.getGradoAcademico());
            docente.setTelefono(request.getTelefono());
            docenteRepository.save(docente);
        } else if (ROL_ESTUDIANTE.equalsIgnoreCase(rol.getNombreRol())) {
            Alumno alumno = new Alumno();
            alumno.setUsuario(usuario);
            alumno.setDniApoderado(request.getDniApoderado());
            alumno.setTelefono(request.getTelefono());
            if (request.getFechaNacimiento() != null && !request.getFechaNacimiento().isBlank()) {
                alumno.setFechaNacimiento(LocalDate.parse(request.getFechaNacimiento()));
            }
            alumnoRepository.save(alumno);
        }
    }
}

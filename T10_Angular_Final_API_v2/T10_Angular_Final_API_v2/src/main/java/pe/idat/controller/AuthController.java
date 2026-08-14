package pe.idat.controller;

import pe.idat.model.Usuario;
import pe.idat.repository.UsuarioRepository;
import pe.idat.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String dni = request.get("dni");
        String contrasena = request.get("contrasena");

        Usuario usuario = usuarioRepository.findByDni(dni)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!Boolean.TRUE.equals(usuario.getEstado())) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Usuario inactivo");
            return ResponseEntity.status(403).body(error);
        }

        if (!passwordEncoder.matches(contrasena, usuario.getPasswordHash())) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Credenciales incorrectas");
            return ResponseEntity.status(401).body(error);
        }

        String rolNombre = usuario.getRol().getNombreRol();
        String token = jwtUtil.generateToken(dni, rolNombre);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("dni", dni);
        response.put("nombres", usuario.getNombre());
        response.put("apellidos", usuario.getApellido());
        response.put("rol", rolNombre);

        return ResponseEntity.ok(response);
    }
}

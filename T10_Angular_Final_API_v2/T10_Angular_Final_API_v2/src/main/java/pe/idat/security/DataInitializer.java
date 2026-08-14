package pe.idat.security;

import pe.idat.model.*;
import pe.idat.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;
    private final DocenteRepository docenteRepository;
    private final AlumnoRepository alumnoRepository;
    private final SeccionRepository seccionRepository;
    private final CursoRepository cursoRepository;
    private final AsignacionCursoRepository asignacionCursoRepository;
    private final MatriculaRepository matriculaRepository;
    private final NotaCursoRepository notaCursoRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RolRepository rolRepository, UsuarioRepository usuarioRepository,
                            DocenteRepository docenteRepository, AlumnoRepository alumnoRepository,
                            SeccionRepository seccionRepository, CursoRepository cursoRepository,
                            AsignacionCursoRepository asignacionCursoRepository,
                            MatriculaRepository matriculaRepository, NotaCursoRepository notaCursoRepository,
                            PasswordEncoder passwordEncoder) {
        this.rolRepository = rolRepository;
        this.usuarioRepository = usuarioRepository;
        this.docenteRepository = docenteRepository;
        this.alumnoRepository = alumnoRepository;
        this.seccionRepository = seccionRepository;
        this.cursoRepository = cursoRepository;
        this.asignacionCursoRepository = asignacionCursoRepository;
        this.matriculaRepository = matriculaRepository;
        this.notaCursoRepository = notaCursoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        Rol rolAdmin = rolRepository.findByNombreRol("ADMIN")
                .orElseGet(() -> rolRepository.save(new Rol(null, "ADMIN", "Administrador del sistema")));
        Rol rolProfesor = rolRepository.findByNombreRol("PROFESOR")
                .orElseGet(() -> rolRepository.save(new Rol(null, "PROFESOR", "Docente de la institución")));
        Rol rolEstudiante = rolRepository.findByNombreRol("ESTUDIANTE")
                .orElseGet(() -> rolRepository.save(new Rol(null, "ESTUDIANTE", "Alumno matriculado")));

        Usuario admin;
        if (!usuarioRepository.existsByDni("00000000")) {
            admin = new Usuario();
            admin.setDni("00000000");
            admin.setNombre("Admin");
            admin.setApellido("Sistema");
            admin.setEmail("admin@empresa.com");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRol(rolAdmin);
            admin = usuarioRepository.save(admin);
            System.out.println(">>> Usuario Administrador creado: DNI 00000000 / Password admin123");
        }

        Docente docente = null;
        if (!usuarioRepository.existsByDni("11111111")) {
            Usuario userProfesor = new Usuario();
            userProfesor.setDni("11111111");
            userProfesor.setNombre("Carlos");
            userProfesor.setApellido("Ramirez");
            userProfesor.setEmail("profesor@empresa.com");
            userProfesor.setPasswordHash(passwordEncoder.encode("profesor123"));
            userProfesor.setRol(rolProfesor);
            userProfesor = usuarioRepository.save(userProfesor);

            docente = new Docente();
            docente.setUsuario(userProfesor);
            docente.setEspecialidad("Desarrollo de Software");
            docente.setGradoAcademico("Magíster");
            docente.setTelefono("988888888");
            docente = docenteRepository.save(docente);

            System.out.println(">>> Usuario Profesor creado: DNI 11111111 / Password profesor123");
        } else {
            docente = docenteRepository.findAll().stream().findFirst().orElse(null);
        }

        Alumno alumno = null;
        if (!usuarioRepository.existsByDni("22222222")) {
            Usuario userEstudiante = new Usuario();
            userEstudiante.setDni("22222222");
            userEstudiante.setNombre("Maria");
            userEstudiante.setApellido("Lopez");
            userEstudiante.setEmail("estudiante@empresa.com");
            userEstudiante.setPasswordHash(passwordEncoder.encode("estudiante123"));
            userEstudiante.setRol(rolEstudiante);
            userEstudiante = usuarioRepository.save(userEstudiante);

            alumno = new Alumno();
            alumno.setUsuario(userEstudiante);
            alumno.setDniApoderado("87654321");
            alumno.setTelefono("977777777");
            alumno.setFechaNacimiento(LocalDate.of(2005, 4, 12));
            alumno = alumnoRepository.save(alumno);

            System.out.println(">>> Usuario Estudiante creado: DNI 22222222 / Password estudiante123");
        } else {
            alumno = alumnoRepository.findAll().stream().findFirst().orElse(null);
        }

        if (seccionRepository.count() == 0) {
            Seccion seccionA = seccionRepository.save(new Seccion(null, "Sección A", "2026-I", 30, true));
            Seccion seccionB = seccionRepository.save(new Seccion(null, "Sección B", "2026-I", 25, true));

            Curso curso1 = new Curso();
            curso1.setNombre("Desarrollo de Interfaces 3");
            curso1.setDescripcion("Angular avanzado, rutas, guards y JWT");
            curso1.setSeccion(seccionA);
            curso1 = cursoRepository.save(curso1);

            Curso curso2 = new Curso();
            curso2.setNombre("Base de Datos II");
            curso2.setDescripcion("Modelado y consultas avanzadas");
            curso2.setSeccion(seccionA);
            curso2 = cursoRepository.save(curso2);

            Curso curso3 = new Curso();
            curso3.setNombre("Programación Web");
            curso3.setDescripcion("Fundamentos de HTML, CSS y JS");
            curso3.setSeccion(seccionB);
            curso3.setEstado(false);
            curso3 = cursoRepository.save(curso3);

            System.out.println(">>> Secciones y cursos de ejemplo creados");

            if (docente != null) {
                AsignacionCurso asignacion = new AsignacionCurso();
                asignacion.setDocente(docente);
                asignacion.setCurso(curso1);
                asignacionCursoRepository.save(asignacion);
                System.out.println(">>> Curso asignado al docente de prueba");
            }

            if (alumno != null) {
                Matricula matricula = new Matricula();
                matricula.setAlumno(alumno);
                matricula.setSeccion(seccionA);
                matriculaRepository.save(matricula);
                System.out.println(">>> Alumno matriculado en Sección A");

                NotaCurso nota = new NotaCurso();
                nota.setCurso(curso1);
                nota.setAlumno(alumno);
                nota.setNombreEvaluacion("Práctica Calificada 1");
                nota.setCalificacion(new BigDecimal("16.50"));
                nota.setPonderacion(new BigDecimal("20.00"));
                notaCursoRepository.save(nota);
                System.out.println(">>> Nota de ejemplo registrada");
            }
        }
    }
}

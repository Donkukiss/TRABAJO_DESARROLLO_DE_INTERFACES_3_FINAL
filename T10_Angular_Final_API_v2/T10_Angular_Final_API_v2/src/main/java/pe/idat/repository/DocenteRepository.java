package pe.idat.repository;

import pe.idat.model.Docente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DocenteRepository extends JpaRepository<Docente, Long> {
    Optional<Docente> findByUsuario_IdUsuario(Long idUsuario);
}

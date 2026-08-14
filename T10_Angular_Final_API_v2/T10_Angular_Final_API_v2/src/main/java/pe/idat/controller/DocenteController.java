package pe.idat.controller;

import pe.idat.model.Docente;
import pe.idat.repository.DocenteRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/docentes")
public class DocenteController {

    private final DocenteRepository docenteRepository;

    public DocenteController(DocenteRepository docenteRepository) {
        this.docenteRepository = docenteRepository;
    }

    @GetMapping
    public List<Docente> getAll() {
        return docenteRepository.findAll();
    }
}

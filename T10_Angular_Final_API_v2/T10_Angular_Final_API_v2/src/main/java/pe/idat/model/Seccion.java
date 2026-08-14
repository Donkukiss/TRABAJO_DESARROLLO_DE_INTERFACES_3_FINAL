package pe.idat.model;

import jakarta.persistence.*;

@Entity
@Table(name = "seccion")
public class Seccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_seccion")
    private Long idSeccion;

    @Column(name = "nombre_seccion", nullable = false, length = 50)
    private String nombreSeccion;

    @Column(name = "periodo_academico", length = 20)
    private String periodoAcademico;

    @Column(name = "capacidad_maxima")
    private Integer capacidadMaxima;

    @Column(name = "estado", nullable = false)
    private Boolean estado = true;

    public Seccion() {}

    public Seccion(Long idSeccion, String nombreSeccion, String periodoAcademico, Integer capacidadMaxima, Boolean estado) {
        this.idSeccion = idSeccion;
        this.nombreSeccion = nombreSeccion;
        this.periodoAcademico = periodoAcademico;
        this.capacidadMaxima = capacidadMaxima;
        this.estado = estado;
    }

    public Long getIdSeccion() { return idSeccion; }
    public void setIdSeccion(Long idSeccion) { this.idSeccion = idSeccion; }

    public String getNombreSeccion() { return nombreSeccion; }
    public void setNombreSeccion(String nombreSeccion) { this.nombreSeccion = nombreSeccion; }

    public String getPeriodoAcademico() { return periodoAcademico; }
    public void setPeriodoAcademico(String periodoAcademico) { this.periodoAcademico = periodoAcademico; }

    public Integer getCapacidadMaxima() { return capacidadMaxima; }
    public void setCapacidadMaxima(Integer capacidadMaxima) { this.capacidadMaxima = capacidadMaxima; }

    public Boolean getEstado() { return estado; }
    public void setEstado(Boolean estado) { this.estado = estado; }
}

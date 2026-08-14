package pe.idat.dto;

public class MatriculaRequest {
    private Long idAlumno;
    private Long idSeccion;
    private Boolean estado;

    public Long getIdAlumno() { return idAlumno; }
    public void setIdAlumno(Long idAlumno) { this.idAlumno = idAlumno; }

    public Long getIdSeccion() { return idSeccion; }
    public void setIdSeccion(Long idSeccion) { this.idSeccion = idSeccion; }

    public Boolean getEstado() { return estado; }
    public void setEstado(Boolean estado) { this.estado = estado; }
}

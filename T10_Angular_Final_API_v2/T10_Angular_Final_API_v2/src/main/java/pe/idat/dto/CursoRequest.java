package pe.idat.dto;

public class CursoRequest {
    private String nombre;
    private String descripcion;
    private Long idSeccion;
    private Boolean estado;

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Long getIdSeccion() { return idSeccion; }
    public void setIdSeccion(Long idSeccion) { this.idSeccion = idSeccion; }

    public Boolean getEstado() { return estado; }
    public void setEstado(Boolean estado) { this.estado = estado; }
}

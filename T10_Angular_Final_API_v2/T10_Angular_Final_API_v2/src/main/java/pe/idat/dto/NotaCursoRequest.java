package pe.idat.dto;

import java.math.BigDecimal;

public class NotaCursoRequest {
    private Long idCurso;
    private Long idAlumno;
    private String nombreEvaluacion;
    private BigDecimal calificacion;
    private BigDecimal ponderacion;

    public Long getIdCurso() { return idCurso; }
    public void setIdCurso(Long idCurso) { this.idCurso = idCurso; }

    public Long getIdAlumno() { return idAlumno; }
    public void setIdAlumno(Long idAlumno) { this.idAlumno = idAlumno; }

    public String getNombreEvaluacion() { return nombreEvaluacion; }
    public void setNombreEvaluacion(String nombreEvaluacion) { this.nombreEvaluacion = nombreEvaluacion; }

    public BigDecimal getCalificacion() { return calificacion; }
    public void setCalificacion(BigDecimal calificacion) { this.calificacion = calificacion; }

    public BigDecimal getPonderacion() { return ponderacion; }
    public void setPonderacion(BigDecimal ponderacion) { this.ponderacion = ponderacion; }
}

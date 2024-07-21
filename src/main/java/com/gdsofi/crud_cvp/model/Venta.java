package com.gdsofi.crud_cvp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import java.time.LocalDate;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@Entity
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long codigo_venta;
    private LocalDate fecha_venta;
    private Double total_venta;

    @ManyToMany
    @JoinTable(
            name = "venta_producto",
            joinColumns = @JoinColumn(name = "codigo_venta"),
            inverseJoinColumns = @JoinColumn(name = "codigo_producto")
    )
    private List<Producto> listaProductos;

    @ManyToOne
    @JoinColumn(name = "idCliente")
    private Cliente unCliente;

    public Venta() {
    }

    public Venta(Long codigo_venta, LocalDate fecha_venta, Double total_venta, List<Producto> listaProductos, Cliente unCliente) {
        this.codigo_venta = codigo_venta;
        this.fecha_venta = fecha_venta;
        this.total_venta = total_venta;
        this.listaProductos = listaProductos;
        this.unCliente = unCliente;
    }

}

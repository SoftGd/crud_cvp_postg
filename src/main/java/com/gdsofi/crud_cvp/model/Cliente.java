package com.gdsofi.crud_cvp.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter 
@Entity
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long idCliente;
    private String nombre;
    private String apellido;
    private String telefono;
    private String dni;

    @OneToMany(mappedBy = "unCliente", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Venta> ventas;

    public Cliente() {
    }

    public Cliente(Long idCliente, String nombre, String apellido, String telefono, String dni, List<Venta> ventas) {
        this.idCliente = idCliente;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.dni = dni;
        this.ventas = ventas;
    }   
}

package com.gdsofi.crud_cvp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@Entity
public class Producto {
    
    @Id
    @GeneratedValue(strategy=GenerationType.SEQUENCE)
    private Long codigo_producto;
    private String nombre;
    private String marca;
    private Double costo;
    public int cantidad_disponibilidad;

    public Producto() {
    }

    public Producto(Long codigo_producto, String nombre, String marca, Double costo, int cantidad_disponibilidad) {
        this.codigo_producto = codigo_producto;
        this.nombre = nombre;
        this.marca = marca;
        this.costo = costo;
        this.cantidad_disponibilidad = cantidad_disponibilidad;
    }   
}
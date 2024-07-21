package com.gdsofi.crud_cvp.controller;


import com.gdsofi.crud_cvp.model.Producto;
import com.gdsofi.crud_cvp.service.IProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.stereotype.Controller;

import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/productos")
public class ProductoController {

    @Autowired
    private IProductoService productServ;

    // Mostrar productos
    @GetMapping
    public String listaProductos(Model model) {
        List<Producto> productos = productServ.getProductos();
        model.addAttribute("productos", productos);
        return "index_productos";
    }

    // Guardar nuevo producto
    @PostMapping("/crear")
    public String saveProducto(@ModelAttribute Producto producto) {
        productServ.saveProducto(producto);
        return "redirect:/productos"; // Redirige a la lista de productos después de crear uno nuevo
    }

    // Editar producto
    @PutMapping("/editar")
    public String editarProducto(@ModelAttribute Producto producto) {
        productServ.editProducto(producto.getCodigo_producto(), producto.getCodigo_producto(), producto.getNombre(), producto.getMarca(), producto.getCosto(), producto.getCantidad_disponibilidad());
        return "index_productos";
    }

    // Eliminar producto
    @PostMapping("/eliminar/{codigo_producto}")
    public String deleteProducto(@PathVariable Long codigo_producto) {
        productServ.deleteProducto(codigo_producto);
        return "redirect:/productos"; // Redirige a la lista de productos después de eliminar uno
    }
}

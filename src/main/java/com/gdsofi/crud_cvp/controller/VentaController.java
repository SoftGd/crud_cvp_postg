package com.gdsofi.crud_cvp.controller;

import com.gdsofi.crud_cvp.model.Cliente;
import com.gdsofi.crud_cvp.model.Producto;
import com.gdsofi.crud_cvp.model.Venta;
import com.gdsofi.crud_cvp.service.IClienteService;
import com.gdsofi.crud_cvp.service.IProductoService;
import com.gdsofi.crud_cvp.service.IVentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;

@Controller
@RequestMapping("/ventas")
public class VentaController {

    @Autowired
    private IVentaService ventaServ;

    @Autowired
    private IClienteService clienteServ;

    @Autowired
    private IProductoService productoServ;

    // Mostrar ventas
    @GetMapping
    public String listaVentas(Model model) {
        List<Venta> ventas = ventaServ.getVentas();

        // Obtener todos los códigos de productos necesarios para todas las ventas
        List<Long> productosIds = ventas.stream()
                .flatMap(venta -> venta.getListaProductos().stream())
                .map(Producto::getCodigo_producto)
                .collect(Collectors.toList());

        // Obtener todos los productos de una vez
        List<Producto> productos = productoServ.getProductosByIds(productosIds);

        // Asignar los productos a cada venta
        ventas.forEach(venta -> {
            List<Producto> productosDeVenta = venta.getListaProductos().stream()
                    .map(producto -> productos.stream()
                    .filter(p -> p.getCodigo_producto().equals(producto.getCodigo_producto()))
                    .findFirst()
                    .orElse(null))
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
            venta.setListaProductos(productosDeVenta);

            // Asegurarse de que cada venta tenga un cliente asociado
            if (venta.getUnCliente() == null) {
                venta.setUnCliente(new Cliente());
            }
        });

        List<Cliente> clientes = clienteServ.getClientes();

        model.addAttribute("ventas", ventas);
        model.addAttribute("productos", productos);
        model.addAttribute("clientes", clientes);

        return "index_ventas";
    }

    @PostMapping("/crear")
    public String saveVenta(@ModelAttribute Venta venta,
            @RequestParam List<Long> codigo_productos,
            @RequestParam(name = "idCliente", required = false) Long idCliente,
            @RequestParam List<Integer> cantidad_disponibilidad) { // Lista de cantidades seleccionadas por el cliente
        // Obtener productos seleccionados por sus códigos
        List<Producto> productosSeleccionados = productoServ.getProductosByIds(codigo_productos);
        venta.setListaProductos(productosSeleccionados);

        // Si se ha seleccionado un cliente existente, establecerlo en la venta
        if (idCliente != null) {
            Cliente cliente = clienteServ.findClienteId(idCliente);
            venta.setUnCliente(cliente);
        } else {
            // Si se está creando un nuevo cliente, asegúrate de guardarlo primero y luego asignarlo a la venta
            if (venta.getUnCliente() != null && venta.getUnCliente().getIdCliente() == null) {
                clienteServ.saveCliente(venta.getUnCliente());
            }
        }

        // Guardar la venta
        ventaServ.saveVenta(venta);

        // Actualizar el stock de productos vendidos
        for (int i = 0; i < productosSeleccionados.size(); i++) {
            Producto producto = productosSeleccionados.get(i);
            int cantidadVendida = cantidad_disponibilidad.get(i); // Obtener la cantidad vendida para este producto

            // Actualizar la cantidad disponible del producto
            productoServ.actualizarCantidadDisponible(producto.getCodigo_producto(), producto.getCantidad_disponibilidad() - cantidadVendida);
        }

        return "redirect:/ventas";
    }

    // Endpoint para guardar un nuevo cliente
    @PostMapping("/clientes/crear")
    @ResponseBody
    public ResponseEntity<Cliente> saveCliente(@RequestBody Cliente cliente) {
        try {
            // Aquí puedes realizar validaciones adicionales si es necesario
            Cliente savedCliente = clienteServ.saveAndReturnCliente(cliente);
            return ResponseEntity.ok(savedCliente);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Endpoint para eliminar una venta por código de venta
    @PostMapping("/eliminar/{codigo_venta}")
    public String deleteVenta(@PathVariable("codigo_venta") Long codigoVenta) {
        ventaServ.deleteVenta(codigoVenta);
        return "redirect:/ventas";
    }

    // Endpoint para obtener productos por ID de venta
    @GetMapping("/{id}/productos")
    @ResponseBody
    public ResponseEntity<List<Producto>> getProductosByVentaId(@PathVariable Long id) {
        try {
            List<Producto> productos = ventaServ.getProductosByVenta(id);
            if (productos.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(productos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Endpoint para obtener ventas por ID de cliente
    @GetMapping("/cliente/{id_cliente}")
    @ResponseBody
    public ResponseEntity<List<Venta>> getVentasByClienteId(@PathVariable("id_cliente") Long id_cliente) {
        List<Venta> ventas = ventaServ.getVentasByClienteId(id_cliente);
        return ResponseEntity.ok(ventas);
    }

    @GetMapping("/productos-disponibles")
    public ResponseEntity<List<Producto>> getProductosDisponibles() {
        List<Producto> productos = productoServ.getProductos();
        return ResponseEntity.ok().body(productos);
    }

    @PutMapping("/editar")
    public ResponseEntity<Venta> editarVenta(@RequestBody Venta venta, @RequestParam Long idCliente) {
        try {
            Cliente cliente = clienteServ.findClienteId(idCliente);
            venta.setUnCliente(cliente);
            Venta ventaEditada = ventaServ.editVenta(venta);
            return ResponseEntity.ok(ventaEditada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

}

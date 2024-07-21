package com.gdsofi.crud_cvp.controller;

import com.gdsofi.crud_cvp.model.Cliente;
import com.gdsofi.crud_cvp.model.Venta;
import com.gdsofi.crud_cvp.service.IClienteService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/clientes")
public class ClienteController {

    @Autowired
    private IClienteService clientServ;

    // Mostrar clientes
    @GetMapping
    public String listaClientes(Model model) {
        List<Cliente> clientes = clientServ.getClientes();
        model.addAttribute("clientes", clientes);
        return "index_clientes";
    }

    // Guardar nuevo cliente
    @PostMapping("/crear")
    public String saveCliente(@ModelAttribute Cliente cliente) {
        clientServ.saveCliente(cliente);
        return "redirect:/clientes"; 
    }

    /// Editar cliente 
    @PutMapping("/editar")
    public String editarCliente(@ModelAttribute Cliente cliente) {
        clientServ.editCliente(cliente.getIdCliente(), cliente.getIdCliente(), cliente.getNombre(), cliente.getApellido(), cliente.getTelefono(), cliente.getDni());
        return "index_clientes";

    }

    // Eliminar cliente
    @PostMapping("/eliminar/{id_cliente}")
    public String deleteCliente(@PathVariable Long id_cliente) {
        clientServ.deleteCliente(id_cliente);
        return "redirect:/clientes"; 
    }

    // Mostrar todas las ventas de un cliente. 
    @GetMapping("/{idCliente}/ventas")
    public ResponseEntity<List<Venta>> getVentasByCliente(@PathVariable Long idCliente) {
        List<Venta> ventas = clientServ.getVentasByCliente(idCliente);
        return ResponseEntity.ok(ventas);
    }

}

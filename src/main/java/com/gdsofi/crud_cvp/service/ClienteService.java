package com.gdsofi.crud_cvp.service;

import com.gdsofi.crud_cvp.model.Cliente;
import com.gdsofi.crud_cvp.model.Venta;
import com.gdsofi.crud_cvp.repository.IClienteRepository;
import com.gdsofi.crud_cvp.repository.IVentaRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClienteService implements IClienteService {

    @Autowired
    private IClienteRepository clienteRepo;
    
    @Autowired
    private IVentaRepository ventaRepo;
    // Lista de todos los clientes
    @Override
    public List<Cliente> getClientes() {
        return clienteRepo.findAll();
    }

    // Crear Cliente
    @Override
    public void saveCliente(Cliente client) {
        clienteRepo.save(client);
    }

    // Eliminar cliente
    @Override
    public void deleteCliente(Long id_cliente) {
        clienteRepo.deleteById(id_cliente);
    }

    // Encontrar un cliente por ID
    @Override
    public Cliente findClienteId(Long id_cliente) {
        return clienteRepo.findById(id_cliente).orElse(null);
    }

    // Editar cliente
    @Override
    public void editCliente(Long idOriginal, Long idNuevo, String nuevoNombre, String nuevoApellido, String nuevoTelefono, String nuevoDni) {
        Cliente cliente = findClienteId(idOriginal);
        if (cliente != null) {
            cliente.setIdCliente(idNuevo);
            cliente.setNombre(nuevoNombre);
            cliente.setApellido(nuevoApellido);
            cliente.setTelefono(nuevoTelefono);
            cliente.setDni(nuevoDni);
            saveCliente(cliente);
        }
    }
    // retornar un objeto
    @Override
    public Cliente saveAndReturnCliente(Cliente cliente) {
        return clienteRepo.save(cliente);
    }
    //  encontrar un cliente por id
    @Override
    public Cliente findClienteById(Long id_cliente) {
        return clienteRepo.findById(id_cliente).orElse(null);
    }
    // Traer lista de ventas por id de cliente
    @Override
    public List<Venta> getVentasByCliente(Long id_cliente) {
        Cliente cliente = findClienteById(id_cliente);
        if (cliente != null) {
            List<Venta> todasLasVentas = ventaRepo.findAll();
            return todasLasVentas.stream()
                                  .filter(venta -> venta.getUnCliente().getIdCliente().equals(id_cliente))
                                  .collect(Collectors.toList());
        }
        return new ArrayList<>(); // Retorna una lista vacía si el cliente no existe
    }  
}

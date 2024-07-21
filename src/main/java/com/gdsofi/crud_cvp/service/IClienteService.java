package com.gdsofi.crud_cvp.service;

import com.gdsofi.crud_cvp.model.Cliente;
import com.gdsofi.crud_cvp.model.Venta;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public interface IClienteService  {
    
    // método para traer a todas los clientes
    //Lectura
    public List<Cliente> getClientes();

    //alta
    public void saveCliente(Cliente client);
    
    // retorna un objeto
    public Cliente saveAndReturnCliente(Cliente cliente);

    //baja
    public void deleteCliente(Long id_cliente);

    // lectura de un solo objeto
    public Cliente findClienteId(Long id_cliente);
    
    // editar 
    public void editCliente(Long idOriginal, Long idNuevo, String nuevoNombre, String nuevoApellido, String nuevoTelefono, String nuevoDni);
    
    // Buscar cliente por id
    Cliente findClienteById(Long id_cliente);
    
    // Lista de ventas del clientes 
    public List<Venta> getVentasByCliente(Long id_cliente);    
}
  


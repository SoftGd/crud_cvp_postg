package com.gdsofi.crud_cvp.service;

import com.gdsofi.crud_cvp.model.Producto;
import com.gdsofi.crud_cvp.model.Venta;
import com.gdsofi.crud_cvp.repository.IVentaRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VentaService implements IVentaService {

    @Autowired
    private IVentaRepository ventaRepo;


    @Override
    public List<Venta> getVentas() {
        return ventaRepo.findAll();
    }

    @Override
    public void saveVenta(Venta vent) {
        ventaRepo.save(vent);
    }

    @Override
    public void deleteVenta(Long codigo_venta) {
        ventaRepo.deleteById(codigo_venta);
    }

    @Override
    public Venta findVenta(Long codigo_venta) {
        return ventaRepo.findById(codigo_venta).orElse(null);
    }

    @Override
    public Venta editVenta(Venta venta) {
        // Buscar la venta existente
        Venta ventaExistente = this.findVenta(venta.getCodigo_venta());
        if (ventaExistente == null) {
            throw new RuntimeException("Venta no encontrada");
        }

        // Actualizar los campos
        ventaExistente.setFecha_venta(venta.getFecha_venta());
        ventaExistente.setTotal_venta(venta.getTotal_venta());
        ventaExistente.setListaProductos(venta.getListaProductos());
        ventaExistente.setUnCliente(venta.getUnCliente());

        // Guardar y retornar la venta actualizada
        return ventaRepo.save(ventaExistente);
    }

    @Override
    public List<Producto> getProductosByVenta(Long codigoVenta) {
        Venta venta = ventaRepo.findById(codigoVenta).orElse(null);
        if (venta == null) {
            return new ArrayList<>(); // Retorna una lista vacía en lugar de null
        }
        return venta.getListaProductos();
    }
    // Todas las ventas de un cliente

    @Override
    public List<Venta> getVentasByClienteId(Long idCliente) {
        return ventaRepo.findByUnCliente_IdCliente(idCliente);
    }
    
    
    
}


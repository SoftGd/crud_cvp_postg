package com.gdsofi.crud_cvp.service;
import com.gdsofi.crud_cvp.model.Producto;
import com.gdsofi.crud_cvp.model.Venta;
import java.util.List;
import org.springframework.stereotype.Service;


@Service
public interface IVentaService {
    
    // método para traer a todos las ventas
    //Lectura
    public List<Venta> getVentas();
    
    //alta
    public void saveVenta(Venta vent);
    
    //baja
    public void deleteVenta(Long codigo_venta);
    
    // lectura de un solo objeto
    public Venta findVenta(Long codigo_venta);
    
    // editar 
    public Venta editVenta(Venta venta);
    
    List<Producto> getProductosByVenta(Long codigo_venta);
    
    public List<Venta> getVentasByClienteId(Long idCliente);
    
}
    

    
    



package com.gdsofi.crud_cvp.service;

import com.gdsofi.crud_cvp.model.Producto;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public interface IProductoService {
    
    // método para traer a todos los Productos
    //Lectura
    public List<Producto> getProductos();

    //alta
    public void saveProducto(Producto product);

    //baja
    public void deleteProducto(Long codigo_producto);

    // lectura de un solo objeto
    public Producto findProducto(Long codigo_producto);

    // editar 
    public void editProducto(Long codigo_producto, Long codigoNuevo, String nuevoNombre, String nuevaMarca, Double nuevoCosto, int nuevaCantidad_disponibilidad);
    
    //Traer prodictos por id
    public List<Producto> getProductosByIds(List<Long> ids);
    
    public int getCantidadDisponibilidad(Long codigo_producto);
    
    void actualizarCantidadDisponible(Long codigoProducto, int nuevaCantidad);
    
    public int getStock(Long codigo_producto);
    
    
    
    
    

}

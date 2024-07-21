package com.gdsofi.crud_cvp.service;


import com.gdsofi.crud_cvp.model.Producto;
import com.gdsofi.crud_cvp.repository.IProductoRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductoService implements IProductoService {
    
    @Autowired
    private IProductoRepository productoRepo;

    // ver lista de los productos
    @Override
    public List<Producto> getProductos() {
        List <Producto> listaProductos = productoRepo.findAll();
        return listaProductos;
    }
    // Crear un producto
    @Override
    public void saveProducto(Producto product) {
        productoRepo.save(product);
    }
    // Eliminar Producto
    @Override
    public void deleteProducto(Long codigo_producto) {
        productoRepo.deleteById(codigo_producto);
    }
    // encontrar UN producto
    @Override
    public Producto findProducto(Long codigo_producto) {
        Producto product = productoRepo.findById(codigo_producto).orElse(null);
        return product;
    }
    // editar un producto
    @Override
    public void editProducto(Long codigo_producto, Long codigoNuevo, String nuevoNombre, String nuevaMarca, Double nuevoCosto, int nuevaCantidad) {
        // busco el objeto original 
         Producto product = this.findProducto(codigo_producto);
         
         // proceso de modificacion a nivel logico
         product.setCodigo_producto(codigoNuevo);
         product.setNombre(nuevoNombre);
         product.setMarca(nuevaMarca);
         product.setCosto(nuevoCosto);
         product.setCantidad_disponibilidad(nuevaCantidad);
         
         // guardar los cambios
         this.saveProducto(product); 
    }
    
    //productos por id
    @Override
    public List<Producto> getProductosByIds(List<Long> ids) {
        return ids.stream()
                  .map(productoRepo::findById)
                  .filter(java.util.Optional::isPresent)
                  .map(java.util.Optional::get)
                  .collect(Collectors.toList());
    }
    
    
    @Override
    public int getCantidadDisponibilidad(Long codigo_producto) {
        return productoRepo.findById(codigo_producto)
                .map(Producto::getCantidad_disponibilidad)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }
    
    @Override
    public void actualizarCantidadDisponible(Long codigoProducto, int nuevaCantidad) {
        Producto producto = productoRepo.findById(codigoProducto)
                                        .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        producto.setCantidad_disponibilidad(nuevaCantidad);
        productoRepo.save(producto);
    }
    
    @Override
    public int getStock(Long codigo_producto) {
        Producto producto = findProducto(codigo_producto);
        if (producto != null) {
            return producto.getCantidad_disponibilidad();
        }
        return 0; // o algún valor por defecto si el producto no existe
    }

    



}

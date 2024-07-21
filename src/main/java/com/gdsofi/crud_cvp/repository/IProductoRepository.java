package com.gdsofi.crud_cvp.repository;

import com.gdsofi.crud_cvp.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IProductoRepository extends JpaRepository <Producto, Long>{
    
}

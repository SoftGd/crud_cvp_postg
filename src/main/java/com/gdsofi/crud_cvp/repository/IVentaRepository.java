package com.gdsofi.crud_cvp.repository;

import com.gdsofi.crud_cvp.model.Venta;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface IVentaRepository extends JpaRepository <Venta, Long>{

    List<Venta> findByUnCliente_IdCliente(Long idCliente);
    
}

package com.gdsofi.crud_cvp.repository;

import com.gdsofi.crud_cvp.model.Cliente;
//import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IClienteRepository extends JpaRepository <Cliente, Long> {

    //public List<Cliente> findByNombreContainingIgnoreCase(String nombreOId);
    
    //public List<Cliente> findByIdClienteOrNombreContainingIgnoreCase(Long idCliente, String nombreOId);
}
function submitNewClienteForm() {
    const nombreCliente = document.getElementById('addNombre').value;
    const apellidoCliente = document.getElementById('addApellido').value;
    const telefonoCliente = document.getElementById('addTelefono').value;
    const dniCliente = document.getElementById('addDNI').value;

    const formData = {
        nombre: nombreCliente,
        apellido: apellidoCliente,
        telefono: telefonoCliente,
        dni: dniCliente
    };

    fetch('/clientes/crear', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al agregar cliente');
        }
        return response.json();
    })
    .then(data => {
        
        console.log('Cliente agregado:', data);

        // Actualizar el campo de cliente seleccionado en el formulario de agregar venta
        const addClienteSelect = document.getElementById('addCliente');

        // Eliminar la opción "Agregar nuevo cliente"
        const optionAgregarNuevo = addClienteSelect.querySelector('option[value="0"]');
        if (optionAgregarNuevo) {
            addClienteSelect.removeChild(optionAgregarNuevo);
        }

        // Crear y agregar la nueva opción para el cliente recién creado
        const newOption = document.createElement('option');
        newOption.value = data.id_cliente; // Asignar el valor del nuevo cliente agregado
        newOption.textContent = `${nombreCliente} ${apellidoCliente}`;
        addClienteSelect.appendChild(newOption); // Agregar el nuevo cliente al select

        // Seleccionar automáticamente el cliente recién agregado
        newOption.selected = true;

        // Cierra el modal de agregar cliente después de éxito
        closeAddModal();
    })
    .catch(error => {
        console.error('Error:', error);
        // Maneja el error adecuadamente, por ejemplo, mostrar un mensaje al usuario
    });
}

// Función para abrir el modal de agregar cliente
function openAddModal() {
    const addModal = document.getElementById('addModal');
    if (addModal) {
        addModal.style.display = 'block';
    }
}


function closeAddModal() {
    const addModal = document.getElementById('addModal');
    if (addModal) {
        addModal.style.display = 'none';
    }
}


// Función para buscar clientes en la tabla
function buscarClientes() {
    // Obtener el valor del campo de búsqueda
    var input = document.getElementById('searchInput');
    var filter = input.value.toUpperCase();

    // Obtener las filas de la tabla de clientes
    var table = document.querySelector('.table-container table');
    var rows = table.getElementsByTagName('tr');

    // Iterar sobre las filas y mostrar u ocultar según el filtro de búsqueda
    for (var i = 0; i < rows.length; i++) {
        var tdNombre = rows[i].getElementsByTagName('td')[1]; // Segundo TD es el de Nombre
        var tdID = rows[i].getElementsByTagName('td')[0]; // Primer TD es el de ID
        if (tdNombre || tdID) {
            var txtValueNombre = tdNombre.textContent || tdNombre.innerText;
            var txtValueID = tdID.textContent || tdID.innerText;
            if (txtValueNombre.toUpperCase().indexOf(filter) > -1 || txtValueID.toUpperCase().indexOf(filter) > -1) {
                rows[i].style.display = '';
            } else {
                rows[i].style.display = 'none';
            }
        }
    }
}

// Función para abrir el modal de editar cliente 
function openEditModal(idCliente, nombre, apellido, telefono, dni) {
    console.log('Abriendo modal para editar cliente con ID:', idCliente);
    
    const editForm = document.querySelector('#editModal form');
    const editId = document.getElementById('editId');
    const editNombre = document.getElementById('editNombre');
    const editApellido = document.getElementById('editApellido');
    const editTelefono = document.getElementById('editTelefono');
    const editDNI = document.getElementById('editDNI');
    const editModal = document.getElementById('editModal');
    
    console.log('Elementos encontrados:', { editForm, editId, editNombre, editApellido, editTelefono, editDNI, editModal });

    if (editForm && editId && editNombre && editApellido && editTelefono && editDNI && editModal) {
        editId.value = idCliente;
        editNombre.value = nombre;
        editApellido.value = apellido;
        editTelefono.value = telefono;
        editDNI.value = dni;
        editModal.style.display = 'block';
        
        console.log('Modal abierto con datos:', { idCliente, nombre, apellido, telefono, dni });
        
        // Agregar evento de submit al formulario
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            
            fetch(editForm.action, {
                method: 'PUT', 
                body: new FormData(editForm)
            })
            .then(response => {
                if (response.ok) {
                    console.log('Cliente editado correctamente');
                    closeEditModal(); 
                    window.location.reload(); 
                } else {
                    console.error('Error en la respuesta del servidor:', response.status);
                }
            })
            .catch(error => {
                console.error('Error al editar cliente:', error);
            });
        });
    } else {
        console.error('No se encontraron todos los elementos necesarios para abrir el modal de editar cliente.');
    }
}

// Función para cerrar el modal de editar cliente
function closeEditModal() {
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.style.display = 'none';
    }
}

// Función para abrir el modal de Ver Compras
function openVerComprasModal(idCliente) {
    
    var modal = document.getElementById("verComprasModal");
    
    
    fetch(`/clientes/${idCliente}/ventas`)
        .then(response => response.json())
        .then(data => {
            // Mostrar las ventas en el modal
            var ventasContainer = document.getElementById("ventasContainer");
            ventasContainer.innerHTML = ''; // Limpiar contenido anterior
            data.forEach(venta => {
                
                var ventaElement = document.createElement('p');
                ventaElement.textContent = `Código Venta: ${venta.codigo_venta}, Fecha Venta: ${venta.fecha_venta}`;
                ventasContainer.appendChild(ventaElement);
            });

            // Mostrar el modal
            modal.style.display = "block";
        })
        .catch(error => console.error('Error al obtener las ventas:', error));
}

// Función para cerrar el modal de Ver Compras
function closeVerComprasModal() {
    var modal = document.getElementById("verComprasModal");
    modal.style.display = "none";
}


// Event listener para mostrar el formulario de nuevo cliente
document.addEventListener('DOMContentLoaded', function() {
    const addClienteSelect = document.getElementById('addCliente');
    const newClienteForm = document.getElementById('newClienteForm');

    if (addClienteSelect) {
        addClienteSelect.addEventListener('change', function() {
            if (this.value === 'new') {
                newClienteForm.style.display = 'block';
            } else {
                newClienteForm.style.display = 'none';
            }
        });
    }

    // Event listener para cerrar modales con el botón de cerrar
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                console.log('Modal cerrado con botón de cerrar');
            }
        });
    });

    // Event listener para enviar el formulario de nuevo cliente
    const addClienteForm = document.getElementById('addClienteForm');
    if (addClienteForm) {
        addClienteForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            submitNewClienteForm(); 
        });
    }

    // Prevenir que los clics dentro del contenido del modal cierren el modal
    const modalContents = document.querySelectorAll('.modal-content');
    modalContents.forEach(content => {
        content.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    });
});


//Funcion para ver compras del cliente
function openVerComprasModal(idCliente) {
    console.log('ID del cliente:', idCliente);
    
    var modal = document.getElementById("verComprasModal");
    var ventasContainer = document.getElementById("ventasContainer");
    var ventasTableBody = document.getElementById("ventasTableBody");
    
    ventasContainer.innerHTML = 'Cargando ventas...';
    modal.style.display = "block";
    
    fetch(`/clientes/${idCliente}/ventas`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las ventas');
            }
            return response.json();
        })
        .then(data => {
            ventasTableBody.innerHTML = '';
            if (data.length === 0) {
                ventasContainer.innerHTML = 'Este cliente no tiene ventas registradas.';
            } else {
                data.forEach(venta => {
                    var row = ventasTableBody.insertRow();
                    row.innerHTML = `
                        <td>${venta.codigo_venta}</td>
                        <td>${new Date(venta.fecha_venta).toLocaleDateString()}</td>
                        <td>$${venta.total_venta.toFixed(2)}</td>
                        <td>
                            <ul>
                                ${venta.listaProductos.map(producto => 
                                    `<li>${producto.nombre} - ${producto.marca}</li>`
                                ).join('')}
                            </ul>
                        </td>
                    `;
                });
                ventasContainer.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            ventasContainer.innerHTML = 'Ocurrió un error al cargar las ventas. Por favor, intente de nuevo.';
        });
}

function closeVerComprasModal() {
    var modal = document.getElementById("verComprasModal");
    modal.style.display = "none";
}
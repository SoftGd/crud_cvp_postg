
// Función para abrir el modal de agregar venta
function openAddModal() {
    const addModal = document.getElementById('addModal');
    if (addModal) {
        addModal.style.display = 'block';
    }
}

// Función para cerrar el modal de agregar venta
function closeAddModal() {
    const addModal = document.getElementById('addModal');
    if (addModal) {
        addModal.style.display = 'none';
    }
}

// Función para enviar el formulario de nuevo cliente al backend
function submitNewClienteForm() {
    const nombreCliente = document.getElementById('addNombre').value;
    const apellidoCliente = document.getElementById('addApellido').value;
    const dniCliente = document.getElementById('addDNI').value;
    const telefonoCliente = document.getElementById('addTelefono').value;

    if (!nombreCliente || !apellidoCliente || !dniCliente) {
        alert('Por favor, complete todos los campos del cliente.');
        return;
    }

    const formData = {
        nombre: nombreCliente,
        apellido: apellidoCliente,
        dni: dniCliente,
        telefono: telefonoCliente  
    };

    fetch('/ventas/clientes/crear', {
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
        const addClienteSelect = document.getElementById('addCliente');
        const newOption = document.createElement('option');
        newOption.value = data.idCliente;
        newOption.textContent = `${nombreCliente} ${apellidoCliente}`;
        addClienteSelect.appendChild(newOption);
        addClienteSelect.value = data.idCliente;
        document.getElementById('newClienteForm').style.display = 'none';
        
    })
    .catch(error => {
        console.error('Error al agregar cliente:', error);
    });
}


// Función para cambiar la visibilidad del formulario de nuevo cliente
function toggleNewClienteForm() {
    const addClienteSelect = document.getElementById('addCliente');
    const newClienteForm = document.getElementById('newClienteForm');

    if (addClienteSelect && newClienteForm) {
        if (addClienteSelect.value === 'new') {
            newClienteForm.style.display = 'block';
        } else {
            newClienteForm.style.display = 'none';
        }
    }
}



// Event listener para mostrar el formulario de nuevo cliente al cargar el DOM
document.addEventListener('DOMContentLoaded', function() {
    const addClienteSelect = document.getElementById('addCliente');
    if (addClienteSelect) {
        addClienteSelect.addEventListener('change', toggleNewClienteForm);
    }

    // Event listener para cerrar modales con el botón de cerrar
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    }); 

    // Prevenir que los clics dentro del contenido del modal cierren el modal
    const modalContents = document.querySelectorAll('.modal-content');
    modalContents.forEach(content => {
        content.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    });
});


// Event listener para mostrar el formulario de nuevo cliente al cargar el DOM
document.addEventListener('DOMContentLoaded', function() {
    // Event listener para cerrar modales con el botón de cerrar
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
});


// PRODUCTOS 
// Función para cargar y mostrar los productos disponibles
function cargarProductosDisponibles() {
    const selectProductos = document.getElementById('addProductosDisponibles');
    const url = selectProductos.getAttribute('data-url');

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar productos');
            }
            return response.json();
        })
        .then(data => {
            selectProductos.innerHTML = ''; // Limpiar opciones existentes
            data.forEach(producto => {
                const option = document.createElement('option');
                option.value = producto.codigo_producto;
                option.textContent = `${producto.nombre} - ${producto.marca} - Cantidad: ${producto.cantidad_disponibilidad} - Costo: $${producto.costo}`;
                option.setAttribute('data-cantidad', producto.cantidad_disponibilidad);
                selectProductos.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar productos:', error));
}

// Llamar a la función para cargar productos al cargar la página
document.addEventListener('DOMContentLoaded', cargarProductosDisponibles);

function agregarProducto() {
    const selectProductos = document.getElementById('addProductosDisponibles');
    const productosSeleccionados = document.getElementById('productosSeleccionados');

    const selectedOption = selectProductos.options[selectProductos.selectedIndex];

    if (selectedOption) {
        // Verificar si el producto ya está seleccionado para evitar duplicados
        const existingProduct = Array.from(productosSeleccionados.children).find(li => li.dataset.codigoProducto === selectedOption.value);

        if (!existingProduct) {
            const li = document.createElement('li');
            li.textContent = selectedOption.textContent;
            li.dataset.codigoProducto = selectedOption.value;

            // Input para la cantidad
            const cantidadInput = document.createElement('input');
            cantidadInput.type = 'number';
            cantidadInput.name = 'cantidades[]'; // Ajustar el nombre del input para que sea parte de un array
            cantidadInput.placeholder = 'Cantidad';
            cantidadInput.min = 1;
            cantidadInput.value = 1; // Valor inicial de cantidad
            cantidadInput.addEventListener('input', function() {
                calcularCostoTotal(); // Calcular costo total al cambiar la cantidad
            });
            li.appendChild(cantidadInput);

            // Botón para eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.type = 'button';
            btnEliminar.onclick = function() {
                productosSeleccionados.removeChild(li);
                calcularCostoTotal(); // Recalcular costo total al eliminar un producto
            };
            li.appendChild(btnEliminar);

            productosSeleccionados.appendChild(li);

            // Limpiar la selección de productos disponibles después de agregar uno
            selectProductos.selectedIndex = -1;

            calcularCostoTotal(); // Calcular costo total al agregar un producto
        }
    }
}


function calcularCostoTotal() {
    const productosSeleccionados = document.querySelectorAll('#productosSeleccionados li');
    let total = 0;

    productosSeleccionados.forEach(producto => {
        const costoProducto = parseFloat(producto.textContent.match(/Costo: \$([\d.]+)/)[1]);
        const cantidad = parseFloat(producto.querySelector('input[type=number]').value);
        total += costoProducto * cantidad;
    });

    document.getElementById('totalVenta').value = total.toFixed(2); // Mostrar el total con dos decimales
}

function submitVentaForm() {
    const form = document.getElementById('ventaForm');
    const formData = new FormData(form);

    // Agregar los códigos de productos seleccionados y cantidades al FormData
    const productosSeleccionados = document.querySelectorAll('#productosSeleccionados li');
    productosSeleccionados.forEach(producto => {
        const codigoProducto = producto.dataset.codigoProducto;
        const cantidad = producto.querySelector('input[name="cantidades[]"]').value; // Obtener la cantidad del input

        formData.append('codigo_productos[]', codigoProducto);
        formData.append('cantidad_disponibilidad[]', cantidad);
    });

    fetch(form.action, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            console.log('Venta agregada correctamente');
            closeAddModal();
            window.location.reload(); // Recargar la página para actualizar la lista de ventas
        } else {
            console.error('Error en la respuesta del servidor:', response.status);
        }
    })
    .catch(error => {
        console.error('Error al agregar venta:', error);
    });
}

// EDITAR

// Función para abrir el modal de editar venta
function openEditModal() {
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.style.display = 'block';
    }
}

// Función para cerrar el modal de editar venta
function closeEditModal() {
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.style.display = 'none';
    }
}

// Función para enviar el formulario de nuevo cliente al backend desde el modal de edición
function submitEditNewClienteForm() {
    const nombreCliente = document.getElementById('editNombre').value;
    const apellidoCliente = document.getElementById('editApellido').value;
    const dniCliente = document.getElementById('editDNI').value;
    const telefonoCliente = document.getElementById('editTelefono').value;

    if (!nombreCliente || !apellidoCliente || !dniCliente) {
        alert('Por favor, complete todos los campos del cliente.');
        return;
    }

    const formData = {
        nombre: nombreCliente,
        apellido: apellidoCliente,
        dni: dniCliente,
        telefono: telefonoCliente  
    };

    fetch('/ventas/clientes/crear', {
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
        const editClienteSelect = document.getElementById('editCliente');
        const newOption = document.createElement('option');
        newOption.value = data.idCliente;
        newOption.textContent = `${nombreCliente} ${apellidoCliente}`;
        editClienteSelect.appendChild(newOption);
        editClienteSelect.value = data.idCliente;
        document.getElementById('editNewClienteForm').style.display = 'none';
        
    })
    .catch(error => {
        console.error('Error al agregar cliente:', error);
    });
}

// Función para cambiar la visibilidad del formulario de nuevo cliente en el modal de edición
function toggleEditClienteForm() {
    const editClienteSelect = document.getElementById('editCliente');
    const editNewClienteForm = document.getElementById('editNewClienteForm');

    if (editClienteSelect && editNewClienteForm) {
        if (editClienteSelect.value === 'new') {
            editNewClienteForm.style.display = 'block';
        } else {
            editNewClienteForm.style.display = 'none';
        }
    }
}

// Event listener para mostrar el formulario de nuevo cliente al cargar el DOM
document.addEventListener('DOMContentLoaded', function() {
    const editClienteSelect = document.getElementById('editCliente');
    if (editClienteSelect) {
        editClienteSelect.addEventListener('change', toggleEditClienteForm);
    }

    // Event listener para cerrar modales con el botón de cerrar
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Prevenir que los clics dentro del contenido del modal cierren el modal
    const modalContents = document.querySelectorAll('.modal-content');
    modalContents.forEach(content => {
        content.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    });
});

// PRODUCTOS 
// Función para cargar y mostrar los productos disponibles en el modal de edición
function cargarProductosDisponiblesEdit() {
    const selectProductos = document.getElementById('editProductosDisponibles');
    const url = selectProductos.getAttribute('data-url');

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar productos');
            }
            return response.json();
        })
        .then(data => {
            selectProductos.innerHTML = ''; 
            data.forEach(producto => {
                const option = document.createElement('option');
                option.value = producto.codigo_producto;
                option.textContent = `${producto.nombre} - ${producto.marca} - Cantidad: ${producto.cantidad_disponibilidad} - Costo: $${producto.costo}`;
                option.setAttribute('data-cantidad', producto.cantidad_disponibilidad);
                selectProductos.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar productos:', error));
}

// Llamar a la función para cargar productos al cargar la página
document.addEventListener('DOMContentLoaded', cargarProductosDisponiblesEdit);

function agregarProductoEdit() {
    const selectProductos = document.getElementById('editProductosDisponibles');
    const productosSeleccionados = document.getElementById('editProductosSeleccionados');

    const selectedOption = selectProductos.options[selectProductos.selectedIndex];

    if (selectedOption) {
        // Verificar si el producto ya está seleccionado para evitar duplicados
        const existingProduct = Array.from(productosSeleccionados.children).find(li => li.dataset.codigoProducto === selectedOption.value);

        if (!existingProduct) {
            const li = document.createElement('li');
            li.textContent = selectedOption.textContent;
            li.dataset.codigoProducto = selectedOption.value;

            // Input para la cantidad
            const cantidadInput = document.createElement('input');
            cantidadInput.type = 'number';
            cantidadInput.name = 'cantidades[]'; 
            cantidadInput.placeholder = 'Cantidad';
            cantidadInput.min = 1;
            cantidadInput.value = 1; // Valor inicial de cantidad
            cantidadInput.addEventListener('input', function() {
                calcularCostoTotalEdit(); 
            });
            li.appendChild(cantidadInput);

            // Botón para eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.type = 'button';
            btnEliminar.onclick = function() {
                productosSeleccionados.removeChild(li);
                calcularCostoTotalEdit(); // Recalcular costo total al eliminar un producto
            };
            li.appendChild(btnEliminar);

            productosSeleccionados.appendChild(li);

            // Limpiar la selección de productos disponibles después de agregar uno
            selectProductos.selectedIndex = -1;

            calcularCostoTotalEdit(); // Calcular costo total al agregar un producto
        }
    }
}

function calcularCostoTotalEdit() {
    const productosSeleccionados = document.querySelectorAll('#editProductosSeleccionados li');
    let total = 0;

    productosSeleccionados.forEach(producto => {
        const costoProducto = parseFloat(producto.textContent.match(/Costo: \$([\d.]+)/)[1]);
        const cantidad = parseFloat(producto.querySelector('input[type=number]').value);
        total += costoProducto * cantidad;
    });

    document.getElementById('editTotalVenta').value = total.toFixed(2); 
}

function openEditModal(codigoVenta, fechaVenta, clienteId, listaProductos) {
    const editForm = document.querySelector('#editModal form');
    const editFechaVenta = document.getElementById('editFecha');
    const editClienteId = document.getElementById('editCliente');
    const editNombre = document.getElementById('editNombre'); 
    const editApellido = document.getElementById('editApellido'); 
    const editProductosSeleccionados = document.getElementById('editProductosSeleccionados');
    const editModal = document.getElementById('editModal');

    if (editForm && editFechaVenta && editClienteId && editNombre && editApellido && editProductosSeleccionados && editModal) {
        editForm.dataset.codigoVenta = codigoVenta;
        editFechaVenta.value = fechaVenta;
        
        // Asignar el cliente seleccionado al campo de cliente en el formulario
        if (clienteId) {
            editClienteId.value = clienteId.toString(); // Asegúrate de asignar un string si es necesario
        } else {
            editClienteId.value = ''; // Limpiar el campo si no hay cliente seleccionado
        }

        editProductosSeleccionados.innerHTML = '';
        
        if (listaProductos && Array.isArray(listaProductos)) {
            listaProductos.forEach(producto => {
                const li = document.createElement('li');
                li.textContent = `${producto.nombre} - ${producto.marca} - Costo: $${producto.costo}`;
                li.dataset.codigoProducto = producto.codigo_producto;

                const cantidadInput = document.createElement('input');
                cantidadInput.type = 'number';
                cantidadInput.name = 'cantidades[]';
                cantidadInput.value = producto.cantidad;
                cantidadInput.min = 1;
                cantidadInput.addEventListener('input', calcularCostoTotalEdit);
                li.appendChild(cantidadInput);

                const btnEliminar = document.createElement('button');
                btnEliminar.textContent = 'Eliminar';
                btnEliminar.type = 'button';
                btnEliminar.onclick = function() {
                    editProductosSeleccionados.removeChild(li);
                    calcularCostoTotalEdit();
                };
                li.appendChild(btnEliminar);

                editProductosSeleccionados.appendChild(li);
            });
            calcularCostoTotalEdit();
        } else {
            console.log('No hay lista de productos disponible para esta venta');
        }

        editModal.style.display = 'block';

        
        toggleEditClienteForm();

        // Agregar evento de submit al formulario
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitEditVentaForm(); 
        });
    } else {
        console.error('No se encontraron todos los elementos necesarios para abrir el modal de editar venta.');
    }
}

// Función para mostrar u ocultar el formulario para un nuevo cliente en el modal de edición
function toggleEditClienteForm() {
    const editClienteId = document.getElementById('editCliente');
    const editNewClienteForm = document.getElementById('editNewClienteForm');

    if (editClienteId.value === 'new') {
        editNewClienteForm.style.display = 'block';
    } else {
        editNewClienteForm.style.display = 'none';
    }
}

function submitEditVentaForm() {
    const editForm = document.getElementById('editVentaForm');
    if (!editForm) {
        console.error('No se encontró el formulario de edición');
        return;
    }

    const formData = new FormData(editForm);
    const idCliente = formData.get('idCliente');

    const ventaData = {
        codigo_venta: editForm.dataset.codigoVenta,
        fecha_venta: formData.get('fecha_venta'),
        listaProductos: [],
        total_venta: formData.get('total_venta')
    };

    // Obtener productos seleccionados
    const productosSeleccionados = document.querySelectorAll('#editProductosSeleccionados li');
    productosSeleccionados.forEach(producto => {
        ventaData.listaProductos.push({
            codigo_producto: producto.dataset.codigoProducto,
            cantidad: producto.querySelector('input[type="number"]').value
        });
    });

    console.log(ventaData); // Verifica en la consola qué datos se están enviando

    
    const url = `${editForm.action}?idCliente=${idCliente}`;

    // Realizar la solicitud PUT para editar la venta
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ventaData)
    })
    .then(response => {
        if (response.ok) {
            console.log('Venta editada correctamente');
            closeEditModal(); 
            window.location.reload(); 
        } else {
            console.error('Error en la respuesta del servidor:', response.status);
            return response.text();
        }
    })
    .then(errorText => {
        if (errorText) console.error('Detalle del error:', errorText);
    })
    .catch(error => {
        console.error('Error al editar venta:', error);
    });
}

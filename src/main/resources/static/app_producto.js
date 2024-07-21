// Función para abrir el modal de agregar producto
function openAddModal() {
    const addModal = document.getElementById('addModal');
    if (addModal) {
        addModal.style.display = 'block';
    }
}

// Función para cerrar el modal de agregar producto
function closeAddModal() {
    const addModal = document.getElementById('addModal');
    if (addModal) {
        addModal.style.display = 'none';
    }
}
// Función para enviar el formulario de nuevo producto al backend
function submitNewProductoForm() {
    const nombreProducto = document.getElementById('addNombre').value;
    const marcaProducto = document.getElementById('addMarca').value;
    const costoProducto = document.getElementById('addCosto').value;
    const cantidadProducto = document.getElementById('addCantidad').value;

    const formData = {
        nombre: nombreProducto,
        marca: marcaProducto,
        costo: costoProducto,
        cantidad_disponibilidad: cantidadProducto
    };

    fetch('/productos/crear', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al agregar producto');
        }
        return response.json();
    })
    .then(data => {
        console.log('Producto agregado:', data);
        // Actualizar el campo de producto seleccionado en el formulario de agregar venta
        const addProductoSelect = document.getElementById('addProducto');
        const newOption = document.createElement('option');
        newOption.value = data.codigo_producto; // Asignar el valor del nuevo producto agregado
        newOption.textContent = `${nombreProducto} - ${marcaProducto}`;
        addProductoSelect.appendChild(newOption); // Agregar el nuevo producto al select

        // Asignar el producto recién agregado al formulario de venta
        document.getElementById('ventaProducto').value = data.codigo_producto;

        closeAddModal(); 
    })
    .catch(error => {
        console.error('Error al agregar producto:', error);
        
    });
}


// Función para buscar productos en la tabla
function buscarProductos() {
    var input = document.getElementById('searchInput');
    var filter = input.value.toUpperCase();
    var table = document.querySelector('.table-container table');
    var rows = table.getElementsByTagName('tr');

    for (var i = 0; i < rows.length; i++) {
        var tdNombre = rows[i].getElementsByTagName('td')[1]; // Segundo TD es el de Nombre
        var tdMarca = rows[i].getElementsByTagName('td')[2]; // Tercer TD es el de Marca
        var tdCodigo = rows[i].getElementsByTagName('td')[0]; // Primer TD es el de Código
        if (tdNombre || tdMarca || tdCodigo) {
            var txtValueNombre = tdNombre.textContent || tdNombre.innerText;
            var txtValueMarca = tdMarca.textContent || tdMarca.innerText;
            var txtValueCodigo = tdCodigo.textContent || tdCodigo.innerText;
            if (txtValueNombre.toUpperCase().indexOf(filter) > -1 || txtValueMarca.toUpperCase().indexOf(filter) > -1 ||
                txtValueCodigo.toUpperCase().indexOf(filter) > -1) {
                rows[i].style.display = '';
            } else {
                rows[i].style.display = 'none';
            }
        }
    }
}

// Función para abrir el modal de editar producto con datos específicos
function openEditModal(codigo, nombre, marca, costo, cantidad) {
    console.log('Abriendo modal para editar producto con Código:', codigo);

    const editForm = document.querySelector('#editModal form');
    const editCodigo = document.getElementById('editCodigo');
    const editNombre = document.getElementById('editNombre');
    const editMarca = document.getElementById('editMarca');
    const editCosto = document.getElementById('editCosto');
    const editCantidad = document.getElementById('editCantidad');
    const editModal = document.getElementById('editModal');

    if (editForm && editCodigo && editNombre && editMarca && editCosto && editCantidad && editModal) {
        editCodigo.value = codigo;
        editNombre.value = nombre;
        editMarca.value = marca;
        editCosto.value = costo;
        editCantidad.value = cantidad;
        editModal.style.display = 'block';

        // Agregar evento de submit al formulario
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();

            fetch(editForm.action, {
                method: 'PUT',
                body: new FormData(editForm)
            })
            .then(response => {
                if (response.ok) {
                    console.log('Producto editado correctamente');
                    closeEditModal(); 
                    window.location.reload(); 
                } else {
                    console.error('Error en la respuesta del servidor:', response.status);
                }
            })
            .catch(error => {
                console.error('Error al editar producto:', error);
            });
        });
    } else {
        console.error('No se encontraron todos los elementos necesarios para abrir el modal de editar producto.');
    }
}

// Función para cerrar el modal de editar producto
function closeEditModal() {
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.style.display = 'none';
    }
}


// Event listener para mostrar el formulario de nuevo producto
document.addEventListener('DOMContentLoaded', function() {
    const addProductoSelect = document.getElementById('addProducto');
    const newProductoForm = document.getElementById('newProductoForm');

    if (addProductoSelect) {
        addProductoSelect.addEventListener('change', function() {
            if (this.value === 'new') {
                newProductoForm.style.display = 'block';
            } else {
                newProductoForm.style.display = 'none';
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
            }
        });
    });

    // Event listener para enviar el formulario de nuevo producto
    const addProductoForm = document.getElementById('addProductoForm');
    if (addProductoForm) {
        addProductoForm.addEventListener('submit', function(event) {
            event.preventDefault();
            submitNewProductoForm();
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

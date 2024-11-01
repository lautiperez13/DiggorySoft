document.addEventListener('DOMContentLoaded', function() {
    const clientList = document.getElementById('client-list');
    const addClientBtn = document.getElementById('add-client-btn');
    const clientForm = document.getElementById('client-form');
    const newClientForm = document.getElementById('new-client-form');

    let editingRow = null;  // Variable para mantener la fila que estamos editando
    let editingClientId = null;  // ID del cliente que se está editando

    

    // Función para cargar clientes desde la base de datos
    function loadClients() {
        fetch('http://localhost:3000/clientes')  // Cambia la URL según tu configuración
            .then(response => response.json())
            .then(data => {
                clientList.innerHTML = '';  // Limpiar la tabla antes de añadir nuevos clientes
                data.forEach(cliente => {
                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `
                        <td>${cliente.nombre}</td>
                        <td>${cliente.direccion}</td>
                        <td>${cliente.telefono}</td>
                        <td>${cliente.barrio}</td>
                        <td>${cliente.ciudad}</td>
                        <td><button class="edit-btn" data-id="${cliente.idCliente}">✏️</button></td>
                    `;
                    clientList.appendChild(newRow);
                });
            })
            .catch(error => console.error('Error al obtener los clientes:', error));
    }

    // Cargar la lista de clientes al cargar la página
    loadClients();

    // Muestra/oculta el formulario de añadir cliente
    addClientBtn.addEventListener('click', function() {
        clientForm.style.display = clientForm.style.display === 'block' ? 'none' : 'block';
        newClientForm.reset();
        editingRow = null;
        editingClientId = null;
    });

    // Enviar formulario y manejar inserción o actualización
    newClientForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const address = document.getElementById('address').value;
        const phone = document.getElementById('phone').value;
        const hood = document.getElementById('hood').value;
        const city = document.getElementById('city').value;

        const clientData = {
            nombre: name,
            direccion: address,
            telefono: phone,
            idBarrio: hood,
            ciudad: city
        };

        if (editingClientId) {
            // Editar cliente existente (PUT)
            fetch(`/clientes/${editingClientId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(clientData)
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message || 'Cliente actualizado exitosamente');
                loadClients();
                clientForm.style.display = 'none';
            })
            .catch(error => {
                console.error('Error al editar cliente:', error);
                alert('Ocurrió un error al editar el cliente.');
            });
        } else {
            // Agregar nuevo cliente (POST)
            fetch('/clientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(clientData)
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message || 'Cliente agregado exitosamente');
                loadClients();
                newClientForm.reset();
                clientForm.style.display = 'none';
            })
            .catch(error => {
                console.error('Error al agregar cliente:', error);
                alert('Ocurrió un error al agregar el cliente.');
            });
        }
    });

    

    // Editar un cliente existente en la tabla
    clientList.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('edit-btn')) {
            editingRow = event.target.closest('tr');
            editingClientId = event.target.dataset.id;  // Obtener el ID del cliente

            const cells = editingRow.getElementsByTagName('td');
            document.getElementById('name').value = cells[0].textContent;
            document.getElementById('address').value = cells[1].textContent;
            document.getElementById('phone').value = cells[2].textContent;
            document.getElementById('hood').value = cells[3].textContent;
            document.getElementById('city').value = cells[4].textContent;

            clientForm.style.display = 'block';
        }
    });
});

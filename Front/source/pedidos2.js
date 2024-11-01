// Llamamos a la función para obtener los pedidos
obtenerPedidos();

function eliminarPedido(idPedido) {
    axios.delete('http://localhost:3000/pedidos/' + idPedido)
        .then(respuesta => {
            alert("Pedido Eliminado");
            obtenerPedidos();  // Refresca la lista después de eliminar
        })
        .catch(error => {
            console.error('Error al eliminar pedido:', error);
        });
}

function guardarPedido() {
    let idCliente = parseInt(document.getElementById("idCliente").value, 10);
    let fecha_de_pedido = document.getElementById("fecha_de_pedido").value;
    let estado = document.getElementById("estado").value;
    let idRecorrido = parseInt(document.getElementById("idRecorrido").value, 10);
    let idTipo_de_pedido = parseInt(document.getElementById("idTipo_de_pedido").value, 10);
    let idForma_de_pago = parseInt(document.getElementById("idForma_de_pago").value, 10);

    axios.post('http://localhost:3000/pedidos', {
        idCliente: idCliente,
        fecha_de_pedido: fecha_de_pedido,
        estado: estado,
        idRecorrido: idRecorrido,
        idTipo_de_pedido: idTipo_de_pedido,
        idForma_de_pago: idForma_de_pago
    })
    .then(res => {
        alert('Pedido agregado con éxito');
        obtenerPedidos();
        document.getElementById("pedidoForm").reset();  // Reiniciar formulario
    })
    .catch(error => {
        console.error('Error al agregar pedido:', error);
    });
}

function actualizarPedido() {
    let idPedido = parseInt(document.getElementById("idPedido").value, 10);
    let idCliente = parseInt(document.getElementById("idCliente").value, 10);
    let fecha_de_pedido = document.getElementById("fecha_de_pedido").value;
    let estado = document.getElementById("estado").value;
    let idRecorrido = parseInt(document.getElementById("idRecorrido").value, 10);
    let idTipo_de_pedido = parseInt(document.getElementById("idTipo_de_pedido").value, 10);
    let idForma_de_pago = parseInt(document.getElementById("idForma_de_pago").value, 10);

    axios.put('http://localhost:3000/pedidos/' + idPedido, {
        idCliente: idCliente,
        fecha_de_pedido: fecha_de_pedido,
        estado: estado,
        idRecorrido: idRecorrido,
        idTipo_de_pedido: idTipo_de_pedido,
        idForma_de_pago: idForma_de_pago
    })
    .then(res => {
        alert('Pedido modificado con éxito');
        obtenerPedidos();
    })
    .catch(error => {
        console.error('Error al actualizar pedido:', error);
    });
}

function obtenerPedidos() {
    axios.get('http://localhost:3000/pedidos')
        .then(respuesta => {
            let datos = respuesta.data;
            let table_pedido = document.getElementById("order-list");
            table_pedido.innerHTML = '';  // Limpiar tabla antes de añadir

            datos.forEach(pedido => {
                let fila = document.createElement('tr');

                fila.innerHTML = `
                    <td>${pedido.idPedido}</td>
                    <td>${pedido.fecha_de_pedido}</td>
                    <td>${pedido.estado}</td>
                    <td>${pedido.idCliente}</td>
                    <td>${pedido.idRecorrido}</td>
                    <td>${pedido.idTipo_de_pedido}</td>
                    <td>${pedido.idForma_de_pago}</td>
                    <td>
                        <button onclick="modificarPedido(${pedido.idPedido})">Modificar</button>
                        <button onclick="eliminarPedido(${pedido.idPedido})">Eliminar</button>
                    </td>
                `;

                table_pedido.appendChild(fila);
            });
        })
        .catch(error => {
            console.error('Error al obtener pedidos:', error);
        });
}

function smoothScrollToTop() {
    const scrollStep = -window.scrollY / (500 / 15); // 500ms duración, más tiempo más suave
    const scrollInterval = setInterval(() => {
        if (window.scrollY !== 0) {
            window.scrollBy(0, scrollStep);
        } else {
            clearInterval(scrollInterval);
        }
    }, 15); // Intervalo de 15ms para hacerlo más fluido
}

function toggleFormulario() {
    const formulario = document.getElementById('pedidoForm');
    const boton = document.getElementById('toggleFormButton');
    
    if (formulario.style.display === "none") {
        formulario.style.display = "flex";  // Mostrar formulario
        boton.textContent = "Ocultar Formulario";  // Cambiar texto del botón
    } else {
        formulario.style.display = "none";  // Ocultar formulario
        boton.textContent = "Añadir Pedido";  // Cambiar texto del botón
    }
}

function toggleFormularioModif() {
    const formulario = document.getElementById('pedidoForm');
    const botonModif = document.getElementById('botonModificarForm');
    const boton = document.getElementById('toggleFormButton');

    formulario.style.display = "flex";  // Mostrar formulario
    boton.textContent = "Ocultar Formulario";  // Cambiar texto del botón
}

function modificarPedido(idPedido) {
    axios.get('http://localhost:3000/pedidos/' + idPedido)
        .then(respuesta => {
            let pedido = respuesta.data;
            document.getElementById("idPedido").value = pedido.idPedido;
            document.getElementById("idCliente").value = pedido.idCliente;
            document.getElementById("fecha_de_pedido").value = pedido.fecha_de_pedido;
            document.getElementById("estado").value = pedido.estado;
            document.getElementById("idRecorrido").value = pedido.idRecorrido;
            document.getElementById("idTipo_de_pedido").value = pedido.idTipo_de_pedido;
            document.getElementById("idForma_de_pago").value = pedido.idForma_de_pago;

            document.getElementById("botonGuardarForm").disabled = true;
            document.getElementById("botonModificarForm").disabled = false;

            // Desplazamiento suave hacia la parte superior donde está el formulario
            smoothScrollToTop();
            toggleFormularioModif();
        })
        .catch(error => {
            console.error('Error al obtener pedido:', error);
        });
}

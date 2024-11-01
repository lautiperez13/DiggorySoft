
document.addEventListener('DOMContentLoaded', function() {
    const addOrderBtn = document.getElementById('add-order-btn');
    const orderForm = document.getElementById('order-form');
    const newOrderForm = document.getElementById('new-order-form');
    const orderList = document.getElementById('order-list');
    const closeModal = document.getElementsByClassName('close')[0];
    const clienteSelect = document.getElementById("cliente");
    const direccionInput = document.getElementById("direccion");
    const barrioInput = document.getElementById("barrio");
    const diaEntregaInput = document.getElementById("diaEntrega"); // Nuevo campo para el día de entrega
    let editingRow = null;

    // Mostrar el formulario para añadir pedidos
    addOrderBtn.addEventListener('click', function() {
        orderForm.style.display = 'block';
        newOrderForm.reset();  // Resetear el formulario
        editingRow = null;  // Reiniciar la variable de edición
        direccionInput.value = ""; // Limpiar los campos de dirección, barrio y día de entrega
        barrioInput.value = "";
        diaEntregaInput.value = ""; // Limpiar el día de entrega
    });

    // Cerrar el formulario modal
    closeModal.addEventListener('click', function() {
        orderForm.style.display = 'none';
    });
});

// Mostrar clientes de la bd en el select Cliente
document.addEventListener("DOMContentLoaded", () => {
    const clienteSelect = document.getElementById("cliente");
    const direccionInput = document.getElementById("direccion");
    const barrioInput = document.getElementById("barrio");
    const diaEntregaInput = document.getElementById("diaEntrega"); // Nuevo campo para el día de entrega

    // Función para obtener los nombres de los clientes y llenar el select
    const obtenerClientes = async () => {
        try {
            const respuesta = await fetch("http://localhost:3000/clientes/nombres"); // La ruta del backend

            if (!respuesta.ok) {
                throw new Error("Error al obtener los clientes");
            }

            const clientes = await respuesta.json();

            // Limpiar el select antes de agregar los clientes
            clienteSelect.innerHTML = "<option value disabled selected=''>Seleccionar cliente</option>";

            // Añadir cada cliente como una opción en el select
            clientes.forEach((cliente) => {
                const opcion = document.createElement("option");
                opcion.value = cliente.idCliente; // El valor será el ID del cliente
                opcion.textContent = cliente.nombre; // El texto será el nombre del cliente
                clienteSelect.appendChild(opcion);
            });
        } catch (error) {
            console.error("Hubo un error al cargar los clientes:", error);
        }
    };

    // Llamar a la función cuando se cargue la página
    obtenerClientes();

    // Función para obtener dirección, barrio y día de entrega del cliente seleccionado
    clienteSelect.addEventListener("change", async (event) => {
        const clienteId = event.target.value;
    
        if (clienteId) {
            try {
                // Primera consulta: obtener datos del cliente
                const respuesta = await fetch(`http://localhost:3000/clientes/${clienteId}`);
                const cliente = await respuesta.json();
    
                // Verificar la respuesta en la consola
                console.log(cliente);
    
                // Rellenar los campos con la información del cliente
                direccionInput.value = cliente.direccion;
    
                // Segunda consulta: obtener nombre del barrio usando el idBarrio
                if (cliente.idBarrio) {
                    const respuestaBarrio = await fetch(`http://localhost:3000/barrios/${cliente.idBarrio}`);
                    const barrio = await respuestaBarrio.json();
    
                    // Asignar el nombre del barrio al input correspondiente
                    barrioInput.value = barrio.nombre;
                    
                    // Tercera consulta: obtener el día de entrega usando el idBarrio
                    const respuestaDiaEntrega = await fetch(`http://localhost:3000/barrios/${cliente.idBarrio}/dia-de-entrega`);
                    const diaEntrega = await respuestaDiaEntrega.json();

                    // Asignar el día de entrega al input correspondiente
                    diaEntregaInput.value = diaEntrega.diaDeEntrega;
                } else {
                    barrioInput.value = "";  // Si no hay barrio, dejar vacío
                    diaEntregaInput.value = ""; // Si no hay día de entrega, dejar vacío
                }
            } catch (error) {
                console.error("Error al obtener el cliente, barrio o día de entrega:", error);
            }
        }
    });
});

document.getElementById('order-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const cliente = document.getElementById('cliente').value;
    const direccion = document.getElementById('direccion').value;
    const barrio = document.getElementById('barrio').value;
    const diaEntrega = document.getElementById('diaEntrega').value;

    // Asignamos los valores fijos
    const estado = 1;  // Valor fijo
    const fecha = new Date().toISOString().split('T')[0];  // Fecha actual en formato YYYY-MM-DD
    const recorrido = 1;  // Valor fijo
    const tipoPedido = 1;  // Valor fijo
    const formaPago = 1;  // Valor fijo

    const nuevoPedido = {
        idCliente: cliente,
        direccion: direccion,
        barrio: barrio,
        diaEntrega: diaEntrega,
        estado: estado,
        fechaDePedido: fecha,
        idRecorrido: recorrido,
        idTipoDePedido: tipoPedido,
        idFormaDePago: formaPago
    };

    // Usar Axios para enviar los datos al backend
    axios.post('/pedidos', nuevoPedido)
        .then(response => {
            alert('Pedido creado correctamente');
            // Aquí puedes hacer algo como limpiar el formulario o cerrar el modal
        })
        .catch(error => {
            alert('Error al crear el pedido');
            console.error(error);
        });
});

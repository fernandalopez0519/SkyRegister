
/*
 * Proyecto: SkyRegister
 * Archivo: clientes.js
 * Descripción: Consulta, visualización y gestión de clientes.
 */

// Elementos de la interfaz
const tablaClientes = document.getElementById('tablaClientes');
const totalClientes = document.getElementById('totalClientes');
const contadorClientes = document.getElementById('contadorClientes');
const buscarCliente = document.getElementById('buscarCliente');
const filtroEstado = document.getElementById('filtroEstado');
const btnRegistrar = document.getElementById('btnRegistrar');

let clientes = [];
let modalRegistrarCliente;

// Consultar clientes a la API
async function cargarClientes() {
    try {
        const respuesta = await fetch('/clientes');

        if (!respuesta.ok) {
            throw new Error('Error al consultar los clientes.');
        }

        const resultado = await respuesta.json();
        clientes = resultado.datos || [];

        renderizarClientes();
        actualizarContadores();

    } catch (error) {
        console.error('Error al cargar clientes:', error);

        if (tablaClientes) {
            tablaClientes.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">
                        No fue posible cargar los clientes.
                    </td>
                </tr>`;
        }
    }
}

// Mostrar clientes en la tabla
function renderizarClientes(lista = clientes) {
    if (!tablaClientes) return;

    if (lista.length === 0) {
        tablaClientes.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    No se encontraron clientes.
                </td>
            </tr>`;
        return;
    }

    tablaClientes.innerHTML = lista.map((cliente, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${cliente.nombre || ''}</td>
            <td>${cliente.documento || ''}</td>
            <td>${cliente.correo || ''}</td>
            <td>Sin datos</td>
            <td>
                <span class="badge bg-success-subtle text-success">
                    Registrado
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary"
                    onclick="editarCliente(${cliente.id_cliente})">
                    <i class="bi bi-pencil"></i>
                </button>

                <button class="btn btn-sm btn-outline-danger"
                    onclick="eliminarCliente(${cliente.id_cliente})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    if (contadorClientes) {
        contadorClientes.textContent = `Mostrando ${lista.length} clientes`;
    }
}

// Actualizar contador
function actualizarContadores() {
    if (totalClientes) {
        totalClientes.textContent = clientes.length;
    }
}

// Aplicar búsqueda
function aplicarFiltros() {
    const texto = buscarCliente?.value.toLowerCase().trim() || '';

    const filtrados = clientes.filter(cliente =>
        (cliente.nombre || '').toLowerCase().includes(texto) ||
        (cliente.documento || '').toLowerCase().includes(texto) ||
        (cliente.correo || '').toLowerCase().includes(texto)
    );

    renderizarClientes(filtrados);
}

// Editar cliente
function editarCliente(id) {
    const cliente = clientes.find(
        item => Number(item.id_cliente) === Number(id)
    );

    if (!cliente) {
        alert('No se encontró el cliente.');
        return;
    }

    document.getElementById('nombreCliente').value = cliente.nombre || '';
    document.getElementById('documentoCliente').value = cliente.documento || '';
    document.getElementById('telefonoCliente').value = cliente.telefono || '';
    document.getElementById('correoCliente').value = cliente.correo || '';
    document.getElementById('direccionCliente').value = cliente.direccion || '';

    document.querySelector('#modalRegistrarCliente .modal-title').textContent =
        'Editar Cliente';

    document.getElementById('modalRegistrarCliente').dataset.idCliente = id;

    modalRegistrarCliente.show();
}

// Eliminar cliente
async function eliminarCliente(id) {
    if (!confirm('¿Deseas eliminar este cliente?')) return;

    try {
        const respuesta = await fetch(`/clientes/${id}`, {
            method: 'DELETE'
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.mensaje || 'No fue posible eliminar el cliente.');
        }

        alert('Cliente eliminado correctamente.');
        await cargarClientes();

    } catch (error) {
        alert(error.message);
        console.error(error);
    }
}

// Inicializar interfaz
document.addEventListener('DOMContentLoaded', () => {

    const elementoModal = document.getElementById('modalRegistrarCliente');
    const formRegistrarCliente = document.getElementById('formRegistrarCliente');

    if (elementoModal) {
        modalRegistrarCliente = new bootstrap.Modal(elementoModal);
    }

    // Abrir modal para registrar
    if (btnRegistrar) {
        btnRegistrar.addEventListener('click', () => {
            formRegistrarCliente?.reset();
            elementoModal.dataset.idCliente = '';

            document.querySelector('#modalRegistrarCliente .modal-title').textContent =
                'Registrar Cliente';

            modalRegistrarCliente.show();
        });
    }

    // Búsqueda
    buscarCliente?.addEventListener('input', aplicarFiltros);

    // Registrar o actualizar cliente
    formRegistrarCliente?.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const id = elementoModal.dataset.idCliente;

        const nuevoCliente = {
            nombre: document.getElementById('nombreCliente').value.trim(),
            documento: document.getElementById('documentoCliente').value.trim(),
            telefono: document.getElementById('telefonoCliente').value.trim(),
            correo: document.getElementById('correoCliente').value.trim(),
            direccion: document.getElementById('direccionCliente').value.trim()
        };

        try {
            const respuesta = await fetch(
                id ? `/clientes/${id}` : '/clientes',
                {
                    method: id ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(nuevoCliente)
                }
            );

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(resultado.mensaje || 'Error al guardar el cliente.');
            }

            alert(id ? 'Cliente actualizado correctamente.' :
                'Cliente registrado correctamente.');

            formRegistrarCliente.reset();
            elementoModal.dataset.idCliente = '';
            modalRegistrarCliente.hide();

            await cargarClientes();

        } catch (error) {
            alert(error.message);
            console.error(error);
        }
    });

    // Cargar información inicial
    cargarClientes();
});

/*
 * Proyecto: SkyRegister
 * Archivo: clienteController.js
 * Descripción: Gestiona las solicitudes del módulo de clientes.
 */

// Importar el modelo de clientes
const clienteModel = require('../models/clienteModel');

// Validar los datos recibidos
function validarDatosCliente(datos) {
    const {
        nombre,
        documento,
        telefono,
        correo,
        direccion
    } = datos;

    // Validar campos obligatorios
    if (
        typeof nombre !== 'string' ||
        typeof documento !== 'string' ||
        !nombre.trim() ||
        !documento.trim()
    ) {
        return 'El nombre y el documento son obligatorios';
    }

    const nombreLimpio = nombre.trim();
    const documentoLimpio = documento.trim();

    // Validar nombre
    if (
        nombreLimpio.length < 3 ||
        nombreLimpio.length > 100 ||
        !/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/.test(nombreLimpio)
    ) {
        return 'El nombre no tiene un formato válido';
    }

    // Validar documento
    if (
        documentoLimpio.length < 5 ||
        documentoLimpio.length > 20 ||
        !/^[A-Za-z0-9-]+$/.test(documentoLimpio)
    ) {
        return 'La identificación no tiene un formato válido';
    }

    // Validar teléfono si se proporciona
    if (telefono && (
        typeof telefono !== 'string' ||
        !/^[0-9+\s()-]{7,20}$/.test(telefono.trim())
    )) {
        return 'El teléfono no tiene un formato válido';
    }

    // Validar correo electrónico
    if (
        typeof correo !== 'string' ||
        !correo.trim() ||
        correo.trim().length > 100 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())
    ) {
        return 'El correo electrónico no tiene un formato válido';
    }

    // Validar dirección si se proporciona
    if (
        direccion !== undefined &&
        direccion !== null &&
        (
            typeof direccion !== 'string' ||
            direccion.length > 200
        )
    ) {
        return 'La dirección no tiene un formato válido';
    }

    return null;
}

// HU-02: Consultar los clientes registrados
async function listarClientes(req, res) {
    try {
        const clientes = await clienteModel.obtenerClientes();

        res.status(200).json({
            mensaje: 'Clientes consultados correctamente',
            total: clientes.length,
            datos: clientes
        });

    } catch (error) {
        console.error('Error al consultar clientes:', error);

        res.status(500).json({
            mensaje: 'No fue posible consultar los clientes'
        });
    }
}

// HU-03: Registrar un nuevo cliente
async function crearCliente(req, res) {
    try {
        const datosRecibidos = req.body;

        const errorValidacion = validarDatosCliente(datosRecibidos);

        if (errorValidacion) {
            return res.status(400).json({
                mensaje: errorValidacion
            });
        }

        const datosCliente = {
            nombre: datosRecibidos.nombre.trim(),
            documento: datosRecibidos.documento.trim(),
            telefono: datosRecibidos.telefono?.trim() || null,
            correo: datosRecibidos.correo.trim().toLowerCase(),
            direccion: datosRecibidos.direccion?.trim() || null
        };

        const idCliente = await clienteModel.registrarCliente(datosCliente);

        res.status(201).json({
            mensaje: 'Cliente registrado correctamente',
            id_cliente: idCliente
        });

    } catch (error) {
        console.error('Error al registrar cliente:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                mensaje: 'El documento o correo ya está registrado'
            });
        }

        res.status(500).json({
            mensaje: 'No fue posible registrar el cliente'
        });
    }
}

// HU-04: Actualizar la información de un cliente
async function actualizarCliente(req, res) {
    try {
        const idCliente = Number(req.params.id);

        // Validar identificador
        if (!Number.isInteger(idCliente) || idCliente <= 0) {
            return res.status(400).json({
                mensaje: 'El identificador del cliente no es válido'
            });
        }

        const datosRecibidos = req.body;

        const errorValidacion = validarDatosCliente(datosRecibidos);

        if (errorValidacion) {
            return res.status(400).json({
                mensaje: errorValidacion
            });
        }

        const datosCliente = {
            nombre: datosRecibidos.nombre.trim(),
            documento: datosRecibidos.documento.trim(),
            telefono: datosRecibidos.telefono?.trim() || null,
            correo: datosRecibidos.correo.trim().toLowerCase(),
            direccion: datosRecibidos.direccion?.trim() || null
        };

        const resultado = await clienteModel.actualizarCliente(
            idCliente,
            datosCliente
        );

        if (resultado === 0) {
            return res.status(404).json({
                mensaje: 'No se encontró el cliente solicitado'
            });
        }

        res.status(200).json({
            mensaje: 'Cliente actualizado correctamente',
            id_cliente: idCliente
        });

    } catch (error) {
        console.error('Error al actualizar cliente:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                mensaje: 'El documento o correo ya está registrado'
            });
        }

        res.status(500).json({
            mensaje: 'No fue posible actualizar el cliente'
        });
    }
}

// HU-05: Eliminar un cliente por su identificador
async function eliminarCliente(req, res) {
    try {
        const idCliente = Number(req.params.id);

        // Validar identificador
        if (!Number.isInteger(idCliente) || idCliente <= 0) {
            return res.status(400).json({
                mensaje: 'El identificador del cliente no es válido'
            });
        }

        const resultado = await clienteModel.eliminarCliente(idCliente);

        if (resultado === 0) {
            return res.status(404).json({
                mensaje: 'No se encontró el cliente solicitado'
            });
        }

        res.status(200).json({
            mensaje: 'Cliente eliminado correctamente',
            id_cliente: idCliente
        });

    } catch (error) {
        console.error('Error al eliminar cliente:', error);

        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                mensaje: 'No se puede eliminar el cliente porque tiene registros asociados'
            });
        }

        res.status(500).json({
            mensaje: 'No fue posible eliminar el cliente'
        });
    }
}

// Exportar las funciones del controlador
module.exports = {
    listarClientes,
    crearCliente,
    actualizarCliente,
    eliminarCliente
};
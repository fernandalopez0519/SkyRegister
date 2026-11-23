
/*
 * Proyecto: SkyRegister
 * Archivo: clienteController.js
 * Descripción: Gestiona las solicitudes del módulo de clientes.
 */

// Importar el modelo de clientes
const clienteModel = require('../models/clienteModel');

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
        const {
            nombre,
            documento,
            telefono,
            correo,
            direccion
        } = req.body;

        // Validar los campos obligatorios
        if (
            typeof nombre !== 'string' || !nombre.trim() ||
            typeof documento !== 'string' || !documento.trim()
        ) {
            return res.status(400).json({
                mensaje: 'El nombre y el documento son obligatorios'
            });
        }

        // Validar el formato del correo electrónico
        if (
            correo &&
            (typeof correo !== 'string' ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))
        ) {
            return res.status(400).json({
                mensaje: 'El formato del correo no es válido'
            });
        }

        const datosCliente = {
            nombre: nombre.trim(),
            documento: documento.trim(),
            telefono: telefono || null,
            correo: correo || null,
            direccion: direccion || null
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

        const {
            nombre,
            documento,
            telefono,
            correo,
            direccion
        } = req.body;

        // Validar el identificador del cliente
        if (!Number.isInteger(idCliente) || idCliente <= 0) {
            return res.status(400).json({
                mensaje: 'El identificador del cliente no es válido'
            });
        }

        // Validar los campos obligatorios
        if (
            typeof nombre !== 'string' || !nombre.trim() ||
            typeof documento !== 'string' || !documento.trim()
        ) {
            return res.status(400).json({
                mensaje: 'El nombre y el documento son obligatorios'
            });
        }

        // Validar el formato del correo electrónico
        if (
            correo &&
            (typeof correo !== 'string' ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))
        ) {
            return res.status(400).json({
                mensaje: 'El formato del correo no es válido'
            });
        }

        const datosCliente = {
            nombre: nombre.trim(),
            documento: documento.trim(),
            telefono: telefono || null,
            correo: correo || null,
            direccion: direccion || null
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

        // Validar el identificador del cliente
        if (!Number.isInteger(idCliente) || idCliente <= 0) {
            return res.status(400).json({
                mensaje: 'El identificador del cliente no es válido'
            });
        }

        // Ejecutar la operación de eliminación
        const resultado = await clienteModel.eliminarCliente(idCliente);

        // Comprobar si el cliente existe
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

        // Identificar restricciones de integridad referencial
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

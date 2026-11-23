
/*
 * Proyecto: SkyRegister
 * Archivo: clienteModel.js
 * Descripción: Consultas y operaciones de gestión de clientes.
 */

// Importar la conexión con MySQL
const pool = require('../../config/database');

// HU-02: Consultar todos los clientes registrados
async function obtenerClientes() {
    const [clientes] = await pool.execute(
        `SELECT
            id_cliente,
            nombre,
            documento,
            telefono,
            correo,
            direccion
         FROM clientes
         ORDER BY id_cliente`
    );

    return clientes;
}

// HU-03: Registrar un nuevo cliente
async function registrarCliente(datosCliente) {

    // Obtener los datos enviados por el controlador
    const {
        nombre,
        documento,
        telefono,
        correo,
        direccion
    } = datosCliente;

    // Consulta parametrizada para registrar el cliente
    const sql = `
        INSERT INTO clientes
        (nombre, documento, telefono, correo, direccion)
        VALUES (?, ?, ?, ?, ?)
    `;

    // Ejecutar la consulta con parámetros
    const [resultado] = await pool.execute(sql, [
        nombre,
        documento,
        telefono || null,
        correo || null,
        direccion || null
    ]);

    // Devolver el identificador generado
    return resultado.insertId;
}

// HU-04: Actualizar la información de un cliente
async function actualizarCliente(idCliente, datosCliente) {

    // Obtener los datos enviados por el controlador
    const {
        nombre,
        documento,
        telefono,
        correo,
        direccion
    } = datosCliente;

    // Consulta parametrizada para actualizar el cliente
    const sql = `
        UPDATE clientes
        SET nombre = ?,
            documento = ?,
            telefono = ?,
            correo = ?,
            direccion = ?
        WHERE id_cliente = ?
    `;

    // Ejecutar la consulta con parámetros
    const [resultado] = await pool.execute(sql, [
        nombre,
        documento,
        telefono || null,
        correo || null,
        direccion || null,
        idCliente
    ]);

    // Devolver la cantidad de registros afectados
    return resultado.affectedRows;
}

// HU-05: Eliminar un cliente por su identificador
async function eliminarCliente(idCliente) {

    // Consulta parametrizada para eliminar el cliente
    const sql = `
        DELETE FROM clientes
        WHERE id_cliente = ?
    `;

    // Ejecutar la consulta con el identificador recibido
    const [resultado] = await pool.execute(sql, [idCliente]);

    // Devolver la cantidad de registros eliminados
    return resultado.affectedRows;
}

// Exportar las funciones del modelo
module.exports = {
    obtenerClientes,
    registrarCliente,
    actualizarCliente,
    eliminarCliente
};

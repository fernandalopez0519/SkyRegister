
/*
 * Proyecto: SkyRegister
 * Archivo: clienteRoutes.js
 * Descripción: Rutas del módulo de clientes.
 */

// Importar Express
const express = require('express');

// Crear el enrutador
const router = express.Router();

// Importar el controlador de clientes
const clienteController = require('../controllers/clienteController');

// HU-02: Consultar todos los clientes
router.get('/', clienteController.listarClientes);

// HU-03: Registrar un nuevo cliente
router.post('/', clienteController.crearCliente);

// HU-04: Actualizar un cliente por su identificador
router.put('/:id', clienteController.actualizarCliente);

// HU-05: Eliminar un cliente por su identificador
router.delete('/:id', clienteController.eliminarCliente);

// Exportar las rutas
module.exports = router;


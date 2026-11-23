
/*
 * Proyecto: SkyRegister
 * Archivo: app.js
 * Descripción: Configuración principal del servidor.
 */

// Importar Express
const express = require('express');

// Importar las rutas de clientes
const clienteRoutes = require('./src/routes/clienteRoutes');

// Crear la aplicación
const app = express();

// Definir el puerto
const PORT = 3000;

// Configurar recepción de datos JSON
app.use(express.json());

// Registrar las rutas de clientes
app.use('/clientes', clienteRoutes);

// Configurar recepción de datos de formularios
app.use(express.urlencoded({ extended: true }));

// Ruta principal
app.get('/', (req, res) => {
    res.send(`
        <h1>Bienvenido a SkyRegister</h1>
        <p>Sistema de gestión de servicios audiovisuales con drones.</p>
        <p>Servidor funcionando correctamente.</p>
    `);
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`SkyRegister funcionando en http://localhost:${PORT}`);
});


/*
 * Proyecto: SkyRegister
 * Archivo: app.js
 * Descripción: Configuración principal del servidor.
 */

const express = require('express');
const path = require('path');

const clienteRoutes = require('./src/routes/clienteRoutes');

const app = express();
const PORT = 3000;

// Configuración para recibir datos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Publicar los archivos de la interfaz
app.use(express.static(path.join(__dirname, 'public')));

// Rutas del módulo de clientes
app.use('/clientes', clienteRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`SkyRegister funcionando en http://localhost:${PORT}`);
});

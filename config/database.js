
/*
 * Proyecto: SkyRegister
 * Archivo: database.js
 * Descripción: Configuración de conexión con MySQL.
 */

// Cargar las variables de entorno
require('dotenv').config();

// Importar la biblioteca mysql2
const mysql = require('mysql2');

// Crear el grupo de conexiones
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Exportar la conexión
module.exports = pool.promise();

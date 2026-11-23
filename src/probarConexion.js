
/*
 * Proyecto: SkyRegister
 * Archivo: probarConexion.js
 * Descripción: Verificar conexión entre Node.js y MySQL.
 */

const pool = require('../config/database');

async function probarConexion() {
    try {
        const [resultado] = await pool.query(
            'SELECT DATABASE() AS base_datos'
        );

        console.log('¡Conexión exitosa!');
        console.log('Base de datos:', resultado[0].base_datos);

    } catch (error) {
        console.error('Error de conexión:', error.message);

    } finally {
        await pool.end();
    }
}

probarConexion();

const mysql = require("mysql2");
const config = require("../config/config");

const pool = mysql.createPool(config.database);

async function checkConnection() {
  try {
    const connection = await pool.promise().getConnection();
    console.log("Conexión a la base de datos establecida correctamente.");
    connection.release();
  } catch (err) {
    console.error("Error al conectar con la base de datos:", err);
    process.exit(1); // Termina el proceso si no se puede conectar a la base de datos
  }
}

module.exports = { pool: pool.promise(), checkConnection };

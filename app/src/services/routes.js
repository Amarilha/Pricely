// app/src/services/routes.js
import pool from '../config/db.js'; // Caminho corrigido com .js

export async function getEmpresas(userId) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM empresas WHERE user_id = ?",
      [userId]
    );
    return rows; // Retorna os dados para quem chamar a função
  } catch (err) {
    console.error('❌ Falha na conexão:', err);
    throw err; // Propaga o erro para ser tratado por quem chamou
  }
  // Não feche o pool aqui! Deixe ele aberto para outras consultas
}

// Não remova o export default pool; se ele existir e for usado em outros lugares.

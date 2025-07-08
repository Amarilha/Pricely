import pool from '../config/db';

(async () => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    console.log('✅ Conexão OK! Resultado:', rows[0].result);
  } catch (err) {
    console.error('❌ Falha na conexão:', err);
  } finally {
    await pool.end(); // Encerra o pool
  }
})();
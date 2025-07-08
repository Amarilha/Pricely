import pool from '../config/db.js'; // Caminho corrigido com .js

(async () => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    console.log('✅ Conexão OK! Resultado:', rows[0].result);
  } catch (err) {
    console.error('❌ Falha na conexão:', err);
  } finally {
    // É uma boa prática fechar o pool se você sabe que não precisará mais dele.
    // Em uma aplicação web, você geralmente não fecha o pool aqui,
    // pois ele precisa ficar aberto para receber requisições.
    // Para um script de teste simples, como este, é apropriado.
    await pool.end(); 
  }
})();
import mysql from 'mysql2/promise';
import parse from 'parse-database-url'; // <--- CORREÇÃO FINAL AQUI

// 1. Obtenha a DATABASE_URL
const databaseUrl = "mysql://root:SPKTvpUgrBArASZGgGeXezswpLzIBcIr@ballast.proxy.rlwy.net:22078/railway";

if (!databaseUrl) {
  console.error('❌ ERRO: A variável de ambiente DATABASE_URL não está definida.');
  console.error('Por favor, defina-a com a URL de conexão do seu banco de dados MySQL.');
  process.exit(1); 
}

// 2. Parseie a DATABASE_URL para extrair as configurações
const dbConfig = parse(databaseUrl); // Agora 'parse' é a função diretamente

// 3. Crie o pool de conexões MySQL
const pool = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  port: dbConfig.port || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : undefined 
});

// 4. Teste de Conexão Inicial
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Conectado ao MySQL via DATABASE_URL com sucesso!');
    conn.release(); 
  } catch (err) {
    console.error('❌ ERRO FATAL: Falha ao conectar ao MySQL. Verifique sua DATABASE_URL e credenciais.');
    console.error(`Mensagem de erro: ${err.message}`);
    process.exit(1);
  }
})();

export default pool;
import mysql from 'mysql2/promise';
import parse from 'parse-database-url';

// 1. Obtenha a DATABASE_URL
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ ERRO: A variável de ambiente DATABASE_URL não está definida.');
  console.error('Por favor, defina-a com a URL de conexão do seu banco de dados MySQL.');
  process.exit(1); 
}

// 2. Parseie a DATABASE_URL para extrair as configurações
const dbConfig = parse(databaseUrl);

// 3. Teste de Conexão Inicial e Exportação Condicional
let pool;

if (process.env.npm_lifecycle_event !== 'build') {
  pool = mysql.createPool({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    port: dbConfig.port || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
  });

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
} else {
  // Durante o build, exportamos um objeto "mock" para evitar a conexão real.
  console.log('ℹ️  Build em andamento, a conexão com o banco de dados será ignorada.');
  pool = {
    query: () => Promise.reject(new Error("Database connection not available during build")),
    execute: () => Promise.reject(new Error("Database connection not available during build")),
    getConnection: () => Promise.reject(new Error("Database connection not available during build")),
  };
}

export default pool;
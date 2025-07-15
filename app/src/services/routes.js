// app/src/services/routes.js
import pool from '../config/db.js'; // Caminho corrigido com .js
import { v4 as uuidv4 } from 'uuid'; // Importa a biblioteca uuid para gerar id_company
import { stateAuth } from '../services/estadoAuth.js'; // Importa a função stateAuth

export async function getEmpresas(userId) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Company WHERE id_user = ?;",
      [userId]
    );
    return rows; // Retorna os dados para quem chamar a função
  } catch (err) {
    console.error('❌ Falha na conexão:', err);
    throw err; // Propaga o erro para ser tratado por quem chamou
  }
  // Não feche o pool aqui! Deixe ele aberto para outras consultas
}

export async function getClient(userId) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM  Client WHERE id_user = ?;",
      [userId]
    );
    return rows; // Retorna os dados para quem chamar a função
  } catch (err) {
    console.error('❌ Falha na conexão:', err);
    throw err; // Propaga o erro para ser tratado por quem chamou
  }
  // Não feche o pool aqui! Deixe ele aberto para outras consultas
}

export async function createCompany(companyData) {
  try {
    // Pega o id_user do usuário autenticado
    const id_user = 'EJwxgmp1i9SgQbmBxY4F8sLQbhf1';
    if (!id_user) {
      throw new Error('Usuário não autenticado');
    }

    // Gera um UUID para id_company
    const id_company = uuidv4();

    // Desestrutura os dados da empresa vindos do frontend
    const {
      nome,
      cnpj,
      endereco_rua,
      endereco_numero,
      endereco_bairro,
      endereco_cidade,
      endereco_estado,
      endereco_cep,
      telefone,
      email,
      logoChar = '', // Define um valor padrão vazio se não for fornecido
    } = companyData;

    // Executa a query para inserir a empresa
    const [result] = await pool.query(
      `INSERT INTO Company (
        id_company, id_user, nome, cnpj, endereco_rua, endereco_numero, endereco_cidade, 
        endereco_estado, endereco_cep, telefone, email, logoChar
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_company,
        id_user,
        nome,
        cnpj,
        endereco_rua || null,
        endereco_numero || null,
        endereco_cidade || null,
        endereco_estado || null,
        endereco_cep || null,
        telefone || null,
        email || null,
        logoChar,
      ]
    );

    // Retorna a empresa recém-criada
    const [newCompany] = await pool.query(
      'SELECT * FROM Company WHERE id_company = ?',
      [id_company]
    );
    return newCompany[0];
  } catch (err) {
    console.error('❌ Erro ao criar empresa:', err);
    throw err;
  }
}

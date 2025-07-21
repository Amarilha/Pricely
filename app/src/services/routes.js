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

export async function createCompany(companyData) {

  console.log("Dados recebidos em createCompany:", companyData);
  try {
   
    // Gera um UUID para id_company
    const id_company = uuidv4();

    // Desestrutura os dados da empresa vindos do frontend
    const {
      id_user,
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

    if (!id_user || !nome || !cnpj || !email) {
      throw new Error('Campos obrigatórios (id_user, nome, cnpj, email) não fornecidos');
    }

    console.log("Executando query com valores:", {
      id_company,
      id_user,
      nome,
      cnpj,
      endereco_rua,
      endereco_numero,
      endereco_cidade,
      endereco_estado,
      endereco_cep,
      telefone,
      email,
      logoChar,
    });

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
        logoChar || null,
      ]
    );

    // Retorna a empresa recém-criada
    const [newCompany] = await pool.query(
      'SELECT * FROM Company WHERE id_company = ?',
      [id_company]
    );
    
    console.log("empresa criada",newCompany[0]);
    return newCompany[0]; // Retorna a empresa recém-criada
  } catch (err) {
    console.error('❌ Erro ao criar empresa:', err);
    throw err;
  }
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

export async function createClient(clientData) {

  console.log("Dados recebidos em createClient:", clientData);
  try {
   
    // Gera um UUID para id_client
    const id_client = uuidv4();

    // Desestrutura os dados da empresa vindos do frontend
    const {
      id_user,
      nome,
      cpf,
      telefone,
      email,
      endereco_rua,
      endereco_numero,
      endereco_cidade,
      endereco_estado,
      endereco_cep,
      observacoes,
      
      
    } = clientData;

    if (!id_user || !nome || !cpf || !email) {
      throw new Error('Campos obrigatórios (id_user, nome, cpf, email) não fornecidos');
    }

    console.log("Executando query com valores:", {
      id_client,
      id_user,
      nome,
      cpf,
      telefone,
      email,
      endereco_rua,
      endereco_numero,
      endereco_cidade,
      endereco_estado,
      endereco_cep,
      observacoes,
      
    });

    // Executa a query para inserir a empresa
    const [result] = await pool.query(
      `INSERT INTO Client (
        id_client, id_user, nome, cpf, telefone, email, endereco_rua, endereco_numero, endereco_cidade, 
        endereco_estado, endereco_cep, observacoes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_client,
        id_user,
        nome,
        cpf,
        telefone || null,
        email || null,
        endereco_rua || null,
        endereco_numero || null,
        endereco_cidade || null,
        endereco_estado || null,
        endereco_cep || null,
        observacoes || null,

      ]
    );

    // Retorna a empresa recém-criada
    const [newClient] = await pool.query(
      'SELECT * FROM Client WHERE id_client = ?',
      [id_client]
    );
    
    console.log("empresa criada",newClient[0]);
    return newClient[0]; // Retorna a empresa recém-criada
  } catch (err) {
    console.error('❌ Erro ao criar empresa:', err);
    throw err;
  }
}
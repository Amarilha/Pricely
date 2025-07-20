import React from 'react';

const TermosLGPD = () => {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      lineHeight: '1.6',
      color: '#333',
      backgroundColor: 'white' // Fundo branco
    }}>
      <h2 style={{
        color: '#2c3e50',
        borderBottom: '2px solid #eee',
        paddingBottom: '10px',
        marginBottom: '20px'
      }}>Termos de Tratamento de Dados - LGPD</h2>
      
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#3498db', marginBottom: '15px' }}>1. Suas Responsabilidades como Controlador de Dados</h3>
        <p>
          Ao utilizar nosso aplicativo, você atua como CONTROLADOR dos dados pessoais que coletar e processar, sendo responsável por:
        </p>
        <ul style={{ paddingLeft: '20px' }}>
          <li style={{ marginBottom: '8px' }}>Definir as finalidades do tratamento de dados</li>
          <li style={{ marginBottom: '8px' }}>Obter consentimento dos titulares quando necessário</li>
          <li style={{ marginBottom: '8px' }}>Fornecer informações claras sobre o tratamento de dados</li>
          <li style={{ marginBottom: '8px' }}>Implementar medidas de segurança adequadas</li>
          <li style={{ marginBottom: '8px' }}>Atender aos direitos dos titulares dos dados</li>
        </ul>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#3498db', marginBottom: '15px' }}>2. Como Tratamos Seus Dados</h3>
        <p>
          Como OPERADOR, nos comprometemos a:
        </p>
        <ul style={{ paddingLeft: '20px' }}>
          <li style={{ marginBottom: '8px' }}>Processar dados apenas conforme suas instruções</li>
          <li style={{ marginBottom: '8px' }}>Manter a confidencialidade dos dados</li>
          <li style={{ marginBottom: '8px' }}>Implementar medidas de segurança adequadas</li>
          <li style={{ marginBottom: '8px' }}>Notificar sobre incidentes de segurança</li>
          <li style={{ marginBottom: '8px' }}>Cooperar no atendimento aos direitos dos titulares</li>
          <li style={{ marginBottom: '8px' }}>Excluir ou devolver os dados quando solicitado</li>
        </ul>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#3498db', marginBottom: '15px' }}>3. Segurança e Confidencialidade</h3>
        <p>
          Mantemos todos os dados pessoais em sigilo e não os divulgamos a terceiros, exceto quando exigido por lei.
        </p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#3498db', marginBottom: '15px' }}>4. Vigência e Alterações</h3>
        <p>
          Estes termos estão em vigor desde a data de aceite e permanecem válidos enquanto você utilizar nossos serviços. Podemos atualizar estes termos periodicamente, e você será notificado sobre mudanças significativas.
        </p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#3498db', marginBottom: '15px' }}>5. Legislação Aplicável</h3>
        <p>
          Estes termos são regidos pelas leis brasileiras, especialmente a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
        </p>
      </div>

      <div style={{
        marginTop: '40px',
        fontSize: '0.9em',
        color: '#7f8c8d',
        textAlign: 'center',
        borderTop: '1px solid #eee',
        paddingTop: '15px'
      }}>
        <p>Última atualização: 11/05/2025</p>
      </div>
    </div>
  );
};

export default TermosLGPD;
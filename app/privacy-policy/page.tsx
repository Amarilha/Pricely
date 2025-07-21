import React from 'react';

const TermosLGPD = () => {
  return (
    <div className="min-h-screen bg-white flex justify-center py-12">
      <div className="max-w-5xl w-full mx-4 bg-white border border-gray-200 shadow-lg rounded-lg p-8 font-serif text-gray-900">
        {/* Letterhead-like Header */}
        <div className="text-center border-b-2 border-gray-300 pb-6 mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Termos de Tratamento de Dados</h1>
          <p className="text-lg text-gray-600 mt-2">Conformidade com a Lei Geral de Proteção de Dados (LGPD)</p>
        </div>

        {/* Section 1 */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-l-4 border-blue-600 pl-4">
            1. Suas Responsabilidades como Controlador de Dados
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Ao utilizar nosso aplicativo, você atua como CONTROLADOR dos dados pessoais que coletar e processar, sendo responsável por:
          </p>
          <ul className="list-decimal pl-8 space-y-2 text-gray-700">
            <li>Definir as finalidades do tratamento de dados;</li>
            <li>Obter consentimento dos titulares quando necessário;</li>
            <li>Fornecer informações claras sobre o tratamento de dados;</li>
            <li>Implementar medidas de segurança adequadas;</li>
            <li>Atender aos direitos dos titulares dos dados.</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-l-4 border-blue-600 pl-4">
            2. Como Tratamos Seus Dados
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Como OPERADOR, nos comprometemos a:
          </p>
          <ul className="list-decimal pl-8 space-y-2 text-gray-700">
            <li>Processar dados apenas conforme suas instruções;</li>
            <li>Manter a confidencialidade dos dados;</li>
            <li>Implementar medidas de segurança adequadas;</li>
            <li>Notificar sobre incidentes de segurança;</li>
            <li>Cooperar no atendimento aos direitos dos titulares;</li>
            <li>Excluir ou devolver os dados quando solicitado.</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-l-4 border-blue-600 pl-4">
            3. Segurança e Confidencialidade
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Mantemos todos os dados pessoais em sigilo e não os divulgamos a terceiros, exceto quando exigido por lei.
          </p>
        </div>

        {/* Section 4 */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-l-4 border-blue-600 pl-4">
            4. Vigência e Alterações
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Estes termos estão em vigor desde a data de aceite e permanecem válidos enquanto você utilizar nossos serviços. Podemos atualizar estes termos periodicamente, e você será notificado sobre mudanças significativas.
          </p>
        </div>

        {/* Section 5 */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-l-4 border-blue-600 pl-4">
            5. Legislação Aplicável
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Estes termos são regidos pelas leis brasileiras, especialmente a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 text-sm text-gray-500 text-center border-t-2 border-gray-300 pt-6">
          <p>Última atualização: 11/05/2025</p>
          <p className="mt-2">Documento elaborado em conformidade com a legislação vigente.</p>
        </div>
      </div>
    </div>
  );
};

export default TermosLGPD;
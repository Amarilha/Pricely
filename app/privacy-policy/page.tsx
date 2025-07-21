import React from "react";

const TermoLGPD = () => {
  return (
    <div className="max-w-3xl mx-auto p-8 bg-white text-black font-sans leading-relaxed text-justify shadow-md border border-gray-300">
      <h1 className="text-2xl font-bold text-center mb-6 uppercase tracking-wide">
        Termo de Responsabilidade Legal sobre o Tratamento de Dados Pessoais
      </h1>



      <h2 className="font-semibold mb-2 text-lg">1. Identificação das Partes</h2>
      <p>
        Este documento estabelece os termos entre o(a) usuário(a) do aplicativo, na qualidade de <strong>Controlador(a)</strong> de dados pessoais, e o prestador de serviço, na qualidade de <strong>Operador(a)</strong>.
      </p>

      <h2 className="font-semibold mt-6 mb-2 text-lg">2. Objeto</h2>
      <p>
        O presente termo define as obrigações e responsabilidades do(a) Operador(a) quanto ao tratamento de dados pessoais por conta e ordem do(a) Controlador(a), conforme previsto na Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD).
      </p>

      <h2 className="font-semibold mt-6 mb-2 text-lg">3. Tratamento de Dados</h2>
      <p>O tratamento de dados pessoais poderá incluir:</p>
      <ul className="list-disc list-inside ml-6">
        <li>Coleta, armazenamento, organização, consulta e análise de dados;</li>
        <li>Utilização com o fim de operacionalizar funcionalidades do aplicativo;</li>
        <li>Outras operações necessárias à execução dos serviços contratados.</li>
      </ul>

      <h2 className="font-semibold mt-6 mb-2 text-lg">4. Obrigações do(a) Operador(a)</h2>
      <ul className="list-disc list-inside ml-6">
        <li>Tratar os dados conforme as instruções documentadas do(a) Controlador(a);</li>
        <li>Manter o dever de confidencialidade sobre os dados tratados;</li>
        <li>Adotar medidas técnicas e administrativas para proteção de dados;</li>
        <li>Reportar incidentes de segurança que envolvam dados pessoais;</li>
        <li>Auxiliar o(a) Controlador(a) no atendimento aos direitos dos titulares;</li>
        <li>Excluir ou devolver os dados após o término da relação contratual, salvo obrigação legal em contrário;</li>
        <li>Permitir auditorias e inspeções autorizadas pelo(a) Controlador(a).</li>
      </ul>

      <h2 className="font-semibold mt-6 mb-2 text-lg">5. Obrigações do(a) Controlador(a)</h2>
      <ul className="list-disc list-inside ml-6">
        <li>Fornecer instruções claras e documentadas ao(à) Operador(a);</li>
        <li>Garantir base legal para o tratamento de dados pessoais;</li>
        <li>Informar aos titulares sobre o tratamento realizado;</li>
        <li>Responder às solicitações dos titulares relacionadas aos dados.</li>
      </ul>

      <h2 className="font-semibold mt-6 mb-2 text-lg">6. Responsabilidades</h2>
      <p>
        Cada parte será responsável pelos danos decorrentes do descumprimento de suas obrigações legais ou contratuais, nos termos da LGPD.
      </p>

      <h2 className="font-semibold mt-6 mb-2 text-lg">7. Confidencialidade</h2>
      <p>
        O(a) Operador(a) compromete-se a manter sigilo absoluto sobre os dados pessoais tratados, sendo vedada sua divulgação a terceiros, salvo em cumprimento de obrigação legal.
      </p>

      <h2 className="font-semibold mt-6 mb-2 text-lg">8. Vigência</h2>
      <p>
        Este termo entra em vigor na data de sua aceitação e permanece válido enquanto perdurar o tratamento de dados pessoais. Poderá ser rescindido mediante notificação prévia por escrito com antecedência mínima de 180 dias.
      </p>

      <h2 className="font-semibold mt-6 mb-2 text-lg">9. Legislação Aplicável e Foro</h2>
      <p>
        Este termo será regido pelas leis da República Federativa do Brasil, elegendo as partes o foro da comarca de Joinville/SC para dirimir quaisquer controvérsias decorrentes do presente instrumento.
      </p>

      <p className="mt-10">
        Ao prosseguir com o uso do aplicativo, o(a) usuário(a) declara que leu, compreendeu e está de acordo com os termos aqui apresentados.
      </p>

      <div className="mt-12 text-sm text-gray-600 border-t pt-4">
        <p>Documento gerado eletronicamente – não requer assinatura física.</p>
      </div>
    </div>
  );
};

export default TermoLGPD;

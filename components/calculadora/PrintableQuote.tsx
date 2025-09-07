import React from 'react';

// Interfaces based on the main page component
interface Company {
  logoChar?: string;
  nome?: string;
  cnpj?: string;
  endereco_rua?: string;
  endereco_numero?: string;
  endereco_cidade?: string;
  endereco_estado?: string;
  telefone?: string;
}

interface Client {
  nome?: string;
  cpf?: string;
  cnpj?: string;
  endereco_rua?: string;
  endereco_numero?: string;
  endereco_cidade?: string;
  endereco_estado?: string;
  telefone?: string;
}

interface ServiceItem {
  quantidade: number;
  descricao: string;
  precoUnitario: number;
  totalItem: number;
}

interface VariableCost {
  quantidade: number;
  unidade: string;
  descricao: string;
  categoria: string;
  valor: number;
}

interface QuoteData {
  empresa: Company;
  cliente: Client;
  numeroOrdem?: string;
  data?: string;
  descricaoServico?: string;
  itens: ServiceItem[];
  custosVariaveis: VariableCost[];
  formaPagamento?: string;
  desconto?: number;
  acrescimos?: number;
}

interface PrintableQuoteProps {
  dados: QuoteData;
  totalFinal: number;
  formatarMoeda: (value: number) => string;
  formatarData: (date: string) => string;
}

const PrintableQuote = React.forwardRef<HTMLDivElement, PrintableQuoteProps>(
  ({ dados, totalFinal, formatarMoeda, formatarData }, ref) => {
    return (
      <div ref={ref} className="printable-quote font-sans bg-white text-gray-800">
        <style>{`
          .printable-quote {
            position: absolute;
            left: -9999px;
            top: -9999px;
            width: 210mm;
            height: 297mm;
            padding: 20mm;
            box-sizing: border-box;
            font-family: 'Inter', Arial, sans-serif;
            color: #1f2937;
            background-color: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          @media print {
            .printable-quote {
              position: static !important;
              width: 210mm !important;
              height: auto !important;
              box-shadow: none !important;
            }
          }
          .printable-quote h1, .printable-quote h2, .printable-quote h3 {
            color: #111827;
          }
          .printable-quote .pdf-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 16px;
            margin-bottom: 24px;
          }
          .printable-quote .company-info .company-logo {
            background: linear-gradient(135deg, #7c3aed, #9333ea);
            color: white;
            font-weight: 700;
            font-size: 28px;
            width: 80px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            margin-bottom: 12px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .printable-quote .company-info p {
            font-size: 14px;
            color: #4b5563;
            margin: 4px 0;
          }
          .printable-quote .order-info {
            text-align: right;
          }
          .printable-quote .order-info h1 {
            font-size: 32px;
            font-weight: 800;
            color: #7c3aed;
          }
          .printable-quote .order-info p {
            font-size: 14px;
            color: #4b5563;
            margin: 4px 0;
          }
          .printable-quote .info-grid {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            margin-bottom: 24px;
          }
          .printable-quote .info-card {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            width: 48%;
            overflow: hidden;
            background-color: #f9fafb;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          }
          .printable-quote .info-card-header {
            background: linear-gradient(135deg, #7c3aed, #9333ea);
            color: white;
            padding: 10px 16px;
            font-weight: 600;
            font-size: 16px;
          }
          .printable-quote .info-card-content {
            padding: 16px;
            font-size: 14px;
            color: #374151;
          }
          .printable-quote .info-card-content p {
            margin: 6px 0;
          }
          .printable-quote .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
            font-size: 14px;
          }
          .printable-quote .items-table th, .printable-quote .items-table td {
            border: 1px solid #e5e7eb;
            padding: 12px;
            text-align: left;
          }
          .printable-quote .items-table th {
            background-color: #f3f4f6;
            font-weight: 600;
            color: #1f2937;
          }
          .printable-quote .items-table .text-right {
            text-align: right;
          }
          .printable-quote .items-table tr:hover {
            background-color: #f9fafb;
          }
          .printable-quote .totals-section {
            display: flex;
            justify-content: flex-end;
          }
          .printable-quote .totals-breakdown {
            width: 40%;
          }
          .printable-quote .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
            color: #374151;
          }
          .printable-quote .total-row.final {
            font-weight: 700;
            font-size: 18px;
            border-top: 2px solid #1f2937;
            margin-top: 12px;
            padding-top: 12px;
            color: #111827;
          }
          .printable-quote .footer-brand {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
          }
          .printable-quote .footer-brand p {
            display: inline-block;
            background: linear-gradient(135deg, #7c3aed, #9333ea);
            color: white;
            font-weight: 600;
            padding: 10px 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
        `}</style>
        <div className="pdf-header">
          <div className="company-info">
            <div className="company-logo">{dados.empresa.logoChar || "XX"}</div>
            <h3 className="text-lg font-semibold">{dados.empresa.nome || "Nome da Empresa"}</h3>
            <p>{dados.empresa.cnpj || "00.000.000/0000-00"}</p>
            <p>{`${dados.empresa.endereco_rua || "Rua"}, ${dados.empresa.endereco_numero || "Nº"}`}</p>
            <p>{`${dados.empresa.endereco_cidade || "Cidade"}, ${dados.empresa.endereco_estado || "Estado"}`}</p>
            <p>{dados.empresa.telefone || "(00) 0000-0000"}</p>
          </div>
          <div className="order-info">
            <h1>ORÇAMENTO</h1>
            <p><strong>Ordem nº:</strong> {dados.numeroOrdem}</p>
            <p><strong>Data:</strong> {formatarData(dados.data || '')}</p>
          </div>
        </div>
        <div className="info-grid">
          <div className="info-card">
            <div className="info-card-header">Cliente</div>
            <div className="info-card-content">
              <p><strong>Nome:</strong> {dados.cliente.nome || "Nome do Cliente"}</p>
              <p><strong>{dados.cliente.cpf ? "CPF" : "CNPJ"}:</strong> {dados.cliente.cpf || dados.cliente.cnpj || "N/A"}</p>
              <p><strong>Endereço:</strong> {`${dados.cliente.endereco_rua || "Rua"}, ${dados.cliente.endereco_numero || "Nº"} - ${dados.cliente.endereco_cidade || "Cidade"}, ${dados.cliente.endereco_estado || "Estado"}`}</p>
              <p><strong>Telefone:</strong> {dados.cliente.telefone || "(00) 0000-0000"}</p>
            </div>
          </div>
          <div className="info-card">
            <div className="info-card-header">Descrição do serviço</div>
            <div className="info-card-content">
              <p>{dados.descricaoServico || "Descrição do serviço"}</p>
            </div>
          </div>
        </div>
        <table className="items-table">
          <thead>
            <tr>
              <th>Qtde</th>
              <th>Produto/Serviço</th>
              <th className="text-right">Preço Unit.</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {dados.itens.map((item, index) => (
              <tr key={`item-${index}`}>
                <td>{item.quantidade}</td>
                <td>{item.descricao}</td>
                <td className="text-right">{formatarMoeda(item.precoUnitario)}</td>
                <td className="text-right">{formatarMoeda(item.totalItem)}</td>
              </tr>
            ))}
            {dados.custosVariaveis.map((custo, index) => (
              <tr key={`custo-${index}`} style={{ fontSize: '13px', backgroundColor: '#f9fafb' }}>
                <td>{`${custo.quantidade} ${custo.unidade}`}</td>
                <td style={{ fontStyle: 'italic' }}>{`${custo.descricao} (${custo.categoria})`}</td>
                <td className="text-right">{formatarMoeda(custo.valor)}</td>
                <td className="text-right">{formatarMoeda(custo.valor * custo.quantidade)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="totals-section">
          <div className="totals-breakdown">
            {dados.desconto > 0 && (
              <div className="total-row">
                <span>Desconto</span>
                <span>-{formatarMoeda(dados.desconto)}</span>
              </div>
            )}
            {dados.acrescimos > 0 && (
              <div className="total-row">
                <span>Acréscimos</span>
                <span>+{formatarMoeda(dados.acrescimos)}</span>
              </div>
            )}
            <div className="total-row final">
              <span>TOTAL</span>
              <span>{formatarMoeda(totalFinal)}</span>
            </div>
          </div>
        </div>
        <footer>
          <div className="text-gray-500  text-center">
            <a href="https://nexprice.com.br" target="_blank" rel="noopener noreferrer">nexprice.com.br</a>
          </div>
        </footer>
        
      </div>
  );
});

PrintableQuote.displayName = 'PrintableQuote';

export default PrintableQuote;

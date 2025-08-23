"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Definindo as interfaces para as props do componente
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
  id: string
  categoria: string
  descricao: string
  valor: number
  unidade: string
  quantidade: number
  observacoes: string
}

interface FixedCost {
    descricao: string;
    valor: number;
}

interface QuoteData {
  empresa: Company;
  cliente: Client;
  numeroOrdem?: string;
  data?: string;
  descricaoServico?: string;
  enderecoCobranca?: string;
  localPrestacao?: {
    nome?: string;
    tipoDocumento?: string;
    documento?: string;
    endereco?: {
      rua?: string;
      numero?: string;
      cidade?: string;
      estado?: string;
    };
  };
  itens: ServiceItem[];
  tempoExecucao?: number;
  incluirSalarios?: boolean;
  custosVariaveis: VariableCost[];
  custosFixos: FixedCost[];
  formaPagamento?: string;
  desconto?: number;
  acrescimos?: number;
  dataEntrega?: string;
}

interface OrcamentoDetalhadoProps {
  dados: QuoteData;
  calcularCustoOperacional: number;
  calcularSubtotalGeral: number;
  calcularLucro: number;
  calcularImpostos: number;
  calcularTotalFinal: number;
  formatarMoeda: (value: number) => string;
  formatarData: (date: string) => string;
  gerarPDF: () => void;
  imprimirOrcamento: () => void;
  handleSaveOrcamento: () => void;
}

const OrcamentoDetalhado: React.FC<OrcamentoDetalhadoProps> = ({
  dados,
  calcularCustoOperacional,
  calcularSubtotalGeral,
  calcularLucro,
  calcularImpostos,
  calcularTotalFinal,
  formatarMoeda,
  formatarData,
  gerarPDF,
  handleSaveOrcamento,
}) => {
  return (
    <>
      <div id="service-quote-pdf" className="bg-white">
        <Card className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg print:shadow-none">
          <CardContent className="page-content">
            {/* Header */}
            <header className="flex justify-between items-start pb-4 border-b">
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="bg-purple-600 text-white font-bold text-2xl w-20 h-10 flex items-center justify-center rounded">
                    {dados.empresa.logoChar || "XX"}
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{dados.empresa.nome || "Nome da Empresa"}</h2>
                  {dados.empresa && (
                    <>
                      <p className="text-sm text-gray-600">CNPJ {dados.empresa.cnpj || "00.000.000/0000-00"}</p>
                      <p className="text-sm text-gray-600">
                        {dados.empresa.endereco_rua || "Rua"}, {dados.empresa.endereco_numero || "Número"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {dados.empresa.endereco_cidade || "Cidade"}, {dados.empresa.endereco_estado || "Estado"}
                      </p>
                      <p className="text-sm text-gray-600">Telefone {dados.empresa.telefone || "(00) 0000-0000"}</p>
                    </>
                  )}
                </div>
              </div>
              <div className="text-right">
                <h1 className="text-3xl font-bold text-gray-800">ORÇAMENTO</h1>
                <div className="mt-2 border border-gray-300 rounded-md p-2 text-left">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Ordem nº:</span> {dados.numeroOrdem}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Data:</span> {formatarData(dados.data || '')}
                  </p>
                </div>
              </div>
            </header>

            {/* Client and Billing Information */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="border border-gray-300 rounded-md">
                <div className="bg-purple-600 text-white p-2 rounded-t-md font-semibold">Cliente</div>
                <div className="p-3 text-sm text-gray-700">
                  <p>
                    <strong>Nome:</strong> {dados.cliente.nome || "Nome do Cliente"}
                  </p>
                  <p>
                    <strong>{dados.cliente.cpf ? "CPF" : "CNPJ"}:</strong> {dados.cliente.cpf || dados.cliente.cnpj || (dados.cliente.cpf ? "100.000.000-01" : "10.000.000/0000-01")}
                    </p>
                  <p>
                    <strong>Endereço:</strong> {dados.cliente.endereco_rua || "Rua"},{" "}
                    {dados.cliente.endereco_numero || "Número"} - {dados.cliente.endereco_cidade || "Cidade"},{" "}
                    {dados.cliente.endereco_estado || "Estado"}
                  </p>
                  <p>
                    <strong>Telefone:</strong> {dados.cliente.telefone || "(00) 0000-0000"}
                  </p>
                </div>
              </div>
              
              <div className="border border-gray-300 rounded-md">
                <div className="bg-purple-600 text-white p-2 rounded-t-md font-semibold">
                  Descrição do serviço
                </div>
                <div className="p-3 text-sm text-gray-700">
                  <p>{dados.descricaoServico || "Descrição do serviço"}</p>
                </div>
              </div>
            </section>

            {/* Items Table */}
            <section className="mt-6">
              <table className="w-full text-left border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-purple-600 text-white">
                    <th className="p-2 border border-gray-300">Quantidade</th>
                    <th className="p-2 border border-gray-300">Produto utilizado ou Serviço Prestado</th>
                    <th className="p-2 text-right border border-gray-300">Preço Unitário</th>
                    <th className="p-2 text-right border border-gray-300">Total</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {/* Renderização dos itens principais */}
                  {dados.itens.map((item, index) => (
                    <tr key={`item-${index}`}>
                      <td className="p-2 border border-gray-300">{item.quantidade}</td>
                      <td className="p-2 border border-gray-300">{item.descricao}</td>
                      <td className="p-2 text-right border border-gray-300">{formatarMoeda(item.precoUnitario)}</td>
                      <td className="p-2 text-right border border-gray-300">{formatarMoeda(item.totalItem)}</td>
                    </tr>
                  ))}

                  {/* Custos Fixos Detalhados */}
                  {dados.custosFixos.map((custo, index) => {
                    const isSalario = custo.descricao.toLowerCase().includes("salário") || custo.descricao.toLowerCase().includes("pró-labore");
                    if (!dados.incluirSalarios && isSalario) return null;
                    return (
                      <tr key={`fixo-${index}`} className="text-xs bg-gray-50">
                        <td className="p-2 border border-gray-300"></td>
                        <td className="p-2 border border-gray-300 italic">{custo.descricao} (Custo Fixo)</td>
                        <td className="p-2 text-right border border-gray-300">{formatarMoeda(custo.valor)}</td>
                        <td className="p-2 text-right border border-gray-300">{formatarMoeda(custo.valor)}</td>
                      </tr>
                    );
                  })}
                  {/* Custos Variáveis Detalhados */}
                    {dados.custosVariaveis.map((custo, index) => (
                      <tr key={`variavel-${index}`} className="text-xs bg-gray-50">
                        <td className="p-2 border border-gray-300">{custo.quantidade} {custo.unidade}</td>
                        <td className="p-2 border border-gray-300 italic">{custo.descricao} ({custo.categoria})</td>
                        <td className="p-2 text-right border border-gray-300">{formatarMoeda(custo.valor)}</td>
                        <td className="p-2 text-right border border-gray-300">{formatarMoeda(custo.valor * custo.quantidade)}</td>
                      </tr>
                    ))}

                  {/* Linhas Vazias para preenchimento */}
                  {Array.from({
                    length: Math.max(0, 4 - dados.itens.length - (dados.custosFixos.length + dados.custosVariaveis.length)),
                  }).map((_, index) => (
                    <tr key={`empty-${index}`} className="h-8">
                      <td className="p-2 border border-gray-300"></td>
                      <td className="border border-gray-300"></td>
                      <td className="border border-gray-300"></td>
                      <td className="border border-gray-300"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Payment and Totals */}
            <section className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="border border-gray-300 rounded-md h-full">
                <div className="bg-purple-600 text-white p-2 rounded-t-md font-semibold">Forma de pagamento</div>
                <div className="p-3 text-sm text-gray-700">
                  <p>{dados.formaPagamento || "Forma de pagamento"}</p>
                </div>
              </div>

              <div className="space-y-2">
                
                {dados.desconto > 0 && (
                  <div className="flex justify-between items-center p-2">
                    <span className="font-semibold text-gray-600">Desconto</span>
                    <span className="text-red-600">-{formatarMoeda(dados.desconto)}</span>
                  </div>
                )}
                {dados.acrescimos > 0 && (
                  <div className="flex justify-between items-center p-2">
                    <span className="font-semibold text-gray-600">Acréscimos</span>
                    <span className="text-green-600">+{formatarMoeda(dados.acrescimos)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center bg-gray-200 p-3 rounded-md">
                  <span className="font-bold text-gray-800 text-lg">TOTAL</span>
                  <span className="text-green-600 font-bold text-lg">{formatarMoeda(calcularTotalFinal)}</span>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="mt-8 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="text-center mt-8 self-end">
                  <p className="bg-purple-600 text-white font-bold p-2 rounded">nexprice.com.br</p>
                </div>
              </div>
            </footer>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-6 print:hidden">
        <Button onClick={gerarPDF} className="bg-purple-600 hover:bg-purple-700">
          <Download className="h-4 w-4 mr-2" />
          Gerar PDF
        </Button>
        <Button onClick={handleSaveOrcamento} variant="outline" className="bg-green-600 hover:bg-green-700 text-white">
          <Download className="h-4 w-4 mr-2" />
          Salvar Orçamento
        </Button>
      </div>
    </>
  );
};

export default OrcamentoDetalhado;

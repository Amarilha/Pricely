'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select";
import { AdsBanner } from "@/components/ads-banner";
import { stateAuth } from '@/app/src/services/estadoAuth';
import { Trash2, Edit, PlusCircle, Building, Search, Loader2, DollarSign, Plus, Info } from 'lucide-react';

const userPlan = "free";

// Interfaces
interface CustoFixo {
  id_custo_fixo: string;
  descricao: string;
  valor: number;
}

interface Company {
  id_company: string;
  id_user: string;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco_rua: string;
  endereco_numero: string;
  endereco_bairro: string;
  endereco_cidade: string;
  endereco_estado: string;
  endereco_cep: string;
  custosFixos: CustoFixo[];
}

const initialCompanyState: Omit<Company, 'id_company' | 'custosFixos' | 'id_user'> = {
  nome: '', cnpj: '', email: '', telefone: '', endereco_rua: '',
  endereco_numero: '', endereco_bairro: '', endereco_cidade: '',
  endereco_estado: '', endereco_cep: ''
};

const initialCostState: Omit<CustoFixo, 'id_custo_fixo'> & { id?: number } = { descricao: '', valor: 0 };

// Componente auxiliar para tooltip
const TooltipHelper = ({ content, children }: { content: string; children: React.ReactNode }) => {
  return (
    <div className="relative group inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded p-1 whitespace-nowrap z-50">
        {content}
      </div>
    </div>
  );
};

// Função para formatar moeda
const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
};

// Função para formatar valor para input (sem símbolo de moeda)
const formatarValorInput = (valor: number): string => {
  if (valor === 0) return '';
  return valor.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Função para converter string formatada em número
const parseValor = (valorString: string): number => {
  // Remove tudo que não é número, vírgula ou ponto
  const cleaned = valorString.replace(/[^\d,]/g, '');
  // Substitui vírgula por ponto para parseFloat
  const numericString = cleaned.replace(',', '.');
  return parseFloat(numericString) || 0;
};

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearchingCnpj, setIsSearchingCnpj] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for Company Dialog
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Partial<Company> | null>(null);
  const [cnpjToSearch, setCnpjToSearch] = useState('');

  // State for Fixed Cost Dialog
  const [isCostDialogOpen, setIsCostDialogOpen] = useState(false);
  const [managingCostsForCompany, setManagingCostsForCompany] = useState<Company | null>(null);
  const [editingCosts, setEditingCosts] = useState<(Omit<CustoFixo, 'id_custo_fixo'> & { id: number })[]>([]);
  const [valorInputs, setValorInputs] = useState<{ [key: number]: string }>({});

  // Estado para seleção de empresa
  const [dados, setDados] = useState({
    empresaSelecionada: '',
    empresa: null as Company | null,
  });

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fetchEmpresas = async () => {
    try {
      setLoading(true);
      const userId = await stateAuth();
      if (!userId) throw new Error("Usuário não autenticado.");
      
      console.log("Buscando empresas para userId:", userId);
      
      const response = await fetch('/dashboard/api/empresas', { 
        headers: { 
          'Authorization': userId 
        } 
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Não autorizado. Faça login novamente.");
        }
        if (response.status === 404) {
          throw new Error("API não encontrada. Verifique se a rota está configurada corretamente.");
        }
        throw new Error(`Falha ao buscar empresas: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setEmpresas(data);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao buscar empresas:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Função para selecionar empresa
  const selecionarEmpresa = (empresaId: string) => {
    const empresaSelecionada = empresas.find(emp => emp.id_company === empresaId);
    if (empresaSelecionada) {
      setDados({
        empresaSelecionada: empresaId,
        empresa: empresaSelecionada,
      });
    }
  };

  const handleCnpjSearch = async () => {
    const cnpjNumerico = cnpjToSearch.replace(/\D/g, '');
    if (cnpjNumerico.length !== 14) return alert(`CNPJ inválido.`);
    setIsSearchingCnpj(true);
    try {
      
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjNumerico}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Falha ao buscar CNPJ.');
      
      setEditingCompany(prev => ({
        ...prev, 
        nome: data.razao_social || '', 
        cnpj: data.cnpj || '', 
        email: data.email || '',
        telefone: data.ddd_telefone_1 || '', 
        endereco_rua: data.logradouro || '',
        endereco_numero: data.numero || '', 
        endereco_bairro: data.bairro || '',
        endereco_cidade: data.municipio || '', 
        endereco_estado: data.uf || '',
        endereco_cep: data.cep || '',
      }));
    } catch (err: any) {
      alert(`Erro ao buscar CNPJ: ${err.message}`);
    } finally {
      setIsSearchingCnpj(false);
    }
  };

  // Company Dialog Handlers
  const handleOpenCompanyDialog = (company: Company | null = null) => {
    setEditingCompany(company ? { ...company } : { ...initialCompanyState });
    setCnpjToSearch('');
    setIsCompanyDialogOpen(true);
  };

  const handleCloseCompanyDialog = () => setIsCompanyDialogOpen(false);

  // Cost Dialog Handlers
  const handleOpenCostDialog = (company: Company) => {
    setManagingCostsForCompany(company);
    setEditingCosts([]);
    setValorInputs({});
    setIsCostDialogOpen(true);
  };

  const handleCloseCostDialog = () => {
    setManagingCostsForCompany(null);
    setEditingCosts([]);
    setValorInputs({});
    setIsCostDialogOpen(false);
  };

  // Company CRUD
  const handleSaveCompany = async () => {
    if (!editingCompany) return;
    setIsSubmitting(true);
    
    try {
      const userId = await stateAuth();
      if (!userId) throw new Error("Usuário não autenticado.");

      const method = editingCompany.id_company ? 'PUT' : 'POST';
      const url = editingCompany.id_company 
        ? `/dashboard/api/empresas/${editingCompany.id_company}` 
        : '/dashboard/api/empresas';
      
      // Prepara os dados para enviar à API
      const payload = { 
        ...editingCompany, 
        id_user: userId,
        // Inclui logoChar como null para compatibilidade com a API
        logoChar: null,
        // Garante que campos opcionais sejam null se vazios
        endereco_rua: editingCompany.endereco_rua || null,
        endereco_numero: editingCompany.endereco_numero || null,
        endereco_bairro: editingCompany.endereco_bairro || null,
        endereco_cidade: editingCompany.endereco_cidade || null,
        endereco_estado: editingCompany.endereco_estado || null,
        endereco_cep: editingCompany.endereco_cep || null,
        telefone: editingCompany.telefone || null,
        email: editingCompany.email || null
      };

      console.log('Enviando dados para:', url, payload);

      const response = await fetch(url, { 
        method, 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': userId
        }, 
        body: JSON.stringify(payload) 
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Falha ao salvar empresa: ${response.status}`);
      }

      const savedCompany = await response.json();
      
      if (editingCompany.id_company) {
        setEmpresas(empresas.map(e => e.id_company === savedCompany.id_company ? savedCompany : e));
      } else {
        setEmpresas([...empresas, savedCompany]);
      }
      
      handleCloseCompanyDialog();
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteCompany = async (companyId: string) => {
    if (!confirm('Tem certeza? Excluir uma empresa também removerá todos os seus orçamentos e custos fixos.')) return;
    
    try {
      const userId = await stateAuth();
      if (!userId) throw new Error("Usuário não autenticado.");

      const response = await fetch(`/dashboard/api/empresas/${companyId}`, { 
        method: 'DELETE',
        headers: { 'Authorization': userId }
      });
      
      if (!response.ok) {
        throw new Error('Falha ao excluir empresa.');
      }
      
      setEmpresas(empresas.filter(e => e.id_company !== companyId));
      // Se a empresa excluída era a selecionada, limpa a seleção
      if (dados.empresaSelecionada === companyId) {
        setDados({ empresaSelecionada: '', empresa: null });
      }
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    }
  };

  // Fixed Cost CRUD
  const handleSaveCost = async (newCost: Omit<CustoFixo, 'id_custo_fixo'> & { id: number }) => {
    if (!managingCostsForCompany || !newCost.descricao || !newCost.valor) {
      return alert("Descrição e valor são obrigatórios.");
    }
    
    setIsSubmitting(true);
    try {
      const { id_company } = managingCostsForCompany;
      const userId = await stateAuth();
      if (!userId) throw new Error("Usuário não autenticado.");

      const url = `/dashboard/api/empresas/${id_company}/custos`;

      const response = await fetch(url, { 
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': userId
        }, 
        body: JSON.stringify({ descricao: newCost.descricao, valor: newCost.valor }) 
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar custo.');
      }

      // Recarrega a lista de empresas para atualizar os custos
      await fetchEmpresas();
      // Remove o custo salvo da lista de custos em edição
      setEditingCosts(editingCosts.filter(cost => cost.id !== newCost.id));
      // Remove o valor do input correspondente
      const updatedValorInputs = { ...valorInputs };
      delete updatedValorInputs[newCost.id];
      setValorInputs(updatedValorInputs);
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCost = async (costId: string) => {
    if (!managingCostsForCompany || !confirm('Excluir este custo?')) return;
    
    try {
      const { id_company } = managingCostsForCompany;
      const userId = await stateAuth();
      if (!userId) throw new Error("Usuário não autenticado.");

      const response = await fetch(`/dashboard/api/empresas/${id_company}/custos/${costId}`, { 
        method: 'DELETE',
        headers: { 'Authorization': userId }
      });

      if (!response.ok) {
        throw new Error('Falha ao excluir custo.');
      }

      // Recarrega a lista de empresas para atualizar os custos
      await fetchEmpresas();
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    }
  };

  // Função para atualizar custos existentes
  const handleUpdateCost = async (id: string, field: string, value: any) => {
    if (!managingCostsForCompany) return;
    
    try {
      const updatedCosts = managingCostsForCompany.custosFixos.map(cost => {
        if (cost.id_custo_fixo === id) {
          return { ...cost, [field]: value };
        }
        return cost;
      });
      
      // Atualiza o estado local imediatamente para feedback visual
      setManagingCostsForCompany({
        ...managingCostsForCompany,
        custosFixos: updatedCosts
      });
      
      // Envia a atualização para o servidor
      const userId = await stateAuth();
      if (!userId) throw new Error("Usuário não autenticado.");
      
      const costToUpdate = updatedCosts.find(cost => cost.id_custo_fixo === id);
      if (!costToUpdate) return;
      
      const response = await fetch(`/dashboard/api/empresas/${managingCostsForCompany.id_company}/custos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': userId
        },
        body: JSON.stringify(costToUpdate)
      });
      
      if (!response.ok) {
        throw new Error('Falha ao atualizar custo.');
      }
    } catch (err: any) {
      console.error('Erro ao atualizar custo:', err);
      // Recarrega os dados em caso de erro para restaurar o estado anterior
      await fetchEmpresas();
    }
  };

  // Função para formatar valor durante a digitação
  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>, costId: number) => {
    let inputVal = e.target.value;
    
    // Remove tudo que não é número
    let numericVal = inputVal.replace(/\D/g, '');
    
    // Converte para número com duas casas decimais
    let valor = 0;
    if (numericVal) {
      valor = parseFloat(numericVal) / 100;
    }
    
    // Atualiza o estado do input
    const updatedValorInputs = { ...valorInputs, [costId]: numericVal ? formatarValorInput(valor) : '' };
    setValorInputs(updatedValorInputs);
    
    // Atualiza o valor no editingCosts
    const updatedCosts = editingCosts.map(cost => 
      cost.id === costId ? { ...cost, valor } : cost
    );
    setEditingCosts(updatedCosts);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando empresas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {userPlan === "free" && <AdsBanner dataAdFormat="auto" dataFullWidthResponsive={true} dataAdSlot="1728932878" className="my-4" />}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center"><Building className="mr-2" />Minhas Empresas</h1>
        <Button onClick={() => handleOpenCompanyDialog()}><PlusCircle className="mr-2 h-4 w-4" /> Cadastrar Empresa</Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
          <p className="font-semibold">Erro:</p>
          <p>{error}</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={fetchEmpresas}>
            Tentar Novamente
          </Button>
        </div>
      )}

      {/* Lista de Empresas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {empresas.map(empresa => (
          <div key={empresa.id_company} className="border p-4 rounded-lg shadow-sm space-y-3 bg-card">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 text-white text-xs font-bold w-8 h-8 flex items-center justify-center rounded">
                {empresa.nome.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-semibold text-primary">{empresa.nome}</h2>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>CNPJ:</strong> {empresa.cnpj}</p>
              <p><strong>Email:</strong> {empresa.email}</p>
              <p><strong>Custos Fixos:</strong> {empresa.custosFixos?.length || 0} cadastrados</p>
            </div>
            <div className="flex justify-between items-center pt-3 border-t">
              <Button variant="outline" size="sm" onClick={() => handleOpenCostDialog(empresa)}>
                <DollarSign className="mr-1 h-4 w-4" />
                Custos Fixos
              </Button>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleOpenCompanyDialog(empresa)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDeleteCompany(empresa.id_company)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {empresas.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold">Nenhuma empresa cadastrada</h3>
          <p className="text-gray-500">Comece cadastrando sua primeira empresa.</p>
          <Button className="mt-4" onClick={() => handleOpenCompanyDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Cadastrar Primeira Empresa
          </Button>
        </div>
      )}

      {/* Company Add/Edit Dialog */}
      <Dialog open={isCompanyDialogOpen} onOpenChange={setIsCompanyDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCompany?.id_company ? 'Editar Empresa' : 'Cadastrar Nova Empresa'}</DialogTitle>
            <DialogDescription>
              {editingCompany?.id_company ? 'Edite os dados da empresa' : 'Preencha os dados da nova empresa'}
            </DialogDescription>
          </DialogHeader>
          
          {!editingCompany?.id_company && (
            <div className="p-4 border-b">
              <Label htmlFor="cnpj-search">Buscar por CNPJ</Label>
              <div className="flex gap-2 mt-1">
                <Input 
                  id="cnpj-search" 
                  value={cnpjToSearch} 
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length > 14) value = value.slice(0, 14);
                    
                    // Aplica máscara apenas para exibição
                    let formattedValue = value;
                    if (value.length > 2) formattedValue = value.replace(/^(\d{2})(\d)/, '$1.$2');
                    if (value.length > 5) formattedValue = formattedValue.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                    if (value.length > 8) formattedValue = formattedValue.replace(/\.(\d{3})(\d)/, '.$1/$2');
                    if (value.length > 12) formattedValue = formattedValue.replace(/(\d{4})(\d)/, '$1-$2');
                    
                    setCnpjToSearch(formattedValue);
                  }}
                  maxLength={14} 
                  placeholder="00.000.000/0000-00" 
                />
                <Button onClick={handleCnpjSearch} disabled={isSearchingCnpj}>
                  {isSearchingCnpj ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}
          
          <div className="grid gap-4 py-4">
            {/* Nome da Empresa */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome da Empresa <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3">
                <Input 
                  id="name" 
                  name="nome" 
                  value={editingCompany?.nome || ''} 
                  onChange={(e) => setEditingCompany({...editingCompany, [e.target.name]: e.target.value})} 
                  placeholder="Informe o nome da empresa"
                />
              </div>
            </div>
            
            {/* CNPJ */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cnpj" className="text-right">
                CNPJ <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3">
                <Input 
                  id="cnpj" 
                  name="cnpj" 
                  value={editingCompany?.cnpj || ''} 
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length > 14) value = value.slice(0, 14);
                    
                    // Aplica máscara apenas para exibição
                    let formattedValue = value;
                    if (value.length > 2) formattedValue = value.replace(/^(\d{2})(\d)/, '$1.$2');
                    if (value.length > 5) formattedValue = formattedValue.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                    if (value.length > 8) formattedValue = formattedValue.replace(/\.(\d{3})(\d)/, '.$1/$2');
                    if (value.length > 12) formattedValue = formattedValue.replace(/(\d{4})(\d)/, '$1-$2');
                    
                    setEditingCompany({...editingCompany, cnpj: formattedValue});
                  }} 
                  placeholder="00.000.000/0000-00"
                />
              </div>
            </div>
            
            {/* Email */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3">
                <Input 
                  id="email" 
                  name="email" 
                  type="email"
                  value={editingCompany?.email || ''} 
                  onChange={(e) => setEditingCompany({...editingCompany, [e.target.name]: e.target.value})} 
                  placeholder="empresa@exemplo.com"
                />
              </div>
            </div>
            
            {/* Telefone */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telefone" className="text-right">
                Telefone <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3">
                <Input 
                  id="telefone" 
                  name="telefone" 
                  value={editingCompany?.telefone || ''} 
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '').replace(/^-/, '');
                    if (value.length > 11) value = value.substring(0, 11);
                    
                    // Aplica a máscara de telefone
                    if (value.length <= 10) {
                      value = value.replace(/^(\d{2})(\d)/, '($1) $2');
                      value = value.replace(/(\d{4})(\d)/, '$1-$2');
                    } else if (value.length === 11) {
                      value = value.replace(/^(\d{2})(\d)/, '($1) $2');
                      value = value.replace(/(\d{5})(\d)/, '$1-$2');
                    }
                    
                    setEditingCompany({...editingCompany, telefone: value});
                  }} 
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
            
            {/* Endereço - Rua */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endereco_rua" className="text-right">
                Rua
              </Label>
              <div className="col-span-3">
                <Input 
                  id="endereco_rua" 
                  name="endereco_rua" 
                  value={editingCompany?.endereco_rua || ''} 
                  onChange={(e) => setEditingCompany({...editingCompany, [e.target.name]: e.target.value})} 
                  placeholder="Nome da rua"
                />
              </div>
            </div>
            
            {/* Endereço - Número */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endereco_numero" className="text-right">
                Número
              </Label>
              <div className="col-span-3">
                <Input 
                  id="endereco_numero" 
                  name="endereco_numero" 
                  value={editingCompany?.endereco_numero || ''} 
                  onChange={(e) => setEditingCompany({...editingCompany, [e.target.name]: e.target.value})} 
                  placeholder="Número"
                />
              </div>
            </div>
            
            {/* Endereço - Bairro */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endereco_bairro" className="text-right">
                Bairro
              </Label>
              <div className="col-span-3">
                <Input 
                  id="endereco_bairro" 
                  name="endereco_bairro" 
                  value={editingCompany?.endereco_bairro || ''} 
                  onChange={(e) => setEditingCompany({...editingCompany, [e.target.name]: e.target.value})} 
                  placeholder="Nome do bairro"
                />
              </div>
            </div>
            
            {/* CEP */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endereco_cep" className="text-right">
                CEP
              </Label>
              <div className="col-span-3">
                <Input 
                  id="endereco_cep" 
                  name="endereco_cep" 
                  value={editingCompany?.endereco_cep || ''} 
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '').slice(0, 8);
                    value = value.replace(/^(\d{5})(\d)/, '$1-$2');
                    setEditingCompany({...editingCompany, endereco_cep: value});
                  }}
                  onBlur={() => {
                    // Adicione aqui a função para buscar o endereço pelo CEP se necessário
                  }}
                  placeholder="00000-000"
                />
              </div>
            </div>
            
            {/* Estado */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endereco_estado" className="text-right">
                Estado
              </Label>
              <div className="col-span-3">
                <Select
                  value={editingCompany?.endereco_estado || ''}
                  onValueChange={(value) => setEditingCompany({...editingCompany, endereco_estado: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {['AC','AL','AP','AM','BA','CE','DF','ES','GO',
                        'MA','MT','MS','MG','PA','PB','PR','PE','PI',
                        'RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map((sigla) => (
                        <SelectItem key={sigla} value={sigla}>
                          {sigla}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Cidade */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endereco_cidade" className="text-right">
                Cidade
              </Label>
              <div className="col-span-3">
                <Input 
                  id="endereco_cidade" 
                  name="endereco_cidade" 
                  value={editingCompany?.endereco_cidade || ''} 
                  onChange={(e) => setEditingCompany({...editingCompany, [e.target.name]: e.target.value})} 
                  placeholder="Nome da cidade"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseCompanyDialog}>Cancelar</Button>
            <Button onClick={handleSaveCompany} disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</> : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fixed Cost Management Dialog */}
      {/* Fixed Cost Management Dialog */}
  <Dialog open={isCostDialogOpen} onOpenChange={setIsCostDialogOpen}>
    <DialogContent className="sm:max-w-[650px] max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <div className="flex items-center">
            Custos Fixos Mensais de {managingCostsForCompany?.nome}
            <TooltipHelper content="Gastos que você tem todo mês, independente de quantos serviços fizer (aluguel, energia, internet, etc.)">
              <Info className="h-4 w-4 ml-2 text-muted-foreground" />
            </TooltipHelper>
          </div>
          <Button 
            onClick={() => {
              setEditingCosts([...editingCosts, { ...initialCostState, id: Date.now() }]);
            }} 
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Custo
          </Button>
        </DialogTitle>
      </DialogHeader>
      
      {/* List of existing costs */}
      <div className="space-y-3 max-h-[50vh] overflow-y-auto py-2">
        {(managingCostsForCompany?.custosFixos || []).map(cost => (
          <div key={cost.id_custo_fixo} className="flex gap-3 items-center p-2 border rounded-lg">
            <div className="flex-1">
              <Input
                placeholder="Descrição do custo"
                value={cost.descricao}
                onChange={(e) => handleUpdateCost(cost.id_custo_fixo, "descricao", e.target.value)}
              />
            </div>
            <div className="w-32">
              <Input
                type="text"
                value={formatarValorInput(cost.valor)}
                onChange={(e) => {
                  const valor = parseValor(e.target.value);
                  handleUpdateCost(cost.id_custo_fixo, "valor", valor);
                }}
                onBlur={(e) => {
                  e.target.value = formatarValorInput(cost.valor);
                }}
                placeholder="R$ 0,00"
                className="w-32"
              />
            </div>
            <Button variant="destructive" size="sm" onClick={() => handleDeleteCost(cost.id_custo_fixo)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        {/* Forms for new costs */}
        {editingCosts.map((newCost, index) => (
          <div key={newCost.id} className="flex gap-3 items-center p-2 border-2 border-dashed rounded-lg bg-muted/20">
            <div className="flex-1">
              <Label htmlFor={`cost-desc-${index}`} className="text-xs">Nova Descrição</Label>
              <Input 
                id={`cost-desc-${index}`} 
                value={newCost.descricao || ''} 
                onChange={(e) => {
                  const updatedCosts = [...editingCosts];
                  updatedCosts[index] = { ...updatedCosts[index], descricao: e.target.value };
                  setEditingCosts(updatedCosts);
                }} 
                placeholder="Ex: Aluguel, Internet, Salários"
              />
            </div>
            <div className="w-32">
              <Label htmlFor={`cost-valor-${index}`} className="text-xs">Novo Valor (R$)</Label>
              <Input 
                id={`cost-valor-${index}`} 
                type="text"
                value={valorInputs[newCost.id] || ''}
                onChange={(e) => handleValorChange(e, newCost.id)}
                onBlur={() => {
                  if (newCost.valor) {
                    const updatedValorInputs = { ...valorInputs, [newCost.id]: formatarValorInput(newCost.valor) };
                    setValorInputs(updatedValorInputs);
                  }
                }}
                placeholder="R$ 0,00"
              />
            </div>
            <Button 
              onClick={() => handleSaveCost(newCost)} 
              disabled={isSubmitting || !newCost.descricao || !newCost.valor} 
              className="mt-5"
            >
              Adicionar
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => {
                const updatedCosts = editingCosts.filter((_, i) => i !== index);
                setEditingCosts(updatedCosts);
                const updatedValorInputs = { ...valorInputs };
                delete updatedValorInputs[newCost.id];
                setValorInputs(updatedValorInputs);
              }} 
              className="mt-5"
            >
              Cancelar
            </Button>
          </div>
        ))}
        
        {/* Totals summary */}
        <div className="pt-4 border-t mt-4">
  <div className="flex justify-between items-center">
    <span className="font-semibold">Total Custos Fixos:</span>
    <span className="font-bold text-lg text-red-600">
      {formatarMoeda(
        (managingCostsForCompany?.custosFixos?.reduce((total, cost) => total + cost.valor, 0) || 0) +
        (editingCosts.reduce((total, cost) => total + (cost.valor || 0), 0))
      )}
    </span>
  </div>
</div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={handleCloseCostDialog}>Fechar</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
    </div>
  );
}
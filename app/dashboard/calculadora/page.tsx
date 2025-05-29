"use client";

import { useState } from "react";
import { CalculadoraForm } from "@/components/calculadora-form";
import { PageHeader } from "@/components/page-header";
import { AdsBanner } from "@/components/ads-banner";

// Questionnaire Pop-up Component
function QuestionnairePopup({ onSubmit, onClose }: { onSubmit: (data: any) => void; onClose: () => void }) {
  const [hasCNPJ, setHasCNPJ] = useState<string>("");
  const [cnpj, setCnpj] = useState<string>("");
  const [businessSector, setBusinessSector] = useState<string>("");
  const [cnpjActiveTime, setCnpjActiveTime] = useState<string>("");
  const [employeeCount, setEmployeeCount] = useState<string>("");
  const [activityDescription, setActivityDescription] = useState<string>("");

  // Format CNPJ input (e.g., 12.345.678/0001-99)
  const formatCNPJ = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})$/);
    if (match) {
      const formatted = [match[1], match[2], match[3], match[4], match[5]]
        .filter(Boolean)
        .join("")
        .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
      return formatted;
    }
    return value;
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value);
    setCnpj(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      hasCNPJ,
      cnpj: hasCNPJ === "yes" ? cnpj : null,
      businessSector,
      cnpjActiveTime: hasCNPJ === "yes" ? cnpjActiveTime : null,
      employeeCount: hasCNPJ === "yes" ? employeeCount : null,
      activityDescription,
    };
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-white">Questionário</h2>
        <p className="mb-4 text-white">Por favor, preencha as informações abaixo antes de acessar a calculadora.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white">Possui CNPJ?</label>
            <select
              value={hasCNPJ}
              onChange={(e) => setHasCNPJ(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Selecione</option>
              <option value="yes">Sim</option>
              <option value="no">Não</option>
            </select>
          </div>

          {hasCNPJ === "yes" && (
            <>
              <div>
                <label className="block text-sm font-medium text-white">CNPJ</label>
                <input
                  type="text"
                  value={cnpj}
                  onChange={handleCNPJChange}
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Tempo de CNPJ ativo</label>
                <input
                  type="text"
                  value={cnpjActiveTime}
                  onChange={(e) => setCnpjActiveTime(e.target.value)}
                  placeholder="Ex: 2 anos"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Quantidade de funcionários</label>
                <input
                  type="number"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(e.target.value)}
                  placeholder="Ex: 10"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-white">Ramo de atuação principal</label>
            <input
              type="text"
              value={businessSector}
              onChange={(e) => setBusinessSector(e.target.value)}
              placeholder="Ex: Tecnologia, Varejo, etc."
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">Descrição da área de atuação</label>
            <textarea
              value={activityDescription}
              onChange={(e) => setActivityDescription(e.target.value)}
              placeholder="Descreva detalhadamente sua área de atuação..."
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-black bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2  text-white rounded-md bg-primary hover:bg-primary/80 "
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// External function to wrap CalculadoraPage
export function withQuestionnaire(WrappedComponent: React.ComponentType) {
  return function EnhancedCalculadoraPage() {
    const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(true);
    const [formData, setFormData] = useState<any>(null);

    const handleQuestionnaireSubmit = (data: any) => {
      setFormData(data);
      setIsQuestionnaireOpen(false);
    };

    return (
      <>
        {isQuestionnaireOpen && (
          <QuestionnairePopup
            onSubmit={handleQuestionnaireSubmit}
            onClose={() => setIsQuestionnaireOpen(false)}
          />
        )}
        {!isQuestionnaireOpen && <WrappedComponent />}
      </>
    );
  };
}

// CalculadoraPage Component
function CalculadoraPage() {
  // Simulando um usuário do plano gratuito
  const userPlan = "free";

  return (
    <div className="flex flex-col gap-6 p-6">
      {userPlan === "free" && <AdsBanner />}
      <PageHeader
        title="Calculadora de Precificação"
        description="Calcule o valor ideal para seus projetos com base nos seus custos e tempo estimado."
      />
      <div className="flex justify-center">
        <div className="w-full max-w-3xl">
          <CalculadoraForm />
        </div>
      </div>
    </div>
  );
}

// Export wrapped component
export default withQuestionnaire(CalculadoraPage);
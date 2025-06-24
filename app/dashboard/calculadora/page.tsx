"use client";

import { useState } from "react";
import { CalculadoraForm } from "@/components/calculadora-form";
import {MateriaPrima} from "@/components/pop-up/materia-prima"
import {DadosDeCadastro} from "@/components/pop-up/dados-de-cadastro"
import { PageHeader } from "@/components/page-header";
import { AdsBanner } from "@/components/ads-banner";
import { useEffect } from "react";
import{withQuestionnaire} from "@/components/pop-up/questionnaire"

// CalculadoraPage Component
function CalculadoraPage() {
  // Simulando um usuário do plano gratuito
  const [showMateriaPrima, setShowMateriaPrima] = useState(false);
  const [showDadosCadastro, setShowDadosCadastro] = useState(false);
  
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Seus outros componentes... */}
      
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setShowMateriaPrima(true)}
          className="bg-[#5635a6] text-white px-4 py-2 rounded-md hover:bg-[#422a7a] transition"
        >
          Abrir Matéria Prima
        </button>
        
        <button
          onClick={() => setShowDadosCadastro(true)}
          className="bg-[#5635a6] text-white px-4 py-2 rounded-md hover:bg-[#422a7a] transition"
        >
          Abrir Formulário
        </button>
      </div>

      {showMateriaPrima && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <MateriaPrima onClose={() => setShowMateriaPrima(false)} />
        </div>
      )}

      {showDadosCadastro && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <DadosDeCadastro onClose={() => setShowDadosCadastro(false)} />
        </div>
      )}
    </div>
  );
}
// Export wrapped component
//export default withQuestionnaire(CalculadoraPage);
export default CalculadoraPage;
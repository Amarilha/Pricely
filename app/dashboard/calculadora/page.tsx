"use client";

import { useState } from "react";
import { CalculadoraForm } from "@/components/calculadora-form";
import {MateriaPrima} from "@/components/pop-up/materia-prima"
import {DadosDeCadastro} from "@/components/pop-up/dados-de-cadastro"
import { PageHeader } from "@/components/page-header";
import { AdsBanner } from "@/components/ads-banner";
import { useEffect } from "react";
import{withQuestionnaire} from "@/components/pop-up/questionnaire"
import{CalculadoraOrcamentoInterativa} from "@/components/calculadora/calculadora-orcamento-interativa"

// CalculadoraPage Component
function CalculadoraPage() {
  // Simulando um usuário do plano gratuito
  const [showMateriaPrima, setShowMateriaPrima] = useState(false);
  const [showDadosCadastro, setShowDadosCadastro] = useState(false);
  
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Seus outros componentes... */}
      <CalculadoraOrcamentoInterativa />
      
    </div>
  );
}
// Export wrapped component
//export default withQuestionnaire(CalculadoraPage);
export default CalculadoraPage;
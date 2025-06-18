"use client";

import { useState, useEffect } from 'react';
import { CalculadoraForm } from "@/components/calculadora-form";
import { PageHeader } from "@/components/page-header";
import { AdsBanner } from "@/components/ads-banner";
import { QuestionnairePopup } from "@/components/pop-up";

// External function to wrap CalculadoraPage
export function withQuestionnaire(WrappedComponent: React.ComponentType) {
  return function EnhancedCalculadoraPage() {
    const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
    const [formData, setFormData] = useState<any>(null);
    const QUESTIONNAIRE_COMPLETED_FLAG = 'questionnaireCompleted'; // Define a key for localStorage

    useEffect(() => {
      // Check if the questionnaire has been completed before
      const hasCompleted = localStorage.getItem(QUESTIONNAIRE_COMPLETED_FLAG);
      if (!hasCompleted) {
        setIsQuestionnaireOpen(true); // Open the questionnaire if not completed
      }
    }, []); // The empty array ensures this effect runs only once on mount

    const handleQuestionnaireSubmit = (data: any) => {
      setFormData(data);
      localStorage.setItem(QUESTIONNAIRE_COMPLETED_FLAG, 'true'); // Set the flag in localStorage
      setIsQuestionnaireOpen(false);
    };

    // You might want to add a loading state while checking localStorage
    // if the wrapped component depends on the formData.
    // For simplicity, I'm omitting that here.

    return (
      <>
        {isQuestionnaireOpen && (
          <QuestionnairePopup
            onSubmit={handleQuestionnaireSubmit}
            onClose={() => {
              // Optionally, handle closing without submitting
              // You might want to prevent closing if submission is mandatory
              setIsQuestionnaireOpen(false);
            }}
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
      {userPlan === "free" && <AdsBanner dataAdFormat="auto" dataFullWidthResponsive={ true } dataAdSlot="7053027303" className="my-4"/>}
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
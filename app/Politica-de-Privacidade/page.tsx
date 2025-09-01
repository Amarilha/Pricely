"use client";

import dynamic from 'next/dynamic';
import { useState } from 'react';

// Use o iframe viewer como fallback ou opção principal
const PDFIframeViewer = dynamic(() => import('@/components/PDFIframeViewer'), {
  ssr: false,
  loading: () => <div className="text-foreground p-8 text-center">Carregando visualizador de PDF...</div>
});

// Opcional: ainda tentar carregar o react-pdf para browsers que suportam
const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => <div className="text-foreground p-8 text-center">Carregando visualizador avançado...</div>
});

const TermosDeUsoPage = () => {
  const [useAdvancedViewer, setUseAdvancedViewer] = useState(false);
  const pdfFile = "/doc/Politica-de-Uso-de-Dados.pdf";

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-foreground animate-fadeInDown">
        Política de Privacidade
        </h1>
        <p className="text-center text-muted-foreground mb-8 animate-fadeIn">
          Leia atentamente nossos política de privacidade antes de utilizar nossos serviços.
        </p>

        {/* Visualizador de PDF */}
        <div className="rounded-lg overflow-hidden">
          {useAdvancedViewer ? (
            <PDFViewer file={pdfFile} />
          ) : (
            <PDFIframeViewer 
              file={pdfFile} 
              title="Termos de Uso" 
              className="h-[600px]" 
            />
          )}
        </div>
        
        {/* Fallback link */}
        <div className="mt-4 text-center">
          <a 
            href={pdfFile}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Abrir PDF em nova janela
          </a>
        </div>
        
        <div className="mt-8 p-6 bg-card rounded-lg border border-border animate-fadeIn">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Aceitação da Política de Privacidade</h2>
          <p className="text-muted-foreground">
            Ao utilizar nossos serviços, você concorda com os política de privacidade apresentados
            no documento acima. Certifique-se de ler e compreender todas as seções antes de prosseguir.
          </p>
        </div>
      </div>
    </div>
  );
};


export default TermosDeUsoPage;
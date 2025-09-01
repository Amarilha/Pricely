"use client";

import { useState } from 'react';

interface PDFIframeViewerProps {
  file: string;
  title?: string;
  className?: string;
}

const PDFIframeViewer = ({ file, title = "Visualizador de PDF", className = "" }: PDFIframeViewerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative w-full h-screen bg-card rounded-lg border border-border overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-card">
          <div className="text-foreground animate-pulse">Carregando PDF...</div>
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-card p-4">
          <div className="text-red-500 text-center mb-4">
            Não foi possível carregar o documento PDF.
          </div>
          <a 
            href={file} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir PDF em nova janela
          </a>
        </div>
      )}
      
      <iframe
        src={file}
        width="100%"
        height="100%"
        className="border-none"
        title={title}
        onLoad={() => {
          setIsLoading(false);
          setHasError(false);
        }}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      >
        <div className="p-4 text-foreground">
          Seu navegador não suporta a visualização de PDF. 
          <a href={file} className="text-primary hover:underline ml-1">Baixe o PDF</a>
        </div>
      </iframe>
    </div>
  );
};

export default PDFIframeViewer;
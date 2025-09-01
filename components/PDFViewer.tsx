"use client";

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Configuração segura do worker do PDF.js
const setupPDFJS = () => {
  try {
    // Tenta usar a versão do CDN do jsDelivr (que tem CORS habilitado)
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  } catch (error) {
    console.warn('Falha ao configurar worker externo, usando fallback local');
    // Fallback: usar o worker incluído no próprio pacote
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }
};

interface PDFViewerProps {
  file: string;
}

const PDFViewer = ({ file }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [error, setError] = useState<string>('');
  const [width, setWidth] = useState<number>(800);

  useEffect(() => {
    setupPDFJS();
    
    // Ajustar largura para responsividade
    const handleResize = () => {
      setWidth(Math.min(800, window.innerWidth - 40));
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setError('');
  }

  function onDocumentLoadError(error: Error): void {
    console.error('Erro ao carregar PDF:', error);
    setError('Não foi possível carregar o documento. Verifique se o arquivo existe e está acessível.');
  }

  return (
    <div className="flex flex-col items-center p-4 bg-card rounded-lg border border-border">
      <div className="flex items-center gap-4 mb-4">
        <button 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber(prev => prev - 1)}
        >
          Anterior
        </button>
        <span className="text-foreground">
          Página {pageNumber} de {numPages}
        </span>
        <button 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={pageNumber >= numPages}
          onClick={() => setPageNumber(prev => prev + 1)}
        >
          Próxima
        </button>
      </div>

      {error && (
        <div className="text-red-500 p-4 bg-red-50 rounded-md mb-4">
          {error}
          <div className="mt-2">
            <a 
              href={file} 
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Clique aqui para abrir o PDF em uma nova janela
            </a>
          </div>
        </div>
      )}

      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={<div className="text-foreground p-8">Carregando PDF...</div>}
        error={null}
        className="flex justify-center"
      >
        <Page 
          pageNumber={pageNumber} 
          width={width}
          className="shadow-lg rounded border border-border"
        />
      </Document>
    </div>
  );
};

export default PDFViewer;
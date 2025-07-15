import { useState, FormEvent, useEffect } from "react";
import { X, Save } from "lucide-react";

type ObraCadastroModalProps = {
  onClose: () => void;
};

export function DadosDeCadastro({ onClose }: ObraCadastroModalProps) {
  //const [isObraEnabled, setIsObraEnabled] = useState(true);
  const [isObraEnabled, setIsObraEnabled] = useState(false); // Alterado para false
  const [formData, setFormData] = useState({
    cliente: "",
    projeto: "",
    projetoobra: "",
    endereco: "",
    responsavel: "",
    descricao: ""
  });
  const [currentDateTime, setCurrentDateTime] = useState("");

  // Atualiza data e hora quando o modal é aberto
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const date = now.toLocaleDateString('pt-BR');
      const time = now.toLocaleTimeString('pt-BR');
      setCurrentDateTime(`DATA ${date} HORA ${time}`);
    };

    updateDateTime(); // Atualiza imediatamente
  }, []);

  const toggleObraFields = () => {
    setIsObraEnabled(!isObraEnabled);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Adicione aqui a lógica para salvar os dados
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-xs p-6 text-gray-900 shadow-lg">
        <div className="bg-[#e6e1f5] rounded-md p-3 text-center text-xs font-semibold mb-5 tracking-wide text-[#5635a6]">
          Dados de cadastro
        </div>
        <div className="text-xs mb-5 text-center font-normal tracking-wide text-[#7a6fbc]">
          {currentDateTime}
        </div>
        
        <form className="space-y-4 text-xs font-normal" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label className="block mb-1 font-semibold tracking-wide text-[#5635a6]" htmlFor="cliente">
              CLIENTE
            </label>
            <input
              id="cliente"
              type="text"
              placeholder="Value"
              value={formData.cliente}
              onChange={handleInputChange}
              className="w-full rounded-md border border-[#bfb8e6] bg-white px-3 py-2 text-gray-900 placeholder-[#a59fe0] focus:outline-none focus:ring-2 focus:ring-[#5635a6] transition"
            />
          </div>
          
          <div>
            <label className="block mb-1 font-semibold tracking-wide text-[#5635a6]" htmlFor="projeto">
              PROJETO
            </label>
            <input
              id="projeto"
              type="text"
              placeholder="Value"
              value={formData.projeto}
              onChange={handleInputChange}
              className="w-full rounded-md border border-[#bfb8e6] bg-white px-3 py-2 text-gray-900 placeholder-[#a59fe0] focus:outline-none focus:ring-2 focus:ring-[#5635a6] transition"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <label className="text-xs font-semibold tracking-wide text-[#5635a6]" htmlFor="obraSwitch">
              Obra
            </label>
            <label htmlFor="obraSwitch" className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                id="obraSwitch" 
                className="sr-only peer" 
                checked={isObraEnabled}
                onChange={toggleObraFields}

              />
              <div
                className="w-11 h-6 bg-[#bfb8e6] rounded-full peer peer-checked:bg-[#5635a6] peer-focus:ring-2 peer-focus:ring-[#5635a6] transition-colors"
              ></div>
              <div
                className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-5 transition-transform"
              ></div>
            </label>
          </div>
          
          {isObraEnabled && (
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold tracking-wide text-[#5635a6]" htmlFor="projetoobra">
                  Projeto Obra
                </label>
                <input
                  id="projetoobra"
                  type="text"
                  placeholder="Value"
                  value={formData.projetoobra}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-[#bfb8e6] bg-white px-3 py-2 text-gray-900 placeholder-[#a59fe0] focus:outline-none focus:ring-2 focus:ring-[#5635a6] transition"
                />
              </div>
              
              <div>
                <label className="block mb-1 font-semibold tracking-wide text-[#5635a6]" htmlFor="endereco">
                  ENDEREÇO DA OBRA
                </label>
                <input
                  id="endereco"
                  type="text"
                  placeholder="Value"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-[#bfb8e6] bg-white px-3 py-2 text-gray-900 placeholder-[#a59fe0] focus:outline-none focus:ring-2 focus:ring-[#5635a6] transition"
                />
              </div>
              
              <div>
                <label className="block mb-1 font-semibold tracking-wide text-[#5635a6]" htmlFor="responsavel">
                  RESPONSÁVEL
                </label>
                <input
                  id="responsavel"
                  type="text"
                  placeholder="Value"
                  value={formData.responsavel}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-[#bfb8e6] bg-white px-3 py-2 text-gray-900 placeholder-[#a59fe0] focus:outline-none focus:ring-2 focus:ring-[#5635a6] transition"
                />
              </div>
            </div>
          )}
          
          <div>
            <label className="block mb-1 font-semibold tracking-wide text-[#5635a6]" htmlFor="descricao">
              Descrição
            </label>
            <input
              id="descricao"
              type="text"
              placeholder="Value"
              value={formData.descricao}
              onChange={handleInputChange}
              className="w-full rounded-md border border-[#bfb8e6] bg-white px-3 py-2 text-gray-900 placeholder-[#a59fe0] focus:outline-none focus:ring-2 focus:ring-[#5635a6] transition"
            />
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-[#5635a6] text-white text-xs font-semibold rounded-md px-4 py-2 hover:bg-[#422a7a] transition flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              CANCELAR
            </button>
            <button
              type="submit"
              className="bg-[#422a7a] text-white text-xs font-semibold rounded-md px-4 py-2 hover:bg-[#5635a6] transition flex items-center gap-1"
            >
              <Save className="w-4 h-4" />
              SALVAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
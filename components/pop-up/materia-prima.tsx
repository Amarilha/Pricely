import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

interface TableRow {
  id: number;
  qt1: string;
  qt2: string;
  qt3: string;
  material: string;
}

interface MateriaPrimaProps {
  onClose?: () => void;
}

export const MateriaPrima: React.FC<MateriaPrimaProps> = ({ onClose }) => {
  const [rows, setRows] = useState<TableRow[]>([
    { id: 1, qt1: '', qt2: '', qt3: '', material: '' },
    { id: 2, qt1: '', qt2: '', qt3: '', material: '' },
    { id: 3, qt1: '', qt2: '', qt3: '', material: '' },
    { id: 4, qt1: '', qt2: '', qt3: '', material: '' },
    { id: 5, qt1: '', qt2: '', qt3: '', material: '' },
  ]);

  const formatToTwoDecimals = (value: string): string => {
    const numericValue = value.replace(',', '.');
    if (numericValue === '' || isNaN(parseFloat(numericValue))) return '';
    return parseFloat(numericValue).toFixed(2);
  };

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, rowId: number, field: keyof TableRow) => {
    let val = e.target.value;
    val = val.replace(/[^0-9.,]/g, '');
    val = val.replace(',', '.');
    const parts = val.split('.');
    if (parts.length > 2) {
      val = parts[0] + '.' + parts.slice(1).join('');
    }
    
    setRows(rows.map(row => 
      row.id === rowId ? { ...row, [field]: val } : row
    ));
  };

  const handleBlur = (rowId: number, field: keyof TableRow) => {
    setRows(rows.map(row => {
      if (row.id === rowId) {
        // Convert to string before passing to formatToTwoDecimals
        return { ...row, [field]: formatToTwoDecimals(String(row[field])) };
      }
      return row;
    }));
  };

  const handleMaterialChange = (e: React.ChangeEvent<HTMLInputElement>, rowId: number) => {
    setRows(rows.map(row => 
      row.id === rowId ? { ...row, material: e.target.value } : row
    ));
  };

  const addRow = () => {
    const newId = rows.length > 0 ? Math.max(...rows.map(row => row.id)) + 1 : 1;
    setRows([...rows, { id: newId, qt1: '', qt2: '', qt3: '', material: '' }]);
  };

  const removeRow = (rowId: number) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== rowId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedRows = rows.map(row => ({
      ...row,
      qt1: formatToTwoDecimals(row.qt1),
      qt2: formatToTwoDecimals(row.qt2),
      qt3: formatToTwoDecimals(row.qt3)
    }));
    console.log('Dados enviados:', formattedRows);
  };

  const handleReset = () => {
    setRows(rows.map(row => ({
      id: row.id,
      qt1: '',
      qt2: '',
      qt3: '',
      material: ''
    })));
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-inner border border-border relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Fechar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
      
      <h2 className="text-center text-lg font-semibold mb-6 text-primary">
        ITENS COMERCIAIS
      </h2>
      
      <form id="itemsForm" onSubmit={handleSubmit}>
        <table className="w-full text-sm border border-border rounded-md overflow-hidden">
          <thead className="bg-primary text-primary-foreground">
            <tr>
              <th className="p-3 text-left font-medium">Quantidade 1</th>
              <th className="p-3 text-left font-medium">Quantidade 2</th>
              <th className="p-3 text-left font-medium">Quantidade 3</th>
              <th className="p-3 text-left font-medium">Material</th>
              <th className="p-3 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map(row => (
              <tr key={row.id} className="bg-background hover:bg-accent/50 transition-colors">
                <td className="p-2 border-r border-border">
                  <input
                    type="text"
                    inputMode="decimal"
                    className="w-full p-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                    value={row.qt1}
                    onChange={(e) => handleNumberInput(e, row.id, 'qt1')}
                    onBlur={() => handleBlur(row.id, 'qt1')}
                  />
                </td>
                <td className="p-2 border-r border-border">
                  <input
                    type="text"
                    inputMode="decimal"
                    className="w-full p-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                    value={row.qt2}
                    onChange={(e) => handleNumberInput(e, row.id, 'qt2')}
                    onBlur={() => handleBlur(row.id, 'qt2')}
                  />
                </td>
                <td className="p-2 border-r border-border">
                  <input
                    type="text"
                    inputMode="decimal"
                    className="w-full p-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                    value={row.qt3}
                    onChange={(e) => handleNumberInput(e, row.id, 'qt3')}
                    onBlur={() => handleBlur(row.id, 'qt3')}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="w-full p-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                    value={row.material}
                    onChange={(e) => handleMaterialChange(e, row.id)}
                    placeholder="Descrição"
                  />
                </td>
                <td className="p-2 text-center">
                  <button
                    type="button"
                    className="text-destructive hover:text-destructive/70 p-1 rounded-full hover:bg-destructive/10 transition-colors"
                    aria-label="Remover linha"
                    onClick={() => removeRow(row.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={addRow}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors font-medium"
          >
            + Adicionar linha
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors font-medium"
            >
              Limpar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors font-medium shadow-md"
            >
              Salvar Itens
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
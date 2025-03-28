
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Download, FileText, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface TableCell {
  content: string;
}

interface TableProps {
  onExport: (tableData: TableCell[][], title: string, caption: string) => void;
}

const TableEditor: React.FC<TableProps> = ({ onExport }) => {
  const [rows, setRows] = useState<number>(3);
  const [cols, setCols] = useState<number>(3);
  const [tableData, setTableData] = useState<TableCell[][]>(
    Array(3).fill(null).map(() => Array(3).fill(null).map(() => ({ content: '' })))
  );
  const [tableTitle, setTableTitle] = useState<string>("Tabela 1");
  const [tableCaption, setTableCaption] = useState<string>("Fonte: Elaborado pelos autores.");
  const { toast } = useToast();

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...tableData];
    newData[rowIndex][colIndex] = { content: value };
    setTableData(newData);
  };

  const addRow = () => {
    const newData = [...tableData];
    newData.push(Array(cols).fill(null).map(() => ({ content: '' })));
    setTableData(newData);
    setRows(rows + 1);
    toast({
      title: "Linha adicionada",
      description: "Uma nova linha foi adicionada à tabela.",
    });
  };

  const removeRow = () => {
    if (rows > 1) {
      const newData = [...tableData];
      newData.pop();
      setTableData(newData);
      setRows(rows - 1);
      toast({
        title: "Linha removida",
        description: "A última linha foi removida da tabela.",
      });
    }
  };

  const addColumn = () => {
    const newData = tableData.map(row => {
      const newRow = [...row];
      newRow.push({ content: '' });
      return newRow;
    });
    setTableData(newData);
    setCols(cols + 1);
    toast({
      title: "Coluna adicionada",
      description: "Uma nova coluna foi adicionada à tabela.",
    });
  };

  const removeColumn = () => {
    if (cols > 1) {
      const newData = tableData.map(row => {
        const newRow = [...row];
        newRow.pop();
        return newRow;
      });
      setTableData(newData);
      setCols(cols - 1);
      toast({
        title: "Coluna removida",
        description: "A última coluna foi removida da tabela.",
      });
    }
  };

  const handleExport = () => {
    onExport(tableData, tableTitle, tableCaption);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6 space-y-4">
        <div>
          <label htmlFor="tableTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Título da Tabela (ABNT):
          </label>
          <Input
            id="tableTitle"
            value={tableTitle}
            onChange={(e) => setTableTitle(e.target.value)}
            className="w-full"
            placeholder="Tabela X - Título da tabela"
          />
        </div>
        
        <div>
          <label htmlFor="tableCaption" className="block text-sm font-medium text-gray-700 mb-1">
            Legenda/Fonte (ABNT):
          </label>
          <Input
            id="tableCaption"
            value={tableCaption}
            onChange={(e) => setTableCaption(e.target.value)}
            className="w-full"
            placeholder="Fonte: Elaborado pelos autores."
          />
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={addRow} 
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Linha
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={removeRow} 
          className="flex items-center gap-1"
          disabled={rows <= 1}
        >
          <Minus className="h-4 w-4" /> Linha
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={addColumn} 
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Coluna
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={removeColumn} 
          className="flex items-center gap-1"
          disabled={cols <= 1}
        >
          <Minus className="h-4 w-4" /> Coluna
        </Button>
      </div>

      <div className="overflow-x-auto mb-6">
        <table className="abnt-table">
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={`${rowIndex}-${colIndex}`} className={rowIndex === 0 ? 'bg-academic-primary text-white' : ''}>
                    <Input
                      value={cell.content}
                      onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                      className={`w-full border-0 ${rowIndex === 0 ? 'bg-academic-primary text-white placeholder-gray-300' : 'bg-transparent'}`}
                      placeholder={`Célula ${rowIndex},${colIndex}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          <span className="font-semibold">Dica:</span> A primeira linha será formatada como cabeçalho.
        </div>
        <Button onClick={handleExport} className="bg-academic-primary hover:bg-academic-highlight">
          <Download className="h-4 w-4 mr-2" /> Exportar para PDF
        </Button>
      </div>
    </div>
  );
};

export default TableEditor;

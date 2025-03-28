
import React, { useState } from 'react';
import TableEditor from '@/components/TableEditor';
import PDFGenerator from '@/components/PDFGenerator';
import { Toaster } from '@/components/ui/toaster';
import { Table } from 'lucide-react';

interface TableCell {
  content: string;
}

const Index = () => {
  const [tableData, setTableData] = useState<TableCell[][]>([]);
  const [tableTitle, setTableTitle] = useState<string>("");
  const [tableCaption, setTableCaption] = useState<string>("");
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);

  const handleExport = (data: TableCell[][], title: string, caption: string) => {
    setTableData(data);
    setTableTitle(title);
    setTableCaption(caption);
    setIsPreviewVisible(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-academic-primary text-white py-6">
        <div className="container">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Table className="h-8 w-8" />
            <h1 className="text-2xl md:text-3xl font-semibold">Gerador de Tabelas Acadêmicas</h1>
          </div>
          <p className="text-center md:text-left mt-2 text-gray-200 max-w-2xl">
            Crie tabelas formatadas segundo as normas ABNT2 para relatórios universitários
          </p>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
            <div className="bg-academic-primary text-white py-3 px-6">
              <h2 className="text-xl font-semibold">Editor de Tabela</h2>
            </div>
            <div className="p-6">
              <TableEditor onExport={handleExport} />
            </div>
          </div>

          {isPreviewVisible && (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
              <div className="bg-academic-primary text-white py-3 px-6">
                <h2 className="text-xl font-semibold">Prévia ABNT2</h2>
              </div>
              <div className="p-6">
                <PDFGenerator 
                  tableData={tableData} 
                  title={tableTitle} 
                  caption={tableCaption} 
                />
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-academic-primary text-white py-4 mt-auto">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              Academic Table Genie - Gerador de Tabelas ABNT2
            </p>
            <p className="text-sm mt-1 md:mt-0">
              Ideal para relatórios universitários em instituições como USP e UNESP
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

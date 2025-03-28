
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface TableCell {
  content: string;
}

interface PDFGeneratorProps {
  tableData: TableCell[][];
  title: string;
  caption: string;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ tableData, title, caption }) => {
  const { toast } = useToast();
  const tableRef = React.useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (tableRef.current) {
      try {
        toast({
          title: "Gerando PDF",
          description: "Por favor, aguarde...",
        });

        // Get the table element
        const element = tableRef.current;
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
        });

        // ABNT standards typically use A4 paper
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        // Adding the image to the PDF, positioning it for proper ABNT format
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight) * 0.9; // 0.9 to add some margins
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 30; // Position from top

        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

        // Save the PDF
        pdf.save(`${title.replace(/\s+/g, '_')}.pdf`);

        toast({
          title: "PDF Gerado com Sucesso",
          description: "Seu arquivo foi baixado.",
          variant: "default",
        });
      } catch (error) {
        console.error("Error generating PDF:", error);
        toast({
          title: "Erro ao gerar PDF",
          description: "Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="mt-8">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-academic-primary">Prévia da Tabela (formato ABNT2)</h3>
        <Button onClick={generatePDF} className="bg-academic-primary hover:bg-academic-highlight">
          <FileText className="h-4 w-4 mr-2" /> Baixar PDF
        </Button>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md" ref={tableRef}>
        <div className="text-center mb-4 font-semibold">{title}</div>
        <table className="abnt-table">
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={`${rowIndex}-${colIndex}`} className={rowIndex === 0 ? 'bg-academic-primary text-white' : ''}>
                    {cell.content}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="abnt-caption text-center">{caption}</div>
      </div>
    </div>
  );
};

export default PDFGenerator;

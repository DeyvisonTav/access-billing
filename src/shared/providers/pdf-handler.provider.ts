import { Provider } from '@nestjs/common';
import { PDFDocument, rgb } from 'pdf-lib';

export const PdfHandlerProvider: Provider = {
  provide: 'PDF_HANDLER',
  useFactory: () => {
    return {
      async splitPdf(buffer: Buffer): Promise<Buffer[]> {
        const pdfDoc = await PDFDocument.load(buffer);
        const pages: Buffer[] = [];

        for (let i = 0; i < pdfDoc.getPageCount(); i++) {
          const newPdf = await PDFDocument.create();
          const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
          newPdf.addPage(copiedPage);
          const pdfBytes = await newPdf.save();
          pages.push(Buffer.from(pdfBytes));
        }

        return pages;
      },

      async createPdfReport(bills: any[]): Promise<Buffer> {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595, 842]); 

        const tableHeader = ['ID', 'Nome', 'Lote', 'Valor', 'Linha Digitável'];
        const tableData = bills.map(bill => [
          bill.id.toString(),
          bill.nome_sacado,
          bill.lote.nome,
          bill.valor.toFixed(2),
          bill.linha_digitavel
        ]);

        const { width, height } = page.getSize();
        const margin = 50;
        const rowHeight = 30;
        const colWidth = (width - 2 * margin) / tableHeader.length;

        tableHeader.forEach((header, i) => {
          page.drawText(header, {
            x: margin + i * colWidth,
            y: height - margin,
            size: 12,
            color: rgb(0, 0, 0),
          });
        });

        tableData.forEach((row, rowIndex) => {
          row.forEach((cell, colIndex) => {
            page.drawText(cell, {
              x: margin + colIndex * colWidth,
              y: height - margin - (rowIndex + 1) * rowHeight,
              size: 10,
              color: rgb(0, 0, 0),
            });
          });
        });

        const pdfBytes = await pdfDoc.save();
        return Buffer.from(pdfBytes);
      }
    };
  },
}; 
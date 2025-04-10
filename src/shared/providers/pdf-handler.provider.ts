import { Injectable } from '@nestjs/common';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable()
export class PdfHandlerProvider {
  async splitPdf(buffer: Buffer): Promise<Buffer[]> {
    const pdfDoc = await PDFDocument.load(buffer);
    const pages = pdfDoc.getPages();
    const pageBuffers: Buffer[] = [];

    for (let i = 0; i < pages.length; i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(copiedPage);
      const pdfBytes = await newPdf.save();
      pageBuffers.push(Buffer.from(pdfBytes));
    }

    return pageBuffers;
  }

  async createPdfReport(bills: any[]): Promise<Buffer> {
    const doc = new jsPDF();

    const tableData = bills.map(bill => [
      bill.id,
      bill.nome_sacado,
      bill.id_lote,
      bill.valor,
      bill.linha_digitavel
    ]);

    autoTable(doc, {
      head: [['ID', 'Nome', 'Lote', 'Valor', 'Linha Digitável']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 40 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 'auto' }
      }
    });

    return Buffer.from(doc.output('arraybuffer'));
  }

  async createTestPdf(): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Página 1 - MARCIA
    const page1 = pdfDoc.addPage();
    page1.drawText('BOLETO - MARCIA CARVALHO', {
      x: 50,
      y: page1.getHeight() - 100,
      font,
      size: 24,
    });

    // Página 2 - JOSE
    const page2 = pdfDoc.addPage();
    page2.drawText('BOLETO - JOSE DA SILVA', {
      x: 50,
      y: page2.getHeight() - 100,
      font,
      size: 24,
    });

    // Página 3 - MARCOS
    const page3 = pdfDoc.addPage();
    page3.drawText('BOLETO - MARCOS ROBERTO', {
      x: 50,
      y: page3.getHeight() - 100,
      font,
      size: 24,
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }
} 
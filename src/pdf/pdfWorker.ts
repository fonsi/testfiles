import { FileWorkerResponse } from '@/shared/fileWorker';
import { PDFDocument, StandardFonts, rgb, PDFFont } from 'pdf-lib';
import { PdfGeneratorData } from './types';
const generatePdfWithContent = async (
  pdfDoc: PDFDocument,
  font: PDFFont,
  title: string,
  content: string,
  pages: number,
  textMultiplier: number
): Promise<Uint8Array> => {
  // Clear existing pages
  const pageCount = pdfDoc.getPageCount();
  for (let i = pageCount - 1; i >= 0; i--) {
    pdfDoc.removePage(i);
  }

  // Generate the text content
  const textToAdd = content.repeat(textMultiplier);

  // Create pages with content
  for (let i = 0; i < pages; i++) {
    const page = pdfDoc.addPage([595, 842]);
    
    // Add title
    page.drawText(title, {
      x: 50,
      y: 800,
      size: 24,
      font,
      color: rgb(0, 0, 0),
    });
    
    // Add page number
    page.drawText(`Page ${i + 1} of ${pages}`, {
      x: 50,
      y: 50,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });
    
    // Add content
    page.drawText(textToAdd, {
      x: 50,
      y: 750,
      size: 12,
      font,
      color: rgb(0, 0, 0),
      maxWidth: 495,
    });
  }

  return await pdfDoc.save();
};

const generatePdf = async ({ size, title = 'Generated PDF', content }: PdfGeneratorData): Promise<Uint8Array> => {
  // Validate target size
  if (size < 2000) {
    throw new Error('Target size must be at least 2KB');
  }
  if (size > 10 * 1024 * 1024) { // 10MB limit
    throw new Error('Target size cannot exceed 10MB');
  }

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  // Base text to use
  const baseText = content || 'This is filler text to reach the target file size. ';
  
  // Start with a reasonable number of pages
  const pages = Math.max(1, Math.ceil(size / 5000));
  
  // Binary search for the right text multiplier
  let low = 1;
  let high = Math.ceil(size / 200); // Reduced initial high value
  let bestMultiplier = 1;
  let bestSize = 0;
  let bestPages = pages;
  
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const pdfBytes = await generatePdfWithContent(pdfDoc, font, title, baseText, pages, mid);
    const currentSize = pdfBytes.length;
    
    if (currentSize <= size) {
      bestMultiplier = mid;
      bestSize = currentSize;
      bestPages = pages;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  
  // If we're still under the target size, try increasing pages
  if (bestSize < size) {
    let currentPages = pages;
    while (bestSize < size && currentPages < 100) { // Limit to 100 pages
      currentPages++;
      const pdfBytes = await generatePdfWithContent(pdfDoc, font, title, baseText, currentPages, bestMultiplier);
      const currentSize = pdfBytes.length;
      
      if (currentSize <= size) {
        bestSize = currentSize;
        bestPages = currentPages;
      } else {
        break; // Stop if we overshoot
      }
    }
  }
  
  // Generate final PDF with the best parameters
  return await generatePdfWithContent(pdfDoc, font, title, baseText, bestPages, bestMultiplier);
};

// Listen for messages from the main thread
self.onmessage = async (event: MessageEvent) => {
  try {
    const data = event.data as PdfGeneratorData;
    const pdfBytes = await generatePdf(data);
    
    // Send the result back to the main thread
    self.postMessage({ success: true, file: pdfBytes } as FileWorkerResponse);
  } catch (error) {
    // Send any errors back to the main thread
    self.postMessage({ success: false, error: error instanceof Error ? error.message : 'Unknown error' } as FileWorkerResponse);
  }
}; 
import { FileWorkerResponse } from '@/shared/fileWorker';
import { PdfGeneratorData } from './types';

export const generatePdf = async (data: PdfGeneratorData): Promise<Uint8Array> => {
  return new Promise((resolve, reject) => {
    // Create a new Web Worker
    const worker = new Worker(new URL('./pdfWorker.ts', import.meta.url), {
      type: 'module'
    });

    // Set up message handler
    worker.onmessage = (event) => {
      const { success, file, error } = event.data as FileWorkerResponse;
      
      if (success) {
        resolve(file);
      } else {
        reject(new Error(error));
      }
      
      // Terminate the worker
      worker.terminate();
    };

    // Set up error handler
    worker.onerror = (error) => {
      reject(error);
      worker.terminate();
    };

    // Send the options to the worker
    worker.postMessage(data);
  });
}; 
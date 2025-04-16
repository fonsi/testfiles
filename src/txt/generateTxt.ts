import { TxtGeneratorData } from './txtGenerator';
import { FileWorkerResponse } from '@/shared/fileWorker';

export const generateTxt = async (data: TxtGeneratorData): Promise<Uint8Array> => {
  return new Promise((resolve, reject) => {
    // Create a new Web Worker
    const worker = new Worker(new URL('./txtWorker.ts', import.meta.url), {
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
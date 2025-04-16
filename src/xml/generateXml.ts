import { XmlGeneratorData } from './xmlGenerator';
import { FileWorkerResponse } from '@/shared/fileWorker';

export const generateXml = (data: XmlGeneratorData): Promise<Uint8Array> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./xmlWorker.ts', import.meta.url), {
      type: 'module',
    });

    worker.onmessage = (event: MessageEvent<FileWorkerResponse>) => {
      worker.terminate();
      if (event.data.success) {
        resolve(event.data.file);
      } else {
        reject(new Error(event.data.error));
      }
    };

    worker.onerror = (error) => {
      worker.terminate();
      reject(error);
    };

    worker.postMessage(data);
  });
}; 
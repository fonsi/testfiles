import { FileWorkerResponse } from "@/shared/fileWorker";
import { CsvGeneratorData } from "./csvGenerator";

const generateRandomData = (type: 'string' | 'number' | 'date'): string => {
  switch (type) {
    case 'string':
      return `Text${Math.floor(Math.random() * 1000)}`;
    case 'number':
      return (Math.random() * 1000).toFixed(2);
    case 'date':
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 365));
      return date.toISOString().split('T')[0];
  }
};

const generateCsv = async ({ size, columns = 5 }: CsvGeneratorData): Promise<Uint8Array> => {
  // Validate target size
  if (size < 100) {
    throw new Error('Target size must be at least 100 bytes');
  }
  if (size > 10 * 1024 * 1024) { // 10MB limit
    throw new Error('Target size cannot exceed 10MB');
  }

  // Define column types
  const columnTypes: ('string' | 'number' | 'date')[] = [
    'string' as const,
    'number' as const,
    'date' as const,
    'string' as const,
    'number' as const
  ].slice(0, columns);

  // Generate headers
  const headers = columnTypes.map((_, i) => `Column${i + 1}`);
  let content = headers.join(',') + '\n';

  // Generate rows
  let currentSize = content.length;

  while (currentSize < size) {
    // Calculate the remaining size for this row
    const remainingSize = size - currentSize;
    const maxRowSize = remainingSize - 1; // -1 for the newline

    // Generate row data
    const rowData = columnTypes.map(type => {
      if (currentSize + maxRowSize >= size) {
        // For the last row, we need to adjust the content to match the exact size
        const remainingColumns = columnTypes.length;
        const maxColumnSize = Math.floor(maxRowSize / remainingColumns) - 1; // -1 for the comma
        return generateRandomData(type).slice(0, maxColumnSize);
      }
      return generateRandomData(type);
    });

    // Join the row data with commas
    const row = rowData.join(',');
    content += row + '\n';
    currentSize += row.length + 1; // +1 for the newline
  }

  // Trim to exact size if needed
  if (currentSize > size) {
    content = content.slice(0, size);
  }

  // Convert to Uint8Array
  const encoder = new TextEncoder();
  return encoder.encode(content);
};

// Listen for messages from the main thread
self.onmessage = async (event: MessageEvent) => {
  try {
    const data = event.data as CsvGeneratorData;
    const csvBytes = await generateCsv(data);
    
    // Send the result back to the main thread
    self.postMessage({ success: true, file: csvBytes } as FileWorkerResponse);
  } catch (error) {
    // Send any errors back to the main thread
    const errorMessage = error instanceof Error ? error.message : String(error);
    self.postMessage({ success: false, error: errorMessage } as FileWorkerResponse);
  }
}; 
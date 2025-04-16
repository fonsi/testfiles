import { FileWorkerResponse } from "@/shared/fileWorker";
import { XmlGeneratorData } from "./xmlGenerator";

const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateRandomValue = (): string => {
  const types = ['string', 'number', 'date'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  switch (type) {
    case 'string':
      return generateRandomString(Math.floor(Math.random() * 10) + 5);
    case 'number':
      return (Math.random() * 1000).toFixed(2);
    case 'date':
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 365));
      return date.toISOString().split('T')[0];
    default:
      return generateRandomString(Math.floor(Math.random() * 10) + 5);
  }
};

const generateXml = async ({ size, attributes = 3 }: Omit<XmlGeneratorData, 'elements'>): Promise<Uint8Array> => {
  // Validate target size
  if (size < 100) {
    throw new Error('Target size must be at least 100 bytes');
  }
  if (size > 10 * 1024 * 1024) { // 10MB limit
    throw new Error('Target size cannot exceed 10MB');
  }

  // Start with XML declaration and root element
  const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const rootStart = '<root>\n';
  const rootEnd = '</root>';
  
  // Calculate available space for elements
  const fixedContentSize = xmlDeclaration.length + rootStart.length + rootEnd.length;
  const availableSize = size - fixedContentSize;
  
  if (availableSize <= 0) {
    throw new Error('Target size is too small to generate valid XML');
  }

  // Generate elements until we reach the target size
  let content = '';
  let currentSize = 0;
  
  while (currentSize < availableSize) {
    const elementName = `element${content.split('\n').length}`;
    let elementContent = `  <${elementName}`;

    // Add attributes
    for (let j = 0; j < attributes; j++) {
      const attrName = `attr${j + 1}`;
      const attrValue = generateRandomValue();
      elementContent += ` ${attrName}="${attrValue}"`;
    }

    // Calculate remaining space for the element value
    const elementStartSize = elementContent.length + 2; // +2 for '>'
    const elementEndSize = `</${elementName}>\n`.length;
    const maxValueSize = availableSize - (currentSize + elementStartSize + elementEndSize);
    
    if (maxValueSize <= 0) {
      break;
    }

    // Generate a value that fits in the remaining space
    const valueSize = Math.min(maxValueSize, Math.floor(Math.random() * 50) + 10);
    const elementValue = generateRandomString(valueSize);
    
    elementContent += `>${elementValue}</${elementName}>\n`;
    
    // Check if adding this element would exceed the target size
    if (currentSize + elementContent.length > availableSize) {
      break;
    }

    content += elementContent;
    currentSize += elementContent.length;
  }

  // Combine all parts
  const finalContent = xmlDeclaration + rootStart + content + rootEnd;
  
  // Convert to Uint8Array
  const encoder = new TextEncoder();
  return encoder.encode(finalContent);
};

// Listen for messages from the main thread
self.onmessage = async (event: MessageEvent) => {
  try {
    const data = event.data as XmlGeneratorData;
    const xmlBytes = await generateXml(data);
    
    // Send the result back to the main thread
    self.postMessage({ success: true, file: xmlBytes } as FileWorkerResponse);
  } catch (error) {
    // Send any errors back to the main thread
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    self.postMessage({ success: false, error: errorMessage } as FileWorkerResponse);
  }
}; 
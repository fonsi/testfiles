import { FileWorkerResponse } from "@/shared/fileWorker";
import { TxtGeneratorData } from "./txtGenerator";

const loremIpsum = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.",
  "Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.",
  "Integer in mauris eu nibh euismod gravida.",
  "Duis ac tellus et risus vulputate vehicula.",
  "Donec lobortis risus a elit.",
  "Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam.",
  "Maecenas fermentum consequat mi.",
  "Donec fermentum. Pellentesque malesuada nulla a mi.",
  "Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque.",
  "Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat.",
  "Cras mollis scelerisque nunc.",
  "Nullam arcu. Aliquam consequat.",
  "Curabitur augue lorem, dapibus quis, laoreet et, pretium ac, nisi.",
  "Aenean magna nisl, mollis quis, molestie eu, feugiat in, orci.",
  "In hac habitasse platea dictumst."
];

const generateTxt = async ({ size }: TxtGeneratorData): Promise<Uint8Array> => {
  // Validate target size
  if (size < 100) {
    throw new Error('Target size must be at least 100 bytes');
  }
  if (size > 10 * 1024 * 1024) { // 10MB limit
    throw new Error('Target size cannot exceed 10MB');
  }

  // Calculate average paragraph length including newlines
  const avgParagraphLength = loremIpsum.reduce((sum, p) => sum + p.length + 2, 0) / loremIpsum.length;
  
  // Calculate how many full paragraphs we can fit
  const fullParagraphs = Math.floor(size / avgParagraphLength);
  const remainingSize = size - (fullParagraphs * avgParagraphLength);

  let content = '';
  
  // Add full paragraphs
  for (let i = 0; i < fullParagraphs; i++) {
    const paragraph = loremIpsum[Math.floor(Math.random() * loremIpsum.length)];
    content += paragraph + '\n\n';
  }

  // If we have remaining space, add a partial paragraph
  if (remainingSize > 0) {
    const paragraph = loremIpsum[Math.floor(Math.random() * loremIpsum.length)];
    content += paragraph.slice(0, remainingSize - 2) + '\n\n';
  }

  // Convert to Uint8Array and verify size
  const encoder = new TextEncoder();
  const bytes = encoder.encode(content);
  
  if (bytes.length !== size) {
    // If we're still off, adjust by adding or removing characters
    const diff = size - bytes.length;
    if (diff > 0) {
      content += ' '.repeat(diff);
    } else if (diff < 0) {
      content = content.slice(0, content.length + diff);
    }
  }

  return encoder.encode(content);
};

// Listen for messages from the main thread
self.onmessage = async (event: MessageEvent) => {
  try {
    const data = event.data as TxtGeneratorData;
    const txtBytes = await generateTxt(data);
    
    // Send the result back to the main thread
    self.postMessage({ success: true, file: txtBytes } as FileWorkerResponse);
  } catch (error) {
    // Send any errors back to the main thread
    self.postMessage({ success: false, error: error instanceof Error ? error.message : 'Unknown error' } as FileWorkerResponse);
  }
}; 
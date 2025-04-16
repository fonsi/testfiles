import { FileWorkerResponse } from "@/shared/fileWorker";
import { PngGeneratorData } from "./pngGenerator";

const generatePng = async ({ size, width, height }: PngGeneratorData): Promise<Uint8Array> => {
  // Validate target size
  if (size < 1000) {
    throw new Error('Target size must be at least 1KB');
  }
  if (size > 10 * 1024 * 1024) { // 10MB limit
    throw new Error('Target size cannot exceed 10MB');
  }

  // Calculate initial dimensions based on target size
  // For PNG, we estimate that each pixel takes about 4 bytes (RGBA)
  const baseSize = Math.sqrt(size / 4);
  let currentWidth = Math.max(100, Math.min(4000, Math.floor(baseSize)));
  let currentHeight = Math.max(100, Math.min(4000, Math.floor(baseSize * 0.75)));

  // Create a canvas element
  const canvas = new OffscreenCanvas(currentWidth, currentHeight);
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Fill the canvas with a complex pattern to increase file size
  const gradient1 = ctx.createLinearGradient(0, 0, currentWidth, currentHeight);
  gradient1.addColorStop(0, '#ff0000');
  gradient1.addColorStop(0.5, '#00ff00');
  gradient1.addColorStop(1, '#0000ff');
  
  const gradient2 = ctx.createLinearGradient(0, currentHeight, currentWidth, 0);
  gradient2.addColorStop(0, '#ffff00');
  gradient2.addColorStop(0.5, '#00ffff');
  gradient2.addColorStop(1, '#ff00ff');
  
  // Draw multiple overlapping gradients
  ctx.fillStyle = gradient1;
  ctx.fillRect(0, 0, currentWidth, currentHeight);
  ctx.fillStyle = gradient2;
  ctx.globalAlpha = 0.5;
  ctx.fillRect(0, 0, currentWidth, currentHeight);
  ctx.globalAlpha = 1.0;

  // Add more complex noise pattern
  const imageData = ctx.getImageData(0, 0, currentWidth, currentHeight);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    // Add more complex noise to each pixel
    const noise = Math.sin(i * 0.1) * 50 + Math.cos(i * 0.05) * 30;
    data[i] = (data[i] + noise) % 255;
    data[i + 1] = (data[i + 1] + noise * 0.7) % 255;
    data[i + 2] = (data[i + 2] + noise * 0.3) % 255;
    data[i + 3] = 255; // Full opacity for PNG
  }
  
  ctx.putImageData(imageData, 0, 0);

  // Binary search for the right dimensions
  let blob = await canvas.convertToBlob({ type: 'image/png' });
  let currentSize = blob.size;
  
  // Adjust dimensions to match target size
  while (Math.abs(currentSize - size) > size * 0.1) {
    if (currentSize < size) {
      // Increase dimensions
      currentWidth = Math.min(4000, Math.floor(currentWidth * 1.1));
      currentHeight = Math.min(4000, Math.floor(currentHeight * 1.1));
    } else {
      // Decrease dimensions
      currentWidth = Math.max(100, Math.floor(currentWidth * 0.9));
      currentHeight = Math.max(100, Math.floor(currentHeight * 0.9));
    }
    
    // Recreate canvas with new dimensions
    canvas.width = currentWidth;
    canvas.height = currentHeight;
    
    // Redraw content
    ctx.fillStyle = gradient1;
    ctx.fillRect(0, 0, currentWidth, currentHeight);
    ctx.fillStyle = gradient2;
    ctx.globalAlpha = 0.5;
    ctx.fillRect(0, 0, currentWidth, currentHeight);
    ctx.globalAlpha = 1.0;
    
    // Add noise
    const newImageData = ctx.getImageData(0, 0, currentWidth, currentHeight);
    const newData = newImageData.data;
    for (let i = 0; i < newData.length; i += 4) {
      const noise = Math.sin(i * 0.1) * 50 + Math.cos(i * 0.05) * 30;
      newData[i] = (newData[i] + noise) % 255;
      newData[i + 1] = (newData[i + 1] + noise * 0.7) % 255;
      newData[i + 2] = (newData[i + 2] + noise * 0.3) % 255;
      newData[i + 3] = 255; // Full opacity for PNG
    }
    ctx.putImageData(newImageData, 0, 0);
    
    blob = await canvas.convertToBlob({ type: 'image/png' });
    currentSize = blob.size;
  }

  return new Uint8Array(await blob.arrayBuffer());
};

// Listen for messages from the main thread
self.onmessage = async (event: MessageEvent) => {
  try {
    const data = event.data as PngGeneratorData;
    const pngBytes = await generatePng(data);
    
    // Send the result back to the main thread
    self.postMessage({ success: true, file: pngBytes } as FileWorkerResponse);
  } catch (error) {
    // Send any errors back to the main thread
    self.postMessage({ success: false, error: error instanceof Error ? error.message : 'Unknown error' } as FileWorkerResponse);
  }
}; 
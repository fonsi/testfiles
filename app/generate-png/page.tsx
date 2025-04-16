"use client"

import { GeneratePage } from '@/shared/components/GeneratePage';
import { generatePng } from '@/png/generatePng';

export default function GeneratePng() {
  const handleGenerate = async (size: number) => {
    const pngData = await generatePng({
      fileType: 'png',
      size,
      width: 800,
      height: 600
    });

    // Create a blob and download link
    const blob = new Blob([pngData], { type: 'image/png' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dummy-${size}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return <GeneratePage fileType="PNG" onGenerate={handleGenerate} />;
} 
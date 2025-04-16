"use client"

import { GeneratePage } from '@/shared/components/GeneratePage';
import { generateTxt } from '@/txt/generateTxt';

export default function GenerateTxt() {
  const handleGenerate = async (size: number) => {
    const txtData = await generateTxt({
      fileType: 'txt',
      size
    });

    // Create a blob and download link
    const blob = new Blob([txtData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dummy-${size}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return <GeneratePage fileType="TXT" onGenerate={handleGenerate} />;
} 
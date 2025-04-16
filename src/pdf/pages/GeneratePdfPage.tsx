'use client';

import React from 'react';
import GeneratePage from '@/shared/components/GeneratePage';
import { generatePdf } from '../generatePdf';

export const GeneratePdfPage: React.FC = () => {
  const handleGenerate = async (size: number) => {
    const pdfBytes = await generatePdf({
      size,
      fileType: 'PDF',
      title: 'Generated PDF File',
      content: 'This is a test content to reach the target file size.'
    });
    
    // Create blob and download
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-${size}-bytes.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative">
      <GeneratePage
        fileType="PDF"
        onGenerate={handleGenerate}
      />
    </div>
  );
};
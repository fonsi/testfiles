'use client';

import React from 'react';
import GeneratePage from '@/shared/components/GeneratePage';
import { generateJpg } from '../generateJpg';

export const GenerateJpgPage: React.FC = () => {
  const handleGenerate = async (size: number) => {
    const jpgBytes = await generateJpg({
      size,
      fileType: 'JPG',
      width: 800,
      height: 600,
    });
    
    // Create blob and download
    const blob = new Blob([jpgBytes], { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-${size}-bytes.jpg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative">
      <GeneratePage
        fileType="JPG"
        onGenerate={handleGenerate}
      />
    </div>
  );
}; 
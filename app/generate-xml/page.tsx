'use client';

import { GeneratePage } from '@/shared/components/GeneratePage';
import { generateXml } from '@/xml/generateXml';

export default function GenerateXmlPage() {
  const handleGenerate = async (size: number, options?: { elements?: number; attributes?: number }) => {
    const file = await generateXml({
      fileType: 'xml',
      size,
      elements: options?.elements || 5,
      attributes: options?.attributes || 3,
    });

    // Create a download link
    const blob = new Blob([file], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dummy-${size}-bytes.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return <GeneratePage fileType="XML" onGenerate={handleGenerate} />;
} 
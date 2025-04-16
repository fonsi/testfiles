"use client"

import { GeneratePage } from '@/shared/components/GeneratePage';
import { generateCsv } from '@/csv/generateCsv';

export default function GenerateCsv() {
  const handleGenerate = async (size: number) => {
    const csvData = await generateCsv({
      fileType: 'csv',
      size,
      columns: 5,
      rows: 100
    });

    // Create a blob and download link
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dummy-${size}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return <GeneratePage fileType="CSV" onGenerate={handleGenerate} />;
} 
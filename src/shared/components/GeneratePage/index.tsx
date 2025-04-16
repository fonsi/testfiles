import React, { useState } from 'react';
import styles from './styles.module.css';

interface GeneratePageProps {
  fileType: string;
  onGenerate: (size: number) => Promise<void>;
}

const scales = [
  { label: 'Bytes (B)', value: 1 },
  { label: 'Kilobytes (KB)', value: 1024 },
  { label: 'Megabytes (MB)', value: 1048576 },
];

type Status = 'idle' | 'loading' | 'success' | 'error';

export const GeneratePage: React.FC<GeneratePageProps> = ({ fileType, onGenerate }) => {
  const [size, setSize] = useState<number>(100);
  const [selectedScale, setSelectedScale] = useState<number>(1024); // Default to KB
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    
    try {
      await onGenerate(size * selectedScale);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'An error occurred while generating the file');
    }
  };

  const resetForm = () => {
    setStatus('idle');
    setError('');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Generate {fileType} File</h1>
      
      {status === 'success' ? (
        <div className={styles.successContainer}>
          <div className={styles.successMessage}>File generated successfully!</div>
          <button
            onClick={resetForm}
            className={styles.button}
          >
            Generate Another File
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputsContainer}>
            <input
              type="number"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              min="1"
              disabled={status === 'loading'}
              className={styles.input}
            />
            <select
              value={selectedScale}
              onChange={(e) => setSelectedScale(Number(e.target.value))}
              disabled={status === 'loading'}
              className={styles.select}
            >
              {scales.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {status === 'error' && (
            <div className={styles.error}>{error}</div>
          )}

          <div className={styles.buttonContainer}>
            <button
              type="submit"
              disabled={status === 'loading'}
              className={styles.button}
            >
              {status === 'loading' ? 'Generating...' : `Generate ${fileType} File`}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default GeneratePage; 
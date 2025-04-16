import React, { useState } from 'react';
import styled from 'styled-components';

interface GeneratePageProps {
  fileType: string;
  onGenerate: (size: number, options?: { elements?: number; attributes?: number }) => Promise<void>;
}

const scales = [
  { label: 'B', value: 1 },
  { label: 'KB', value: 1024 },
  { label: 'MB', value: 1048576 },
];

type Status = 'idle' | 'loading' | 'success' | 'error';

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.large};
  max-width: 768px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.large};
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
`;

const SuccessContainer = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.large};
`;

const SuccessMessage = styled.div`
  color: #059669;
  font-weight: 500;
  font-size: 1.25rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.large};
`;

const InputsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const Input = styled.input`
  width: 192px;
  height: 64px;
  padding: 0 ${({ theme }) => theme.spacing.medium};
  font-size: 2rem;
  border: none;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 0;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text};
  text-align: right;

  /* Remove number input arrows */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;

  &:focus {
    outline: none;
    border-bottom-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  width: auto;
  height: 64px;
  padding: 0 ${({ theme }) => theme.spacing.small};
  font-size: 1.25rem;
  border: none;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 0;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;

  &:focus {
    outline: none;
    border-bottom-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Error = styled.div`
  color: #dc2626;
  font-size: 1.125rem;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  width: 256px;
  height: 64px;
  font-size: 1.25rem;
  color: white;
  background-color: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(108, 99, 255, 0.5);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
  margin-top: ${({ theme }) => theme.spacing.medium};
`;

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const OptionLabel = styled.label`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const OptionInput = styled.input`
  width: 80px;
  height: 40px;
  padding: 0 ${({ theme }) => theme.spacing.small};
  font-size: 1rem;
  border: none;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 0;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text};
  text-align: right;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;

  &:focus {
    outline: none;
    border-bottom-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const GeneratePage: React.FC<GeneratePageProps> = ({ fileType, onGenerate }) => {
  const [size, setSize] = useState<number>(100);
  const [selectedScale, setSelectedScale] = useState<number>(1024); // Default to KB
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string>('');
  const [elements, setElements] = useState<number>(5);
  const [attributes, setAttributes] = useState<number>(3);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    
    try {
      const options = fileType === 'XML' ? { elements, attributes } : undefined;
      await onGenerate(size * selectedScale, options);
      setStatus('success');
    } catch (err: unknown) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'An error occurred while generating the file');
    }
  };

  const resetForm = () => {
    setStatus('idle');
    setError('');
  };

  return (
    <Container>
      <Title>Generate {fileType} File</Title>
      
      {status === 'success' ? (
        <SuccessContainer>
          <SuccessMessage>File generated successfully!</SuccessMessage>
          <Button onClick={resetForm}>
            Generate Another File
          </Button>
        </SuccessContainer>
      ) : (
        <Form onSubmit={handleSubmit}>
          <InputsContainer>
            <Input
              type="number"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              min="1"
              disabled={status === 'loading'}
            />
            <Select
              value={selectedScale}
              onChange={(e) => setSelectedScale(Number(e.target.value))}
              disabled={status === 'loading'}
            >
              {scales.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </InputsContainer>

          {fileType === 'XML' && (
            <OptionsContainer>
              <OptionRow>
                <OptionLabel>Number of Elements:</OptionLabel>
                <OptionInput
                  type="number"
                  value={elements}
                  onChange={(e) => setElements(Number(e.target.value))}
                  min="1"
                  max="1000"
                  disabled={status === 'loading'}
                />
              </OptionRow>
              <OptionRow>
                <OptionLabel>Attributes per Element:</OptionLabel>
                <OptionInput
                  type="number"
                  value={attributes}
                  onChange={(e) => setAttributes(Number(e.target.value))}
                  min="0"
                  max="10"
                  disabled={status === 'loading'}
                />
              </OptionRow>
            </OptionsContainer>
          )}

          {status === 'error' && (
            <Error>{error}</Error>
          )}

          <ButtonContainer>
            <Button
              type="submit"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Generating...' : `Generate ${fileType} File`}
            </Button>
          </ButtonContainer>
        </Form>
      )}
    </Container>
  );
};

export default GeneratePage; 
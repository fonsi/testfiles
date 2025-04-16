'use client';

import { ThemeProvider } from 'styled-components';
import { theme } from '@/shared/styles/global';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
} 
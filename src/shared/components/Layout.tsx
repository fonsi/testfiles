'use client';

import styled, { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '@/shared/styles/global';
import { Logo } from './icons/Logo';
import { theme } from '@/shared/styles/theme';
import StyledComponentsRegistry from './StyledComponentsRegistry';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.background};
  font-family: 'Quicksand', sans-serif;
`;

const Header = styled.header`
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.large} 0;
  text-align: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  svg {
    width: 48px;
    height: 48px;
    color: ${({ theme }) => theme.colors.primary};
  }

  h1 {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Main = styled.main`
  min-height: calc(100vh - 200px);
  padding: ${({ theme }) => theme.spacing.large} 0;
`;

const Footer = styled.footer`
  padding: ${({ theme }) => theme.spacing.large} 0;
  text-align: center;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={theme}>
        <Container>
          <GlobalStyle />
          <Header>
            <Logo />
            <h1>TestFiles</h1>
          </Header>
          <Main>{children}</Main>
          <Footer>
            <p>© {new Date().getFullYear()} TestFiles</p>
          </Footer>
        </Container>
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
} 
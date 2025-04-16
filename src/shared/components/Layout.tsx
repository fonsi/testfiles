'use client';

import styled from 'styled-components';
import { GlobalStyle } from '@/shared/styles/global';
import { Logo } from './icons/Logo';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.medium};
`;

const Header = styled.header`
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.large} 0;
  text-align: center;

  svg {
    width: 48px;
    height: 48px;
  }
`;

const Main = styled.main`
  min-height: calc(100vh - 200px);
`;

const Footer = styled.footer`
  padding: ${({ theme }) => theme.spacing.large} 0;
  text-align: center;
  border-top: 1px solid #eee;
`;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <Logo />
          <h1>TestFiles</h1>
        </Header>
        <Main>{children}</Main>
        <Footer>
          <p>© {new Date().getFullYear()} TestFiles</p>
        </Footer>
      </Container>
    </>
  );
} 
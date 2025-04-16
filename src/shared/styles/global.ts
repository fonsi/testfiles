'use client';

import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    font-family: 'Quicksand', sans-serif;
  }

  body {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  button {
    font-family: inherit;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    html {
      font-size: 14px;
    }
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
      opacity: 0.8;
    }
  }

  input, textarea, select {
    font-family: 'Quicksand', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
    border: 1px solid ${theme.colors.border};
    padding: 0.5rem;
    border-radius: 4px;
    
    &:focus {
      outline: none;
      border-color: ${theme.colors.primary};
    }
  }

  button {
    font-family: 'Quicksand', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: ${theme.colors.primary};
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: opacity 0.2s ease;

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
  }
`; 
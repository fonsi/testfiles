import { DefaultTheme } from 'styled-components';

export const theme: DefaultTheme = {
  colors: {
    primary: '#6C63FF', // Vibrant purple for primary actions
    secondary: '#4A90E2', // Blue for secondary elements
    background: '#1A1A1A', // Dark background
    text: '#FFFFFF', // White text
    textSecondary: '#B3B3B3', // Light gray for secondary text
    border: '#333333', // Dark border
  },
  spacing: {
    small: '0.5rem',
    medium: '1rem',
    large: '2rem',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
  },
} as const;

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
      textSecondary: string;
      border: string;
    };
    spacing: {
      small: string;
      medium: string;
      large: string;
    };
    breakpoints: {
      mobile: string;
      tablet: string;
      desktop: string;
    };
  }
}

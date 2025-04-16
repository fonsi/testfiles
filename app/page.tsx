"use client"

import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.large};
  padding: ${({ theme }) => theme.spacing.large} 0;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.large};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const CardTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const CardDescription = styled.p`
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const GenerateButton = styled.a`
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0051a2;
    text-decoration: none;
  }
`;

export default function Home() {
  return (
    <Grid>
      <Card>
        <CardTitle>PDF Generator</CardTitle>
        <CardDescription>
          Generate dummy PDF files of any size with customizable content.
        </CardDescription>
        <GenerateButton href="/generate-pdf">Generate PDF</GenerateButton>
      </Card>
      <Card>
        <CardTitle>JPG Generator</CardTitle>
        <CardDescription>
          Generate dummy JPG images of any size with customizable dimensions.
        </CardDescription>
        <GenerateButton href="/generate-jpg">Generate JPG</GenerateButton>
      </Card>
      <Card>
        <CardTitle>PNG Generator</CardTitle>
        <CardDescription>
          Generate dummy PNG images of any size with customizable dimensions.
        </CardDescription>
        <GenerateButton href="/generate-png">Generate PNG</GenerateButton>
      </Card>
      <Card>
        <CardTitle>TXT Generator</CardTitle>
        <CardDescription>
          Generate dummy text files of any size with random content.
        </CardDescription>
        <GenerateButton href="/generate-txt">Generate TXT</GenerateButton>
      </Card>
      <Card>
        <CardTitle>CSV Generator</CardTitle>
        <CardDescription>
          Generate dummy CSV files of any size with random data.
        </CardDescription>
        <GenerateButton href="/generate-csv">Generate CSV</GenerateButton>
      </Card>
    </Grid>
  );
}

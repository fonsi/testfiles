import type { Metadata } from "next";
import Providers from '@/shared/components/Providers';
import Layout from '@/shared/components/Layout';

export const metadata: Metadata = {
  title: "TestFiles Generator",
  description: "Generate dummy files of various types and sizes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}

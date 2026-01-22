import type { Metadata } from 'next';
import '../styles/globals.css';
import '../styles/ui-scale.css';
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: 'Virke - Lønnsomhet Demo',
  description: 'Virke lønnsomhet dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no">
      <body>
        <div className="ui-scale">{children}</div>
      </body>
    </html>
  );
}


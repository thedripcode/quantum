import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider }          from '@/components/providers/ThemeProvider';
import AuthProvider               from '@/components/providers/AuthProvider';
import StyledComponentsRegistry   from '@/lib/registry';

export const metadata: Metadata = {
  title:       'Sidelile High School | Excellence in Motion',
  description: 'Sidelile High School is a top-performing secondary school in Limpopo Province, South Africa. 98% matric pass rate, dedicated teachers, and a vibrant school community.',
  keywords:    'Sidelile High School, Limpopo schools, South Africa secondary school, matric results, school admissions',
  authors:     [{ name: 'Sidelile High School' }],
  openGraph: {
    title:       'Sidelile High School | Excellence in Motion',
    description: 'Top-performing secondary school in Limpopo Province, South Africa.',
    type:        'website',
    locale:      'en_ZA',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.svg" />
      </head>
      <body className="antialiased">
        <StyledComponentsRegistry>
          <AuthProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </AuthProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}

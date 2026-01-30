import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ScrollToTop } from '@/components/scroll-to-top';

const spaceGrotesk = Space_Grotesk({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: {
    default: 'Text Tips | AI Text Enhancer',
    template: '%s | Text Tips',
  },
  description:
    'Enhance your writing with Text Tips. Professional AI-powered text improvement for clarity, tone, and grammar.',
  keywords: [
    'text enhancer',
    'AI writing assistant',
    'grammar checker',
    'writing tips',
    'copywriting',
  ],
  authors: [{ name: 'Text Tips Team' }],
  creator: 'Text Tips',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://text-tips.com',
    title: 'Text Tips | AI Text Enhancer',
    description:
      'Enhance your writing with Text Tips. Professional AI-powered text improvement for clarity, tone, and grammar.',
    siteName: 'Text Tips',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Text Tips | AI Text Enhancer',
    description:
      'Enhance your writing with Text Tips. Professional AI-powered text improvement for clarity, tone, and grammar.',
    creator: '@text_tips',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${spaceGrotesk.variable} font-space-grotesk antialiased`}
      >
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}

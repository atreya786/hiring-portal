import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../lib/context/AuthContext';
import { ToastProvider } from '../lib/context/ToastContext';
import { JobProvider } from '../lib/context/JobContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { DemoPersonaBar } from '../components/demo/DemoPersonaBar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Sallet Hire — Find the Right Opportunity. Build Your Career.',
  description:
    'A smarter way to discover jobs and connect with great companies. Next-generation AI-ready hiring platform by Sallet IT Soft.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
        <AuthProvider>
          <ToastProvider>
            <JobProvider>
              <Navbar />
              <main className="flex-1 flex flex-col">{children}</main>
              <Footer />
              <DemoPersonaBar />
            </JobProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

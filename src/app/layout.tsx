import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import ScrollTriggerProvider from "@/components/ScrollTriggerProvider";
import SmoothScrollEngine from "@/components/SmoothScrollEngine";
import ScrollOptimizer from "@/components/ScrollOptimizer";
import SmartBreadcrumbs from "@/components/SmartBreadcrumbs";
import Navigation from '@/components/Navigation';
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Sang Park - Product Engineer & Builder",
  description: "Personal website of Sang Park - Product Engineer, Builder, and Creator. Showcasing projects, blog posts, and photography.",
  keywords: ["Sang Park", "Product Engineer", "Builder", "Developer", "Photography", "Blog"],
  authors: [{ name: "Sang Park" }],
  creator: "Sang Park",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: "Sang Park - Product Engineer & Builder",
    description: "Personal website of Sang Park - Product Engineer, Builder, and Creator.",
    url: "https://www.sangpark.us",
    siteName: "Sang Park",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sang Park - Product Engineer & Builder",
    description: "Personal website of Sang Park - Product Engineer, Builder, and Creator.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <SmoothScrollEngine enabled={true} duration={200}>
          <ScrollOptimizer 
            enabled={true}
            enableGPUAcceleration={true}
            enableLayoutContainment={true}
          >
            <ScrollTriggerProvider>
              <Navigation />
              <SmartBreadcrumbs 
                enabled={true}
                position="top-right"
                showProgress={true}
                autoHide={true}
              />
              {/* Phase 3: Simple Background for Fast LCP */}
              <div className="fixed inset-0 -z-10">
                {/* Simple CSS gradient for fast loading */}
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 50%, #db2777 100%)',
                    filter: 'blur(40px)',
                    transform: 'scale(1.05)'
                  }}
                />
              </div>

              {/* Main Content */}
              {children}
            </ScrollTriggerProvider>
          </ScrollOptimizer>
        </SmoothScrollEngine>
        
        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}

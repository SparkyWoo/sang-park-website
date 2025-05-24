import type { Metadata } from "next";
import "./globals.css";
import ScrollTriggerProvider from "@/components/ScrollTriggerProvider";
import SmoothScrollEngine from "@/components/SmoothScrollEngine";
import ScrollOptimizer from "@/components/ScrollOptimizer";
import SmartBreadcrumbs from "@/components/SmartBreadcrumbs";
import PageMiniMap from "@/components/PageMiniMap";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Sang Park - Product Engineer & Builder",
  description: "Personal website of Sang Park - Product Engineer, Builder, and Creator. Showcasing projects, blog posts, and photography.",
  keywords: ["Sang Park", "Product Engineer", "Builder", "Developer", "Photography", "Blog"],
  authors: [{ name: "Sang Park" }],
  creator: "Sang Park",
  openGraph: {
    title: "Sang Park - Product Engineer & Builder",
    description: "Personal website of Sang Park - Product Engineer, Builder, and Creator.",
    url: "https://sangpark.com",
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
      <body className="antialiased">
        <SmoothScrollEngine enabled={true} duration={200}>
          <ScrollOptimizer 
            enabled={true}
            enableGPUAcceleration={true}
            enableLayoutContainment={true}
          >
            <ScrollTriggerProvider>
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

              {/* Phase 2: Smart Navigation */}
              <SmartBreadcrumbs 
                enabled={true}
                position="top-right"
                showProgress={true}
                autoHide={true}
              />
              <PageMiniMap 
                enabled={true}
                position="right"
                showLabels={true}
                showProgress={true}
                autoHide={true}
                compact={false}
              />
            </ScrollTriggerProvider>
          </ScrollOptimizer>
        </SmoothScrollEngine>
        
        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}

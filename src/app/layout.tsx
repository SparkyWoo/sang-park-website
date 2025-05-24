import type { Metadata } from "next";
import "./globals.css";
import ScrollTriggerProvider from "@/components/ScrollTriggerProvider";
import SmoothScrollEngine from "@/components/SmoothScrollEngine";
import ScrollOptimizer from "@/components/ScrollOptimizer";

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
        <SmoothScrollEngine enabled={true} intensity={0.8} duration={400}>
          <ScrollOptimizer 
            enabled={true}
            enableGPUAcceleration={true}
            enableLayoutContainment={true}
          >
            <ScrollTriggerProvider>
              {children}
            </ScrollTriggerProvider>
          </ScrollOptimizer>
        </SmoothScrollEngine>
      </body>
    </html>
  );
}

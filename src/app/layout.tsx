import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import MagneticCursor from "@/components/MagneticCursor";

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
        <SmoothScrollProvider>
          <MagneticCursor />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

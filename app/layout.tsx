import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Mist & Ember Exports — Authentic Ceylon Exports",
  description:
    "Mist & Ember Exports exports authentic Sri Lankan tea, cinnamon, coconut, and other natural products.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/video/hero-leaves.mp4"
          as="video"
          type="video/mp4"
        />
      </head>
      <body className="min-h-screen bg-[#F6F3EE] text-[#083335] antialiased scroll-smooth selection:bg-[#C4A36A]/40 selection:text-[#083335]">
        {children}
      </body>
    </html>
  );
}

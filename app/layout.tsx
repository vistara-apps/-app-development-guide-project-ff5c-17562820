
import "./globals.css";
import "@coinbase/onchainkit/styles.css";
import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "FlowSplit",
  description: "Effortlessly split bills and manage shared expenses on-chain.",
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: "/hero-image.png",
      button: {
        title: "Launch FlowSplit",
        action: {
          type: "launch_frame",
          name: "FlowSplit",
          url: process.env.NEXT_PUBLIC_URL,
          splashImageUrl: "/splash.png",
          splashBackgroundColor: "#f1f5f9",
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

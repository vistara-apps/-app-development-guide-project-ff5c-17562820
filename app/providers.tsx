"use client";

import { type ReactNode } from "react";
import { base } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { ToastProvider } from "./components/ui/ToastProvider";
import { ThemeProvider } from "./hooks/useTheme";

export function Providers(props: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <MiniKitProvider
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        chain={base}
        config={{
          appearance: {
            mode: "auto",
            theme: "flowsplit-theme",
            name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "FlowSplit",
            logo: process.env.NEXT_PUBLIC_ICON_URL,
          },
        }}
      >
        <ToastProvider>
          {props.children}
        </ToastProvider>
      </MiniKitProvider>
    </ThemeProvider>
  );
}

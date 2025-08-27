"use client";

import { createContext, useContext, ReactNode } from "react";
import { Toast as ToastComponent } from "./Toast";
import { useToast, Toast } from "../../hooks/useToast";

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
  updateToast: (id: string, toast: Partial<Omit<Toast, "id">>) => void;
  clearToasts: () => void;
  success: (title: string, message?: string, options?: any) => string;
  error: (title: string, message?: string, options?: any) => string;
  info: (title: string, message?: string, options?: any) => string;
  warning: (title: string, message?: string, options?: any) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 pointer-events-none">
        {toast.toasts.map((t) => (
          <ToastComponent
            key={t.id}
            type={t.type}
            title={t.title}
            message={t.message}
            duration={t.duration}
            action={t.action}
            onClose={() => toast.removeToast(t.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  
  return context;
}


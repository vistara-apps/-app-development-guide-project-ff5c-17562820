"use client";

import { useState, useCallback, ReactNode } from "react";
import { ToastType } from "../components/ui/Toast";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: ReactNode;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    ({ type = "info", title, message, duration = 5000, action }: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const toast = { id, type, title, message, duration, action };
      
      setToasts((prevToasts) => [...prevToasts, toast]);
      
      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const updateToast = useCallback((id: string, toast: Partial<Omit<Toast, "id">>) => {
    setToasts((prevToasts) =>
      prevToasts.map((t) => (t.id === id ? { ...t, ...toast } : t))
    );
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const success = useCallback(
    (title: string, message?: string, options = {}) => {
      return addToast({ type: "success", title, message, ...options });
    },
    [addToast]
  );

  const error = useCallback(
    (title: string, message?: string, options = {}) => {
      return addToast({ type: "error", title, message, ...options });
    },
    [addToast]
  );

  const info = useCallback(
    (title: string, message?: string, options = {}) => {
      return addToast({ type: "info", title, message, ...options });
    },
    [addToast]
  );

  const warning = useCallback(
    (title: string, message?: string, options = {}) => {
      return addToast({ type: "warning", title, message, ...options });
    },
    [addToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    updateToast,
    clearToasts,
    success,
    error,
    info,
    warning,
  };
}


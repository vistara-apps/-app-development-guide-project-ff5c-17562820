"use client";

import { clsx } from "clsx";
import { ReactNode, useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  type?: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: () => void;
  action?: ReactNode;
  isVisible?: boolean;
}

export function Toast({
  type = "info",
  title,
  message,
  duration = 5000,
  onClose,
  action,
  isVisible = true,
}: ToastProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    
    const timer = setTimeout(() => {
      setIsClosing(true);
      
      // Add a small delay for the exit animation
      setTimeout(() => {
        onClose();
      }, 300);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose, isVisible]);

  if (!isVisible) return null;

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-success" />,
    error: <AlertCircle className="h-5 w-5 text-error" />,
    info: <Info className="h-5 w-5 text-info" />,
    warning: <AlertTriangle className="h-5 w-5 text-warning" />,
  };

  const bgColors = {
    success: "bg-success/10 border-success/20",
    error: "bg-error/10 border-error/20",
    info: "bg-info/10 border-info/20",
    warning: "bg-warning/10 border-warning/20",
  };

  return (
    <div
      className={clsx(
        "fixed bottom-4 right-4 z-50 max-w-md w-full md:w-auto transition-all duration-300 transform",
        isClosing ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100",
        "animate-slide-up"
      )}
      role="alert"
      aria-live="assertive"
    >
      <div
        className={clsx(
          "rounded-lg shadow-md border p-4 flex items-start",
          "bg-surface",
          bgColors[type]
        )}
      >
        <div className="flex-shrink-0 mr-3 mt-0.5">{icons[type]}</div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-text-primary">{title}</div>
          {message && <div className="mt-1 text-sm text-text-secondary">{message}</div>}
          {action && <div className="mt-3">{action}</div>}
        </div>
        <button
          onClick={() => {
            setIsClosing(true);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 ml-3 -mt-1 -mr-1 p-1 rounded-full text-text-secondary hover:text-text-primary hover:bg-border/50 focus:outline-none focus:ring-2 focus:ring-primary-300"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}


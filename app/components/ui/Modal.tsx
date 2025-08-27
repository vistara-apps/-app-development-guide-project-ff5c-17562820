
"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-surface rounded-lg max-w-md w-full max-h-[90vh] overflow-auto shadow-card animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-heading">{title}</h2>
          <Button variant="secondary" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

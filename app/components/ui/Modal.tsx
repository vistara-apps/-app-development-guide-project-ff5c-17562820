"use client";

import { ReactNode, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";
import { clsx } from "clsx";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  position?: 'center' | 'top';
  showCloseButton?: boolean;
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  className?: string;
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  description,
  children,
  size = 'md',
  position = 'center',
  showCloseButton = true,
  closeOnClickOutside = true,
  closeOnEsc = true,
  className
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, closeOnEsc]);

  // Trap focus inside modal
  useEffect(() => {
    if (!isOpen) return;
    
    const modalElement = modalRef.current;
    if (!modalElement) return;
    
    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };
    
    document.addEventListener('keydown', handleTabKey);
    
    // Focus first element when modal opens
    if (firstElement) {
      firstElement.focus();
    }
    
    // Prevent scrolling on body
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4'
  };

  const positionClasses = {
    center: 'items-center',
    top: 'items-start pt-16'
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnClickOutside && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={clsx(
        "fixed inset-0 z-50 flex justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm",
        positionClasses[position]
      )}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? "modal-description" : undefined}
    >
      <div 
        ref={modalRef}
        className={clsx(
          "relative bg-surface rounded-lg w-full max-h-[90vh] overflow-auto shadow-lg animate-scale-in",
          sizeClasses[size],
          className
        )}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
          <div>
            <h2 id="modal-title" className="text-heading">{title}</h2>
            {description && (
              <p id="modal-description" className="text-sm text-text-secondary mt-1">
                {description}
              </p>
            )}
          </div>
          {showCloseButton && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              aria-label="Close modal"
              className="rounded-full h-8 w-8 p-0 flex items-center justify-center"
            >
              <X size={18} />
            </Button>
          )}
        </div>
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

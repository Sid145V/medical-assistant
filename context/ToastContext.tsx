import React, { createContext, useState, useCallback, useContext } from "react";
import NotificationToast from "../components/NotificationToast";

type ToastType = 'success' | 'error' | 'warning';

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    setToast({ message, type });
  }, []);
  
  // FIX: Corrected typo in useCallback from '() of =>' to '() =>'.
  const handleClose = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <NotificationToast
          message={toast.message}
          type={toast.type}
          onClose={handleClose}
        />
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
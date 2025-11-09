import React, { useEffect } from "react";

interface NotificationToastProps {
    message: string;
    type?: "success" | "error" | "warning";
    onClose: () => void;
}

export default function NotificationToast({ message, type = "success", onClose }: NotificationToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: "bg-[#0f9d92]",
    error: "bg-red-500",
    warning: "bg-yellow-500",
  };

  return (
    <div
      className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium animate-fade-in z-50 ${colors[type]}`}
    >
      {message}
    </div>
  );
}
"use client";
import { useState, createContext, useContext } from "react";

type ToastType = "success" | "error" | "warning" | "info";
interface Toast { id: number; type: ToastType; message: string }
interface ToastContextType { showToast: (msg: string, type?: ToastType) => void }

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });
export const useToast = () => useContext(ToastContext);

let toastId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = "success") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  const icons: Record<ToastType, string> = {
    success: "✓", error: "✕", warning: "⚠", info: "ℹ",
  };
  const colors: Record<ToastType, string> = {
    success: "#22c55e", error: "#ef4444", warning: "#f59e0b", info: "#0891b2",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2" style={{ maxWidth: "360px" }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-white text-sm font-medium"
            style={{
              background: colors[t.type],
              animation: "fadeUp 0.3s ease-out",
              boxShadow: `0 8px 24px ${colors[t.type]}55`,
            }}
          >
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs flex-shrink-0">
              {icons[t.type]}
            </span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

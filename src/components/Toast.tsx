import { useEffect, useState } from "react";

interface ToastState {
  message: string;
  visible: boolean;
}

let showToastFn: ((msg: string) => void) | null = null;

export function showToast(message: string) {
  showToastFn?.(message);
}

export function ToastContainer() {
  const [toast, setToast] = useState<ToastState>({ message: "", visible: false });

  useEffect(() => {
    showToastFn = (message: string) => {
      setToast({ message, visible: true });
      setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
    };
    return () => { showToastFn = null; };
  }, []);

  if (!toast.visible) return null;

  return <div className="toast">{toast.message}</div>;
}

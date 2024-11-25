import { ReactNode } from "react";
import cn from "~/utils/cn";

interface DesktopModalProps {
  show: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function DesktopModal({ show, onClose, children }: DesktopModalProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50",
        show ? "flex" : "hidden"
      )}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg p-8 max-w-md">{children}</div>
    </div>
  );
}

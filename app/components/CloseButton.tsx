import { XCircleIcon } from "@heroicons/react/24/outline";

export function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="absolute top-2 right-2">
      <button
        type="button"
        aria-label="Close"
        onClick={onClick}
        className="rounded-md hover:bg-slate-200 h-10 w-10 flex items-center justify-center"
      >
        <XCircleIcon className="h-6 w-6 text-slate-500" />
      </button>
    </div>
  );
}

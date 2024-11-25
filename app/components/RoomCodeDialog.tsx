import { useState } from "react";
import cn from "~/utils/cn";
import { DesktopModal } from "./DesktopModal";

export function RoomCodeDialog({
  show,
  onClose,
  onSubmit,
  bigScreenUrl,
}: {
  show: boolean;
  onClose: () => void;
  onSubmit: (code: string | null) => void;
  bigScreenUrl: string;
}) {
  const [code, setCode] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);

  const handleInputChange = (index: number, value: string) => {
    if (!/^[A-Za-z]?$/.test(value)) return;

    setError(false);
    const newCode = [...code];
    newCode[index] = value.toUpperCase();
    setCode(newCode);

    // Auto-advance to next input
    if (value && index < 3) {
      const nextInput = document.querySelector<HTMLInputElement>(
        `#code-input-${index + 1}`
      );
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.querySelector<HTMLInputElement>(
        `#code-input-${index - 1}`
      );
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text").toUpperCase();

    // Check if pasted text matches room code format
    if (!/^[A-Z]{4}$/.test(pastedText)) return;

    // Fill in the code inputs
    const newCode = pastedText.split("");
    setCode(newCode);
    setError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length !== 4) {
      if (error) {
        // If already showing error, submit anyway
        reset();
        onSubmit(null);
        return;
      }
      setError(true);
      return;
    }
    reset();
    onSubmit(fullCode);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const reset = () => {
    setCode(["", "", "", ""]);
    setError(false);
  };

  return (
    <DesktopModal show={show} onClose={handleClose}>
      <h3 className="text-2xl font-bold uppercase text-watercourse-900 mb-4">
        {bigScreenUrl}
      </h3>
      <p className="text-watercourse-700 mb-6">
        Enter the 4-letter room code from{" "}
        <a className="font-semibold">flop.party</a> on your phone below.
      </p>

      <form
        onSubmit={handleSubmit}
        className={cn(error ? "space-y-2" : "space-y-8")}
      >
        <div className="flex justify-center gap-3">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-input-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={cn(
                "w-14 h-14 text-center text-2xl font-bold uppercase text-watercourse-900",
                "bg-mystic-50 rounded-lg focus:outline-none",
                "transition-colors duration-200",
                error
                  ? "border-2 border-red-500"
                  : "border-2 border-watercourse-800 focus:border-watercourse-500"
              )}
            />
          ))}
        </div>

        <div className="flex flex-col gap-2 justify-center">
          {error && (
            <p className="text-red-600 text-center font-medium">
              Please enter a valid 4-letter room code
            </p>
          )}
          <div className="flex gap-4 justify-center">
            <button
              type="submit"
              className="bg-watercourse-600 text-white px-6 py-3 rounded-lg font-semibold uppercase hover:bg-watercourse-700 transition-colors"
            >
              {error ? "Open Anyway" : `Open Big Screen`}
            </button>
            <button
              type="reset"
              onClick={handleClose}
              className="border-2 border-watercourse-600 text-watercourse-600 px-6 py-3 rounded-lg font-semibold uppercase hover:bg-watercourse-50 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </form>
    </DesktopModal>
  );
}

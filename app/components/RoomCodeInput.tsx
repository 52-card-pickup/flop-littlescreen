import { ClipboardEvent, FocusEvent, FormEvent, KeyboardEvent } from "react";
import FlopButton from "~/components/FlopButton";
import React from "react";

export function RoomCodeInput({
  submitLabel,
  onSubmit,
}: {
  submitLabel?: string;
  onSubmit: (code: string) => Promise<{ reset: boolean } | undefined> | void;
}) {
  const inputContainerRef = React.useRef<HTMLDivElement>(null);
  const submitRef = React.useRef<HTMLButtonElement>(null);

  const [inputs, setInputs] = React.useState<HTMLInputElement[]>([]);
  const [disabled, setDisabled] = React.useState(false);

  React.useEffect(() => {
    if (!inputContainerRef.current) return;

    const inputs = [
      ...inputContainerRef.current.querySelectorAll("input[type=text]"),
    ];

    setInputs(inputs as HTMLInputElement[]);
  }, [inputContainerRef.current]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    async function submit() {
      try {
        setDisabled(true);
        const result = await onSubmit(code);
        if (result?.reset) {
          inputs.forEach((input) => (input.value = ""));
          inputs[0]?.focus();
        }
      } finally {
        setDisabled(false);
      }
    }

    e.preventDefault();
    const code = inputs
      .map((input) => input.value)
      .join("")
      .toUpperCase();

    submit();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const key = e.key;

    if (
      !/^[A-z]{1}$/.test(key) &&
      key !== "Backspace" &&
      key !== "Delete" &&
      key !== "Tab" &&
      !e.metaKey
    ) {
      e.preventDefault();
    }

    if ((key === "Delete" || key === "Backspace") && e.target) {
      const index = inputs.indexOf(e.target as HTMLInputElement);
      const curr = index >= 0 ? inputs[index] : null;
      if (curr) {
        curr.value = "";
      }
      const prev = index > 0 ? inputs[index - 1] : null;
      if (prev) {
        prev.value = "";
        prev.focus();
      }
    }
  }

  function handleInput(e: FormEvent<HTMLInputElement>) {
    const index = inputs.indexOf(e.target as HTMLInputElement);
    if ((e.target as HTMLInputElement | null)?.value) {
      const hasNextInput = index < inputs.length - 1;
      if (hasNextInput) {
        inputs[index + 1]?.focus();
      } else {
        submitRef.current?.focus();
      }
    }
  }

  function handleFocus(e: FocusEvent<HTMLInputElement>) {
    (e.target as HTMLInputElement | null)?.select();
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const text = e.clipboardData?.getData("text");
    if (
      typeof text === "undefined" ||
      !new RegExp(`^[A-z]{${inputs.length}}$`).test(text)
    ) {
      return;
    }
    const digits = text.split("");
    inputs.forEach((input, index) => (input.value = digits[index] || ""));

    const submitBtn = submitRef.current;
    if (!submitBtn) {
      return;
    }

    setDisabled(true);
    submitBtn.focus();
    submitBtn.disabled = true;
    setTimeout(() => {
      setDisabled(false);
      submitBtn.disabled = false;
      submitBtn.click();
    }, 500);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="flex items-center justify-center gap-3 animate-scaleIn"
        ref={inputContainerRef}
      >
        <input
          type="text"
          aria-label="Room code character 1"
          className="w-14 h-14 text-center text-2xl font-extrabold uppercase text-watercourse-800 bg-slate-200 border border-transparent hover:border-slate-300 appearance-none rounded p-4 outline-none focus:bg-white focus:border-watercourse-600 focus:ring-2 focus:ring-watercourse-100"
          pattern="[A-z]*"
          maxLength={1}
          disabled={disabled}
          onInput={handleInput}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
        />
        <input
          type="text"
          aria-label="Room code character 2"
          className="w-14 h-14 text-center text-2xl font-extrabold uppercase text-watercourse-800 bg-slate-200 border border-transparent hover:border-slate-300 appearance-none rounded p-4 outline-none focus:bg-white focus:border-watercourse-600 focus:ring-2 focus:ring-watercourse-100"
          maxLength={1}
          disabled={disabled}
          onInput={handleInput}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
        />
        <input
          type="text"
          aria-label="Room code character 3"
          className="w-14 h-14 text-center text-2xl font-extrabold uppercase text-watercourse-800 bg-slate-200 border border-transparent hover:border-slate-300 appearance-none rounded p-4 outline-none focus:bg-white focus:border-watercourse-600 focus:ring-2 focus:ring-watercourse-100"
          maxLength={1}
          disabled={disabled}
          onInput={handleInput}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
        />
        <input
          type="text"
          aria-label="Room code character 4"
          className="w-14 h-14 text-center text-2xl font-extrabold uppercase text-watercourse-800 bg-slate-200 border border-transparent hover:border-slate-300 appearance-none rounded p-4 outline-none focus:bg-white focus:border-watercourse-600 focus:ring-2 focus:ring-watercourse-100"
          maxLength={1}
          disabled={disabled}
          onInput={handleInput}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
        />
      </div>
      <div className="max-w-[260px] mx-auto mt-10">
        <FlopButton
          type="submit"
          color="watercourse"
          variant="solid"
          label="Submit"
          className="w-full"
          ref={submitRef}
        >
          <span className="font-semibold">{submitLabel ?? "Submit"}</span>
        </FlopButton>
      </div>
    </form>
  );
}

import { Transition } from "@headlessui/react";
import {
  forwardRef,
  useState,
  useImperativeHandle,
  Fragment,
  useRef,
  createContext,
  useContext,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import { useDocument } from "~/hooks/useDocument";
import { useTimeoutState } from "~/hooks/useTimeoutState";

export type Toaster = { show: (message: string) => void };
export type ToasterProps = { duration?: number };

export const Toaster = forwardRef<Toaster, ToasterProps>((props, ref) => {
  const [message, setMessage] = useState<string | null>(null);
  const [show, setShow] = useTimeoutState(false, props.duration || 5000);
  const document = useDocument();

  useImperativeHandle(
    ref,
    () => ({
      show: (message: string) => {
        setMessage(message);
        setShow(true);
      },
    }),
    [setMessage]
  );

  if (!document) return null;

  return createPortal(
    <div data-testid="toaster">
      <Transition
        as={Fragment}
        show={show}
        enter="transform transition duration-300 ease-in-out"
        enterFrom="-translate-y-2 opacity-0"
        enterTo="translate-y-0 opacity-100"
        leave="transform transition duration-300 ease-in-out"
        leaveFrom="translate-y-0 opacity-100"
        leaveTo="-translate-y-2 opacity-0"
      >
        <div className="fixed top-8 w-full flex justify-center">
          <div className="bg-white text-black p-4 rounded-md shadow-md text-center">
            {message}
          </div>
        </div>
      </Transition>
    </div>,
    document.body
  );
});

const ToasterContext = createContext<{
  toasterRef: React.RefObject<Toaster> | null;
}>({
  toasterRef: null,
});

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const toasterRef = useRef<Toaster>(null);

  return (
    <ToasterContext.Provider value={{ toasterRef: toasterRef }}>
      {children}
      <Toaster ref={toasterRef} />
    </ToasterContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToasterContext);
  const toasterRef = context.toasterRef;
  if (!toasterRef) {
    throw new Error("ToasterProvider not found");
  }

  return useMemo(
    () => ({ show: toasterRef.current ? toasterRef.current.show : () => {} }),
    [toasterRef.current]
  );
}

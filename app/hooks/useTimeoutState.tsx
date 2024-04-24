import { useEffect, useState } from "react";

export function useTimeoutState<T>(initialState: T, timeout: number) {
  const [defaultState] = useState(initialState);
  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (state === defaultState) return;

    const handle = setTimeout(() => {
      setState(defaultState);
    }, timeout);

    return () => {
      clearTimeout(handle);
    };
  }, [state, timeout, defaultState]);

  return [state, setState] as const;
}

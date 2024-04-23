import { useEffect, useState } from "react";

export function useDocumentVisibility() {
  const [visibility, setVisibility] = useState(document.visibilityState);
  const [lastVisibleEvent, setLastVisibleEvent] = useState<number | null>(null);
  const [lastHiddenEvent, setLastHiddenEvent] = useState<number | null>(null);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        setLastVisibleEvent(Date.now());
      } else {
        setLastHiddenEvent(Date.now());
      }
      setVisibility(document.visibilityState);
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return { visibility, lastVisibleEvent, lastHiddenEvent };
}

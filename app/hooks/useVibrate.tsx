import { useCallback, useEffect, useState } from "react";

export function useVibrate(
  pattern: Iterable<number>,
  fallbackDurationMs: number = 100
) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (!active) return;
    setActive(false);
    try {
      if (typeof window !== "undefined" && "vibrate" in window.navigator) {
        const didVibrateWithPattern = window.navigator.vibrate(pattern);
        if (didVibrateWithPattern) return;

        if (fallbackDurationMs) {
          const didVibrate = window.navigator.vibrate(fallbackDurationMs);
          if (!didVibrate) {
            console.warn("Failed to vibrate with pattern or single vibrate");
          }
        }
      }
    } catch (e) {
      console.warn("Failed to vibrate, unknown error", e);
    }
  }, [active, pattern, fallbackDurationMs]);

  const vibrate = useCallback(() => {
    setActive(true);
  }, []);

  return vibrate;
}

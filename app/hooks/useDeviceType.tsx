import { useState, useEffect } from "react";

export function useDeviceType() {
  const [isDesktopOrLandscape, setIsDesktopOrLandscape] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    function checkOrientation() {
      // Consider desktop/landscape if width > height
      const isLandscape = window.innerWidth > window.innerHeight;
      setIsDesktopOrLandscape(isLandscape);
      setIsLoading(false);
    }

    // Check immediately and on resize
    checkOrientation();
    window.addEventListener("resize", checkOrientation);

    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  return { isDesktopOrLandscape, isLoading };
}

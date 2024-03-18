import { useEffect } from "react";
import { type GlobalCastContext } from "./types";

export function useGoogleCastScripts() {
  useEffect(() => {
    const w = window as unknown as GlobalCastContext | undefined;

    if (typeof w === "undefined" || typeof w.gCastReady !== "undefined") return;

    w.gCastReady = false;

    w["__onGCastApiAvailable"] = function (isAvailable: boolean) {
      if (isAvailable) {
        w.gCastReady = true;
      }
    };

    const script = document.createElement("script");
    script.src = "//www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1";
    script.async = true;
    document.head.appendChild(script);
  }, []);
}

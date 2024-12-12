import { useSearchParams } from "@remix-run/react";
import { useState, useEffect } from "react";

export function DebugOverlay() {
  const [searchParams] = useSearchParams();
  const debug = searchParams.get("debug");

  if (!debug) return null;

  return <Overlay />;
}
function Overlay() {
  // Add useEffect for window width
  const [width, setWidth] = useState(0);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    handleResize(); // Initial width
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="fixed bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-md text-sm z-50">
      {width}px
    </div>
  );
}

import { useRef, useEffect, useState, useMemo } from "react";

export function useDocument() {
  const [loaded, setLoaded] = useState(false);
  const documentRef = useRef<Document>();
  useEffect(() => {
    documentRef.current = document;
    setLoaded(true);
  }, []);
  return useMemo(() => (loaded ? documentRef.current : null), [loaded]);
}

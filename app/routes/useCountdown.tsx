import { useEffect, useState } from "react";

interface CountdownProps {
  onEnd: () => void;
}

export function useCountdown({ onEnd }: CountdownProps) {
  const [end, setEnd] = useState<Date>(new Date());
  const [timeLeft, setTimeLeft] = useState<number>(
    (end.getTime() - Date.now()) / 1000
  );
  const [running, setRunning] = useState<boolean>(false);

  useEffect(() => {
    if (running) {
      const interval = setInterval(() => {
        setTimeLeft((end.getTime() - Date.now()) / 1000);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [running, end]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onEnd();
      setRunning(false);
    }
  }, [timeLeft, onEnd]);

  const start = (end: Date) => {
    setTimeLeft((end.getTime() - Date.now()) / 1000);
    setEnd(end);
    setRunning(true);
  };

  const stop = () => {
    setRunning(false);
  };

  return {
    timeLeft,
    start,
    stop,
  };
}

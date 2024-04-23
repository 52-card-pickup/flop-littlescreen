import { useEffect, useState } from "react";

interface CountdownProps {
  turnExpiresDt: number;
}

export function useCountdown({ turnExpiresDt }: CountdownProps) {
  const [end, setEnd] = useState<Date>(new Date());
  const [timeLeft, setTimeLeft] = useState<number>(
    (end.getTime() - Date.now()) / 1000
  );
  const [running, setRunning] = useState<boolean>(false);

  useEffect(() => {
    if (running) {
      const interval = setInterval(() => {
        setTimeLeft((end.getTime() - Date.now()) / 1000);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [running, end]);

  const start = (end: Date) => {
    setTimeLeft((end.getTime() - Date.now()) / 1000);
    setEnd(end);
    setRunning(true);
  };

  const stop = () => {
    setRunning(false);
  };

  useEffect(() => {
    if (turnExpiresDt) {
      start(new Date(turnExpiresDt));
    }
  }, [turnExpiresDt]);

  return {
    timeLeft: Math.max(0, timeLeft),
    start,
    stop,
  };
}

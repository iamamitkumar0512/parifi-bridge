import { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function useInterval(callback, delay) {
  const [intervalId, setIntervalId] = useState();
  const [clearIntervalFn, setClearIntervalFn] = useState();
  const savedCallback = useRef(callback);

  // Remember the latest callback if it changes.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (!delay && delay !== 0) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), delay);
    setIntervalId(id);
    setClearIntervalFn(() => clearInterval(intervalId));

    return clearIntervalFn;
  }, [delay]);

  return [clearIntervalFn];
}

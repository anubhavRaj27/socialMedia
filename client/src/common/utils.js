import { useCallback, useRef, useEffect } from "react";

export function useDebouncedCallback(fn, delay) {
  const timer = useRef(null);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  return useCallback(
    (...args) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        fn(...args);
      }, delay);
    },
    [fn, delay]
  );
}

import { useRef, useEffect, useCallback } from "react";

export const useAnimationFrame = (
  run: boolean,
  callback: (deltaTime: number) => void
) => {
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);

  const animate = useCallback(
    (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    },
    [callback]
  );

  useEffect(() => {
    if (!run) {
      requestRef.current = undefined;
      previousTimeRef.current = undefined;
    } else {
      requestRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (requestRef.current !== undefined) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [run, animate]);
};

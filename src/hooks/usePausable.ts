import React, {useEffect, useState} from 'react';

export function usePausable(
  {
    callback,
    timeout,
    startPaused = false,
  }: {
    callback: () => unknown;
    timeout: number;
    startPaused?: boolean;
  },
  deps?: React.DependencyList
) {
  const now = Date.now();
  const [last, setLast] = useState(now);
  const [paused, setPaused] = useState(startPaused);

  function step() {
    setLast(Date.now());
    callback();
  }

  useEffect(() => {
    if (paused) {
      return;
    }
    const next = Math.max(timeout - (now - last), 0);
    if (next > 0) {
      const handle = setTimeout(step, next);
      return () => clearTimeout(handle);
    }
    step();
    return;
  }, deps);

  return [paused, setPaused] as const;
}

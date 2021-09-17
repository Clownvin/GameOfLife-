import React, {useEffect, useState} from 'react';

export function useInterval(
  callback: () => unknown,
  timeout: number,
  deps?: React.DependencyList
) {
  const now = Date.now();
  const [last, setLast] = useState(now);

  function step() {
    setLast(Date.now());
    callback();
  }

  useEffect(() => {
    const next = Math.max(timeout - (now - last), 0);
    if (next > 0) {
      const handle = setTimeout(step, next);
      return () => clearTimeout(handle);
    }
    step();
    return;
  }, deps);
}

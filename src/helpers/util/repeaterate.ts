type Supplier<T> = (i: number) => T;

/**
 * Iterates over a value or a function call.
 * @example Array.from(repeaterate(3, i => i * 2)) === [2, 4, 6]
 * @example Array.from(repeaterate(3, 4)) === [4, 4, 4]
 * @param times number of times to iterate
 * @param fnOrVal the iteratee
 * @returns a generator which will supply the iteration
 */
export default function repeaterate<T>(
  times: number,
  fnOrVal: T | Supplier<T>
) {
  return isFunction(fnOrVal)
    ? repeaterateFunction(times, fnOrVal)
    : repeaterateValue(times, fnOrVal);
}

function isFunction<T>(val: T | Supplier<T>): val is Supplier<T> {
  return typeof val === 'function';
}

function* repeaterateFunction<T>(times: number, fn: Supplier<T>) {
  for (let i = 0; i < times; i++) {
    yield fn(i);
  }
}

function* repeaterateValue<T>(times: number, val: T) {
  for (let i = 0; i < times; i++) {
    yield val;
  }
}

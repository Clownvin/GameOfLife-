type NotFunction<T> = T extends Function ? never : T;

export function* repeaterate<T>(
  times: number,
  fnOrVal: NotFunction<T> | ((i: number) => T)
) {
  if (typeof fnOrVal === 'function') {
    for (let i = 0; i < times; i++) {
      yield (fnOrVal as (i: number) => T)(i);
    }
  } else {
    for (let i = 0; i < times; i++) {
      yield fnOrVal;
    }
  }
}

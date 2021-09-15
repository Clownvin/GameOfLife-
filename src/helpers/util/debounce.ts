export function debounce<A extends unknown[], V>(
  callback: (...args: A) => V,
  timeout: number
) {
  let handle: NodeJS.Timeout;
  return (...args: A) => {
    if (handle) {
      clearTimeout(handle);
    }
    handle = setTimeout(() => callback(...args), timeout);
  };
}

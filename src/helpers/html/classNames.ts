export default function classNames<T extends Record<string, boolean>>(
  classes: T
) {
  return Object.entries(classes)
    .filter(([, isSet]) => isSet)
    .map(([className]) => className)
    .join(' ');
}

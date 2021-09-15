export default <T extends Record<string, boolean>>(classes: T) =>
  Object.entries(classes)
    .filter(([, isSet]) => isSet)
    .map(([className]) => className)
    .join(' ');

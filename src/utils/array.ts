export function array<T>(length: number, v: T | ((i: number) => T)) {
  return Array.from({ length }, (
    v instanceof Function ? (_, i) => v(i) : () => v
  ));
}

export function randItem<T>(array: T[], random = Math.random) {
  return array[random() * array.length | 0];
}
export function refFunction<T extends (...args: any[]) => any>(fn: T) {
  const ref = Object.assign((
    function (this: unknown, ...args) {
      return fn.apply(this, args);
    } as T
  ), { current: fn });

  return ref;
}
export const {
  entries,
  values,
  keys,
} = Object as {
  entries<T extends object>(o: T): Array<KeyValue<T, keyof T>>;
  values<T extends object>(o: T): Array<T[keyof T]>;
  keys<T extends object>(o: T): Array<keyof T>;
};

export type KeyValue<T extends object, K extends keyof T> = [key: K, value: T[K]];

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? (
    DeepPartial<T[P]>
  ) : T[P];
};

export function deepAssign<T extends object>(to: T, from: DeepPartial<T>) {
  entries(from)
    .forEach(([key, value]) => {
      value = (
        value && typeof value === 'object' ? (
          deepAssign((
            to[key] && typeof to[key] === 'object' ? to[key] : {}
          ), value)
        ) : value
      ) as T[typeof key];

      if (to[key] !== value)
        to[key] = value as T[typeof key];
    });

  return to;
}

export function clone<T extends object>(object: T): T {
  return Object.setPrototypeOf(
    structuredClone(object),
    Object.getPrototypeOf(object)
  );
}
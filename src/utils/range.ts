function range(to: number): Generator<number>;
function range(from: number, to: number): Generator<number>;
function range(from: number, to: number, step: number): Generator<number>;
function* range(a: number, b?: number, c: number = 1): Generator<number> {
  if (b === undefined)
    return yield* range(0, a, c);

  const steps = (b - a) / c;

  if (steps < 0)
    throw new Error('Infinite range');

  for (let i = 0; i < steps; i++)
    yield a + c * i;
}

export { range };
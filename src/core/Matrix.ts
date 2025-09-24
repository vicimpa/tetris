import { array, range } from "utils";

type MatrixItem = Parameters<Matrix['set']>;
type FillFunc = (...args: MatrixItem) => number;

export class Matrix {
  x = 0;
  y = 0;

  readonly raw: number[][];

  constructor(size: number);
  constructor(width: number, height: number);
  constructor(
    public readonly width: number,
    public readonly height: number = width,
  ) {
    this.raw = array(height, () => array(width, 0));
  }

  *[Symbol.iterator]() {
    for (const x of range(this.width)) {
      for (const y of range(this.height)) {
        yield [x, y, this.get(x, y)] as MatrixItem;
      }
    }
  }

  get(x: number, y: number) {
    return this.raw[y]?.[x] ?? 0;
  }

  set(x: number, y: number, v: number) {
    if (x < 0 || x > this.width - 1) return;
    if (y < 0 || y > this.height - 1) return;
    this.raw[y][x] = v;
  }

  fill(func: number | FillFunc) {
    if (typeof func === 'number') {
      const val = func;
      func = () => val;
    }

    for (const [x, y] of this)
      this.set(x, y, func(x, y, this.get(x, y)));

    return this;
  }

  getRow(y: number) {
    if (y < 0 || y > this.height - 1)
      return array(this.width, 0);

    return this.raw[y].slice();
  }

  setRow(y: number, values: number[]) {
    if (y < 0 || y > this.height - 1)
      return;

    for (const x of range(this.width)) {
      this.raw[y][x] = values[x] ?? 0;
    }
  }
}
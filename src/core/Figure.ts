import { pushColor } from "data/colors";
import { Matrix } from "./Matrix";

export class Figure extends Matrix {
  constructor(public readonly size: number) {
    super(size, size);
    this.x = this.y = -size * .5 | 0;
  }

  rotate(dir: number) {
    const sign = Math.sign(dir);
    dir |= 0;

    while (dir) {
      dir -= sign;
    }

    return this;
  }

  toColor(color: string) {
    const id = pushColor(color);
    return this.fill((_x, _y, val) => val ? id : 0);
  }
}

export function figure(...rows: string[]) {
  return new Figure(
    Math.max(
      rows.length,
      ...rows.map(e => e.length)
    )
  ).fill((x, y) => rows[y]?.[x] === '#' ? 1 : 0);
}
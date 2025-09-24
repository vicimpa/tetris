import { colors } from "data/colors";
import { dom, range } from "utils";
import { Figure } from "./Figure";
import { Matrix } from "./Matrix";

const padding = 2;

export class Render {
  ctx!: CanvasRenderingContext2D;
  can = dom('canvas', {
    ref: can => this.ctx = can.getContext('2d')!
  });

  constructor(
    public width: number,
    public height: number,
    public size = 20,
  ) {
    if (!this.ctx)
      throw new Error('Can not supported Context2D');

    this.can.width = width * (size + padding) + padding;
    this.can.height = height * (size + padding) + padding;
    this.render();
  }

  fill(x: number, y: number, v: number) {
    const { ctx, size } = this;
    const csize = size + padding;
    x = x * csize + padding;
    y = y * csize + padding;
    ctx.fillStyle = colors[v - 1] ?? (v ? '#000' : '#999');
    ctx.fillRect(x, y, size, size);
  }

  clear() {
    const { ctx, can: { width, height } } = this;
    ctx.clearRect(0, 0, width, height);
  }

  render(data?: Matrix, dX = 0, dY = 0): void {
    const { width, height } = this;

    if (data) {
      for (const [x, y, val] of data)
        val && this.fill(x + dX, y + dY, val);
      return;
    }

    for (const x of range(width)) {
      for (const y of range(height)) {
        this.fill(x, y, 0);
      }
    }
  }
}
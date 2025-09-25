import { Figure } from "./Figure";
import { p } from "./Point";
import { SizedArray } from "./SizedArray";

export class GameMap extends SizedArray {
  figures: Figure[] = [];

  constructor(width = 10, height = 20) {
    super(width, height);
  }

  entriesRender() {
    return this.entries()
      .map(([x, y, v]) => {
        for (let e of this.figures) {
          if (x < e.x || x > e.x + e.width)
            continue;

          if (y < e.y || y > e.y + e.height)
            continue;

          const value = e.get(p(x - e.x, y - e.y));

          if (typeof value != 'number')
            continue;

          v = v || value;
        }

        return [x, y, v] as [number, number, number];
      });
  }


  add(figure: Figure) {
    const { figures } = this;
    const index = figures.indexOf(figure);

    if (index == -1)
      figures.push(figure);
  }

  remove(figure?: Figure) {
    if (!figure) {
      this.figures.splice(0);
      return;
    }

    const { figures } = this;
    const index = figures.indexOf(figure);

    if (index != -1)
      figures.splice(index, 1);
  }

  fix(figure: Figure) {
    this.remove(figure);

    for (let [x, y, v] of figure.entries()) {
      if (!v) continue;
      x += figure.x;
      y += figure.y;

      this.set(p(x, y), v);
    }
  }

  checkClear() {
    let count = 0;

    for (let y = this.height - 1; y - count >= -1; y--) {
      if (this.getRow(y - count).every(Boolean))
        count++;

      if (!count)
        continue;

      this.setRow(y, this.getRow(y - count));
    }

    return count;
  }
}
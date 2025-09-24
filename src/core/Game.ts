import { getFigure } from "data/figures";
import { dom, every, keyAxis, keyDown, keyPress, loop, } from "utils";
import { Render } from "./Render";
import { computed, effect, Signal, signal } from "@preact/signals-core";
import { Figure } from "./Figure";
import { nextSeed } from "data/random";
import { Matrix } from "./Matrix";

function stat(title: string, signal: Signal<string | number>) {
  return dom('p', { className: 'stat' },
    dom('span', {}, title),
    dom('b', {
      ref: el => effect(() => {
        el.innerText = `${signal.value}`;
      })
    })
  );
}

function pause(siglal: Signal<boolean>) {
  return dom('div', {
    className: 'pause', ref: el => {
      effect(() => {
        el.style.opacity = (+siglal.value) + '';
      });
    }
  });
}

function gameover(score: Signal<number>, end: Signal<boolean>, restart?: () => void) {
  return dom('div', {
    className: 'modal', ref: el => {
      effect(() => {
        el.dataset['show'] = end.value + '';
      });
    }
  },
    dom('div', { className: 'body' },
      dom('h2', {}, 'Game over'),
      dom('h4', {},
        'You score: ',
        dom('b', {
          ref: el => {
            effect(() => {
              el.innerText = `${score.value}`;
            });
          }
        }),
      ),
      dom('button', { style: { width: '100%' }, onclick: restart }, 'Restart'),
    ),
  );
}

export class Game {
  root: HTMLDivElement;

  width = 10;
  height = 20;
  size = 4;

  map = new Matrix(this.width, this.height);

  x!: number;
  y!: number;
  now!: Figure;
  next!: Figure;

  render = {
    map: new Render(this.width, this.height),
    next: new Render(this.size, this.size),
  };

  time = signal(0);
  score = signal(0);
  hiScore = signal(0);
  rows = signal(0);
  level = signal(0);
  pause = signal(true);
  end = signal(false);
  showTime = computed(() => (this.time.value / 1000).toFixed(1));

  moveTicker = every(700, true);
  keyMoveTicker = every(100);
  keyDownTicker = every(50);

  constructor(to?: string | Element) {
    const { render: { map, next } } = this;
    this.root = dom('div', { className: 'game', to },
      dom('div', { className: 'content' },
        map.can,
        pause(this.pause),
      ),
      dom('div', { className: 'side' },
        stat('Score', this.score),
        stat('Hiscore', this.hiScore),
        stat('Full rows', this.rows),
        stat('Level', this.level),
        stat('Time', this.showTime),
        next.can,
        dom('button', {
          className: 'btn',
          onclick: () => this.togglePause()
        }, 'Pause (Esc)'),
        dom('div', { className: 'grow' }),
        dom('a', { href: 'https://github.com/vicimpa/tetris' }, 'GitHub')
      ),
      gameover(this.score, this.end, () => this.restart())
    );
    loop(this.loop.bind(this));
    this.nextFigure();
    this.renderMap();
    this.renderNext();
  }

  restart() {
    this.end.value = false;
    this.score.value = 0;
    this.rows.value = 0;
    this.level.value = 0;
    this.time.value = 0;
    this.map.fill(0);
    nextSeed();
    this.now = getFigure();
    this.next = getFigure();
  }

  fixFigure() {
    for (const [x, y, val] of this.now) {
      if (y + this.y < 0) {
        this.end.value = true;
        return;
      }
      this.map.set(y + this.y, x + this.x, val);
    }
    this.nextFigure();
  }

  nextFigure() {
    this.x = 5;
    this.y = -2;
    this.now = this.next ?? getFigure();
    this.next = getFigure();
  }

  changeFigure() {
    const { now } = this;
    this.now = this.next;
    this.next = now;
  }

  togglePause() {
    this.pause.value = !this.pause.value;
  }

  isCollide(figure = this.now, dX = this.x, dY = this.y) {
    for (const [x, y] of figure) {
      if (x < 0 || x > this.width - 1) return true;
      if (y > this.height - 1) return true;
      if (this.map.get(y + dX, x + dY)) return true;
    }

    return false;
  }

  renderNext() {
    const { next, render } = this;
    render.next.render();
    render.next.render(next);
  }

  renderMap() {
    const { render, now, x, y } = this;
    render.map.clear();
    render.map.render();
    render.map.render(this.map);
    render.map.render(now, x, y);
  }

  loop(delta: number) {
    const {
      pause: { value: pause },
      end: { value: end }
    } = this;

    if (end)
      return;

    if (keyPress('Escape'))
      this.togglePause();

    if (keyPress('KeyR'))
      this.changeFigure();

    if (!pause) {
      this.time.value += delta;
    }

    const move = keyAxis(
      ['KeyA', 'ArrowLeft'],
      ['KeyD', 'ArrowRight'],
    );

    const down = keyDown(
      ['KeyS', 'ArrowDown']
    );

    const isMove = this.keyMoveTicker(!!move);

    const isDown = false
      || this.moveTicker(!pause && !down)
      || this.keyDownTicker(down);

    if (isMove && !this.isCollide(this.now, this.x + move)) {
      this.x += move;
    }

    if (isDown) {
      if (this.isCollide(undefined, undefined, this.y + 1))
        this.fixFigure();
      else
        this.y += 1;
    }

    this.renderMap();
    this.renderNext();
  }
}
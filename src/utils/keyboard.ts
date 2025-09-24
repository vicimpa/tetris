import { nextTick } from "./async";

const DOWN = new Set<string>();
const PRESS = new Set<string>();


addEventListener('keydown', ({ code }) => {
  DOWN.add(code);
});

addEventListener('keyup', ({ code }) => {
  DOWN.delete(code);
  PRESS.delete(code);
});

addEventListener('blur', () => {
  DOWN.clear();
  PRESS.clear();
});

export function keyDown(code: string | string[]) {
  if (Array.isArray(code))
    return code.findIndex(keyDown) !== -1;

  return DOWN.has(code);
}

export function keyAxis(neg: string | string[], pos: string | string[]) {
  return -keyDown(neg) + +keyDown(pos);
}

export function keyPress(code: string | string[]) {
  if (Array.isArray(code))
    return code.findIndex(keyPress) !== -1;

  if (keyDown(code)) {
    nextTick(() => {
      PRESS.add(code);
    });

    return !PRESS.has(code);
  }

  return false;
}
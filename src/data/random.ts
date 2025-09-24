import { makeRandom, refFunction } from "utils";

let seed = +location.hash.slice(1) | 0;
let rnd = Math.random();

export const random = refFunction(makeRandom(seed));

export function nextSeed() {
  location.hash = `#${seed = (rnd * 100000000 | 0)}`;
  random.current = refFunction(makeRandom(seed));
  rnd = random();
}

if (!seed || isNaN(seed))
  nextSeed();

rnd = random();

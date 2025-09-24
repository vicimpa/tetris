export function nextTick(fn: () => any) {
  Promise.resolve()
    .then(() => fn());
  return () => { fn = () => { }; };
}

export function nextLoop(fn: () => any) {
  return clearTimeout.bind(null, setTimeout(fn, 0));
}

export function nextFrame(fn: () => any) {
  return cancelAnimationFrame.bind(null, requestAnimationFrame(fn));
}
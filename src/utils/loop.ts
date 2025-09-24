export function loop(fn: (delta: number, time: number) => any) {
  var time: number, raf: number;

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    fn(now - time, time = now);
  }

  frame(time = performance.now());

  return () => {
    cancelAnimationFrame(raf);
  };
}
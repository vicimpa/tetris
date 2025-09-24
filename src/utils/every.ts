export function every(time: number, delay?: boolean) {
  const defaultNow = delay ? time : 0;
  let now = defaultNow, last = performance.now();

  return (work = true) => {
    if (!work) {
      now = defaultNow;
      last = performance.now();
      return false;
    }

    let t = performance.now();
    now -= t - last;
    last = t;

    if (now < 0) {
      now = time;
      return true;
    }

    return false;
  };
}
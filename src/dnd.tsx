export function relativeCoords(evt: MouseEvent): [n, n] {
  const target = evt.currentTarget as HTMLElement;

  const downX = evt.clientX;
  const downY = evt.clientY;
  const bbX = target.getBoundingClientRect().x;
  const bbY = target.getBoundingClientRect().y;
  const dx = bbX - downX;
  const dy = bbY - downY;

  return [dx, dy];
}

export function centerCoords(elm: HTMLElement): [n, n] {
  const bb = elm.getBoundingClientRect();
  const x = bb.x + bb.width / 2;
  const y = bb.y + bb.height / 2;

  return [x, y];
}

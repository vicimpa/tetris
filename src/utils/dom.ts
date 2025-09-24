import { nextTick } from "./async";
import { deepAssign, DeepPartial } from "./object";

type DomTags = HTMLElementTagNameMap;
type Props<T extends keyof DomTags> = DeepPartial<DomTags[T]> & {
  ref?: (el: DomTags[T]) => any;
  to?: Element | string;
};

export function dom<T extends keyof DomTags>(
  tagName: T,
  { ref, to, ...props }: Props<T> = {},
  ...children: (string | number | Element | Element[])[]
) {
  const elem = document.createElement(tagName);
  deepAssign(elem, props as DeepPartial<DomTags[T]>);
  nextTick(() => {
    children.flat().forEach(child => {
      if (child instanceof Element)
        elem.append(child);
      else
        elem.append(new Text(`${child}`));
    });
    find(to)?.append(elem);
  });
  return (ref?.(elem), elem);
}

export function find<T extends Element>(elem?: string | T): T | undefined {
  if (typeof elem === 'string')
    return document.querySelector(elem) as T ?? undefined;
  return elem;
}
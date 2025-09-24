import { figure } from "core";
import { randItem } from "utils";
import { random } from "./random";

export const figures = [
  figure(
    '###',
    '#  ',
  ).toColor('#810481ff'),

  figure(
    ' #',
    ' #',
    ' #',
    ' #',
  ).toColor('#941010ff'),

  figure(
    '###',
    ' # ',
  ).toColor('#948511ff'),

  figure(
    ' ##',
    '## ',
  ).toColor('#157f15ff'),

  figure(
    '## ',
    ' ##',
  ).toColor('#177d94ff'),

  figure(
    '##',
    '##',
  ).toColor('#15158bff'),

  figure(
    '###',
    '  #',
  ).toColor('#e5e5e5ff')
];

export function getFigure() {
  return randItem(figures, random)
    .rotate(random() * 3 | 0);
}
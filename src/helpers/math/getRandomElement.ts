import {getRandomInt} from './getRandomInt';

export function getRandomElement<T>(arr: T[]) {
  return arr[getRandomInt(arr.length)];
}

import {getRandomNumber} from './getRandomNumber';

export function getRandomInt(max: number, min = 0) {
  return Math.floor(getRandomNumber(max, min));
}

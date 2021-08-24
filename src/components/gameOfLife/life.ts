import {getRandomElement} from '../../helpers/math/getRandomElement';
import {repeaterate} from '../../helpers/util/repeaterate';

export const DEAD = 0;
export const ALIVE = 1;
export type Dead = typeof DEAD;
export type Alive = typeof ALIVE;
export type CellState = Dead | Alive;
export type CellRow = CellState[];
export type LifeState = CellRow[];

type Direction = [xInc: number, yInc: number];
//A representation of all 8 cardinal/ordinal directions
const DIRECTIONS = Array.from(
  repeaterate(3, x =>
    Array.from(repeaterate(3, y => [x - 1, y - 1] as Direction))
  )
)
  .reduce((a, b) => a.concat(b))
  //Remove the (0, 0) entry
  .filter(([x, y]) => x !== 0 || y !== 0);

export function createBlankLifeState(width: number, height: number): LifeState {
  return Array.from(
    repeaterate(height, () =>
      Array.from(
        repeaterate(width, () => getRandomElement([DEAD, ALIVE] as CellState[]))
      )
    )
  );
}

//Game Of Life Implementation

export function doLifeStep(state: LifeState): LifeState {
  return state.map((row, y) => doRowStep(row, y, state));
}

function doRowStep(row: CellRow, y: number, state: LifeState): CellRow {
  return row.map((cell, x) => doCellStep(cell, x, y, state));
}

function doCellStep(
  cell: CellState,
  x: number,
  y: number,
  state: LifeState
): CellState {
  const countLiveNeighbors = getLiveNeighborCount(x, y, state);
  switch (cell) {
    case ALIVE:
      return countLiveNeighbors === 2 || countLiveNeighbors === 3
        ? ALIVE
        : DEAD;
    case DEAD:
      return countLiveNeighbors === 3 ? ALIVE : DEAD;
  }
}

function getLiveNeighborCount(x: number, y: number, state: LifeState) {
  return getNeighbors(x, y, state).filter(c => c === ALIVE).length;
}

function getNeighbors(x: number, y: number, state: LifeState) {
  return DIRECTIONS.map(direction =>
    getNeighborForDirection(direction, x, y, state)
  );
}

function getNeighborForDirection(
  [xInc, yInc]: Direction,
  x: number,
  y: number,
  state: LifeState
) {
  const nY = getNeighborY(yInc, y, state);
  const nX = getNeighborX(nY, xInc, x, state);
  return state[nY][nX];
}

function wrapNumber(n: number, max: number, min = 0) {
  if (n < min) {
    return n + max;
  } else if (n >= max) {
    return n - max;
  }
  return n;
}

function getNeighborY(yInc: number, y: number, state: LifeState) {
  return wrapNumber(y + yInc, state.length);
}

function getNeighborX(nY: number, xInc: number, x: number, state: LifeState) {
  return wrapNumber(x + xInc, state[nY].length);
}

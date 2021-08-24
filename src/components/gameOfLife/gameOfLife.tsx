import React, {useEffect, useState} from 'react';
import {ALIVE, createBlankLifeState, DEAD, doLifeStep} from './life';
import {Cell} from './cell';
import './gameOfLife.scss';
import {interval, tap} from 'rxjs';

type Props = {
  width?: number;
  height?: number;
  tickRate?: number;
};

const DEFAULT_WIDTH = 40;
const DEFAULT_HEIGHT = 40;
const DEFAULT_TICKRATE = 100; //1000 seconds;

export const GameOfLife: React.FunctionComponent<Props> = ({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  tickRate = DEFAULT_TICKRATE,
}) => {
  const [state, setState] = useState(createBlankLifeState(width, height));
  // const [paused] = useState(false);

  useEffect(() => {
    const subscription = interval(tickRate)
      .pipe(tap(() => setState(doLifeStep(state))))
      .subscribe();
    return () => subscription.unsubscribe();
  });

  function setAlive(x: number, y: number) {
    if (state[y][x] !== DEAD) {
      return;
    }
    state[y][x] = ALIVE;
    setState(state.slice());
  }

  return (
    <>
      <section
        className="game-of-life"
        style={{
          display: 'grid',
          gridTemplate: `repeat(${height}, 1fr) / repeat(${width}, 1fr)`,
        }}
      >
        {state.map((row, y) =>
          row.map((value, x) => (
            <Cell
              value={value}
              onClick={() => setAlive(x, y)}
              key={`${x}-${y}`}
            ></Cell>
          ))
        )}
      </section>
    </>
  );
};

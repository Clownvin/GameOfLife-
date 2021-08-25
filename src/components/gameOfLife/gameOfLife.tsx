import React, {useEffect, useState} from 'react';
import {
  ALIVE,
  createBlankLifeState,
  DEAD,
  doLifeStep,
  resizeLifeState,
} from './life';
import {Cell} from './cell';
import './gameOfLife.scss';

type Props = {
  width?: number;
  height?: number;
  tickRate?: number;
};

const DEFAULT_WIDTH = 40;
const DEFAULT_HEIGHT = 40;
const DEFAULT_TICKRATE = 100; //1000 seconds;

export const GameOfLife: React.FunctionComponent<Props> = ({
  width: initialWidth = DEFAULT_WIDTH,
  height: initialHeight = DEFAULT_HEIGHT,
  tickRate = DEFAULT_TICKRATE,
}) => {
  const [[width, height], setDimensions] = useState([
    initialWidth,
    initialHeight,
  ]);
  const [dimensionsLinked, setDimensionsLinked] = useState(true);
  const [state, setState] = useState(createBlankLifeState(width, height));
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) {
      return;
    }
    const timeout = setTimeout(() => setState(doLifeStep(state)), tickRate);
    return () => clearTimeout(timeout);
  }, [state, paused]);

  function toggleCell(x: number, y: number) {
    if (state[y][x] === DEAD) {
      state[y][x] = ALIVE;
    } else {
      state[y][x] = DEAD;
    }
    setState(state.slice());
  }

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key !== ' ') {
        return;
      }
      setPaused(!paused);
    };
    window.addEventListener('keypress', listener);
    return () => window.removeEventListener('keypress', listener);
  }, [paused]);

  function resize(width: number, height: number) {
    setState(resizeLifeState(state, width, height));
    setDimensions([width, height]);
  }

  function changeWidth(width: number) {
    if (dimensionsLinked) {
      resize(width, width);
    } else {
      resize(width, height);
    }
  }

  function changeHeight(height: number) {
    if (dimensionsLinked) {
      resize(height, height);
    } else {
      resize(width, height);
    }
  }

  return (
    <article className="game-of-life-container">
      <section
        className="game-of-life-grid"
        style={{
          display: 'grid',
          gridTemplate: `repeat(${height}, 1fr) / repeat(${width}, 1fr)`,
        }}
        onContextMenu={e => {
          e.preventDefault();
        }}
      >
        {state.map((row, y) =>
          row.map((value, x) => (
            <Cell
              value={value}
              onClick={() => toggleCell(x, y)}
              key={`${x}-${y}`}
            ></Cell>
          ))
        )}
      </section>
      <form
        className="game-of-life-controls"
        onSubmit={e => e.preventDefault()}
      >
        <button onClick={() => setPaused(!paused)}>
          {paused ? 'Unpause' : 'Pause'} <kbd>[Space]</kbd>
        </button>
        <button onClick={() => setState(createBlankLifeState(width, height))}>
          Clear
        </button>
        <section>
          <div>
            <label htmlFor="width">Width</label>
            <input
              name="width"
              type="range"
              max={100}
              min={2}
              value={width}
              onChange={event => changeWidth(Number(event.target.value))}
            ></input>
          </div>
          <div>
            <label htmlFor="height">Height</label>
            <input
              name="height"
              type="range"
              max={100}
              min={2}
              value={height}
              onChange={event => changeHeight(Number(event.target.value))}
            ></input>
          </div>
          <div>
            <label htmlFor="dimensionsLinked">Link</label>
            <input
              name="dimensionsLinked"
              type="checkbox"
              checked={dimensionsLinked}
              onChange={() => setDimensionsLinked(!dimensionsLinked)}
            ></input>
          </div>
        </section>
      </form>
    </article>
  );
};

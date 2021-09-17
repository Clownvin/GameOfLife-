import React, {useEffect, useState} from 'react';
import {
  ALIVE,
  createBlankLifeState,
  DEAD,
  doLifeStep,
  resizeLifeState,
} from './life';
import './styles.scss';
import {getRandomElement} from '../../helpers/math/getRandomElement';
import {LifeCanvas, LifeCanvasProps} from './LifeCanvas';
import {NumberInput} from '../NumberInput';
import {usePausable} from '../../hooks/usePausable';

type Props = {
  width?: number;
  height?: number;
  tickRate?: number;
};

const DEFAULT_WIDTH = 40;
const DEFAULT_HEIGHT = 40;
const DEFAULT_TICKRATE = 333;

export const GameOfLife: React.FunctionComponent<Props> = ({
  width: initialWidth = DEFAULT_WIDTH,
  height: initialHeight = DEFAULT_HEIGHT,
  tickRate: initialTickRate = DEFAULT_TICKRATE,
}) => {
  const [[width, height], setDimensions] = useState([
    initialWidth,
    initialHeight,
  ]);
  const [dimensionsLinked, setDimensionsLinked] = useState(true);
  const [state, setState] = useState(createBlankLifeState(width, height));

  const [style, setStyle] = useState<LifeCanvasProps['style']>({
    aliveColor: '#33FF00',
    deadColor: '#000000',
    gridColor: '#00FF00',
  });

  const [paused, setPaused] = usePausable({
    callback: () => setState(doLifeStep(state)),
    timeout: initialTickRate,
  });

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

  function randomize() {
    setState(state.map(row => row.map(() => getRandomElement([ALIVE, DEAD]))));
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

  function toggleCell(x: number, y: number) {
    if (state[y][x] === DEAD) {
      state[y][x] = ALIVE;
    } else {
      state[y][x] = DEAD;
    }
    setState(state.slice());
  }

  return (
    <article className="game-of-life-container">
      <LifeCanvas
        state={state}
        onCellClick={toggleCell}
        style={style}
      ></LifeCanvas>
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
        <button onClick={() => randomize()}>Randomize</button>
        <section>
          <section>
            <div>
              <label htmlFor="alive-color">Alive Color</label>
              <input
                name="alive-color"
                type="color"
                value={style?.aliveColor}
                onChange={e => setStyle({...style, aliveColor: e.target.value})}
              ></input>
            </div>
            <div>
              <label htmlFor="dead-color">Dead Color</label>
              <input
                name="dead-color"
                type="color"
                value={style?.deadColor}
                onChange={e => setStyle({...style, deadColor: e.target.value})}
              ></input>
            </div>
            <div>
              <label htmlFor="border-color">Border Color</label>
              <input
                name="border-color"
                type="color"
                value={style?.gridColor}
                onChange={e => setStyle({...style, gridColor: e.target.value})}
              ></input>
            </div>
          </section>
          <section>
            <div>
              <label htmlFor="width">Width</label>
              <div>
                <NumberInput
                  name="width"
                  max={250}
                  min={2}
                  value={width}
                  onChange={n => changeWidth(n)}
                ></NumberInput>
                <NumberInput
                  range
                  max={250}
                  min={2}
                  value={width}
                  onChange={n => changeWidth(n)}
                ></NumberInput>
              </div>
            </div>
            <div>
              <label htmlFor="height">Height</label>
              <div>
                <NumberInput
                  name="height"
                  max={250}
                  min={2}
                  value={height}
                  onChange={n => changeHeight(n)}
                ></NumberInput>
                <NumberInput
                  range
                  max={250}
                  min={2}
                  value={height}
                  onChange={n => changeHeight(n)}
                ></NumberInput>
              </div>
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
        </section>
      </form>
    </article>
  );
};

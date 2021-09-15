import React, {useEffect, useRef, useState} from 'react';
import getFixedCanvasDimensions from '../../../helpers/html/getFixedCanvasDimensions';
import {ALIVE, LifeState} from '../life';
import './style.scss';

const DEFAULT_ALIVE_COLOR = '#ee7eff';
const DEFAULT_DEAD_COLOR = '#000000';
const DEFAULT_GRID_COLOR = '#8fff7e';
const DEFAULT_GRID_WIDTH = 0;

export type LifeCanvasProps = {
  state: LifeState;
  onCellClick?: (x: number, y: number) => unknown;
  style?: {
    aliveColor?: string;
    deadColor?: string;
    gridColor?: string;
    gridWidth?: number;
  };
};

export const LifeCanvas: React.FC<LifeCanvasProps> = ({
  state,
  onCellClick,
  style: {
    aliveColor = DEFAULT_ALIVE_COLOR,
    deadColor = DEFAULT_DEAD_COLOR,
    gridColor = DEFAULT_GRID_COLOR,
    gridWidth = DEFAULT_GRID_WIDTH,
  } = {},
}) => {
  const height = state.length;
  const width = state[0].length;
  if (!height) {
    throw new Error('Empty life state!');
  }

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.warn('No canvas!');
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn('Failed to get canvas context!');
      return;
    }
    const {width: canvasW, height: canvasH} = canvas;
    getFixedCanvasDimensions(canvas);

    const cellW = (canvasW - (width + 1) * gridWidth) / width;
    const cellH = (canvasH - (height + 1) * gridWidth) / height;

    ctx.fillStyle = gridColor;
    ctx.fillRect(0, 0, canvasW, canvasH);

    for (let y = 0; y < height; y++) {
      const canvasY = (y + 1) * gridWidth + y * cellH;
      for (let x = 0; x < width; x++) {
        const canvasX = (x + 1) * gridWidth + x * cellW;

        if (state[y][x] === ALIVE) {
          ctx.fillStyle = aliveColor;
        } else {
          ctx.fillStyle = deadColor;
        }

        ctx.fillRect(canvasX, canvasY, cellW, cellH);
      }
    }
  });

  function getCellX({
    nativeEvent: {offsetX: x},
    currentTarget: {width: canvasW},
  }: React.MouseEvent<HTMLCanvasElement>) {
    return Math.floor(x / (canvasW / width));
  }

  function getCellY({
    nativeEvent: {offsetY: y},
    currentTarget: {height: canvasH},
  }: React.MouseEvent<HTMLCanvasElement>) {
    return Math.floor(y / (canvasH / height));
  }

  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    onCellClick?.(getCellX(e), getCellY(e));
  }

  const [prevMove, setPrevMove] = useState<[prevX: number, prevY: number]>();

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!e.buttons) {
      return;
    }
    const cellX = getCellX(e);
    const cellY = getCellY(e);
    if (prevMove) {
      const [prevX, prevY] = prevMove;
      if (prevX === cellX && prevY === cellY) {
        return;
      }
    }
    setPrevMove([cellX, cellY]);
    onMouseDown(e);
  }

  return (
    <canvas
      className="life"
      ref={canvasRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
    ></canvas>
  );
};

import {ALIVE, CellState} from './life';

interface Props {
  value?: CellState;
  onClick?: () => unknown;
}
export const Cell: React.FunctionComponent<Props> = ({value, onClick}) => {
  function onMouseEvent(event: React.MouseEvent) {
    if (event.buttons && onClick) {
      onClick();
    }
  }
  return (
    <div
      className={`cell ${value === ALIVE ? 'alive' : 'dead'}`}
      onMouseMove={onMouseEvent}
      onMouseDown={onMouseEvent}
    ></div>
  );
};

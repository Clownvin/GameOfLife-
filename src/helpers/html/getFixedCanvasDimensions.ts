export default function getFixedCanvasDimensions(canvas: HTMLCanvasElement) {
  const dpi = window.devicePixelRatio;
  const style = getComputedStyle(canvas);
  const width = +style.getPropertyValue('width').slice(0, -2) * dpi;
  const height = +style.getPropertyValue('height').slice(0, -2) * dpi;
  canvas.setAttribute('width', width.toString());
  canvas.setAttribute('height', height.toString());
  return {width, height};
}

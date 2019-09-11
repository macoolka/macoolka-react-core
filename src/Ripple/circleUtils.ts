import { pipe } from 'fp-ts/lib/pipeable';
import * as R from 'fp-ts/lib/Reader';
export type Rect = {
  width: number,
  height: number,
  left: number,
  top: number,
};
export const defaultRect: Rect = { width: 0, height: 0, left: 0, top: 0 }
export type Point = {
  x: number,
  y: number,
}
export type RectAndPoint = {
  rect: Rect,
  point: Point,
}
export const defaultPoint = { x: 0, y: 0 };
export type Circle = {
  point: Point,
  radius: number,
}
const calulateCircle = (center: boolean = false) => ({ rect: { width, height }, point: { x, y } }: RectAndPoint): Circle => {
  let radius: number;
  if (center) {
    radius = Math.sqrt((2 * width ** 2 + height ** 2) / 3);
    // For some reason the animation is broken on Mobile Chrome if the size if even.
    if (radius % 2 === 0) {
      radius += 1;
    }
  } else {
    const sizeX =
      Math.max(Math.abs(width - x), x) * 2 + 2;
    const sizeY =
      Math.max(Math.abs(height - y), y) * 2 + 2;
    radius = Math.sqrt(sizeX ** 2 + sizeY ** 2);
  }
  return ({
    point: { x, y },
    radius
  });
}
const calulateCenterPoint =
  (center: boolean = false) =>
    ({ rect: { left, top, width, height }, point: { x, y } }: RectAndPoint): RectAndPoint => center ? ({
      point: {
        x: Math.round(width / 2),
        y: Math.round(height / 2)
      }, rect: { left, top, width, height }
    }) : ({
      point: {
        x: Math.round(x - left),
        y: Math.round(y - top)
      },
      rect: {
        left, top, width, height
      },
    })
export const calCircle =
  (center: boolean = false) => pipe(
    calulateCenterPoint(center),
    
    R.map(calulateCircle(center))
  )
export const circleToRect = ({ point: { x, y }, radius }: Circle) => ({
  width: radius,
  height: radius,
  left: -(radius / 2) + x,
  top: -(radius / 2) + y,

})
export const fromMouseDownEvent = (rect: Rect) => (event: MouseEvent) => (
  {
    rect,
    point: {
      x: event.clientX,
      y: event.clientY,
    }
  })
export const fromTouchEvent = (rect: Rect) => (event: TouchEvent) => (
  {
    rect,
    point: {
      x: event.touches.length > 0 ? event.touches[0].clientX : 0,
      y: event.touches.length > 0 ? event.touches[0].clientX : 0,
    }
  })
export type CallBackFunction<T = never> = (a: T) => void
export type EmptyCallBackFunction = () => void
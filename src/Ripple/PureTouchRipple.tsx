import * as React from 'react';
import ReactDOM from 'react-dom';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import Ripple, { RippleProps } from './Ripple';
import { omit } from 'macoolka-object'
import { or, not, isNull, isString } from 'macoolka-predicate';
import { Option, none, some, fromPredicate } from 'fp-ts/lib/Option';
import { calCircle, Point, Rect, defaultRect, EmptyCallBackFunction } from './circleUtils';
import { createAction, Action } from '../actions';
import { delayTimer,TimeOut } from '../Delay'
import { pipe } from 'fp-ts/lib/pipeable'
import * as O from 'fp-ts/lib/Option'
export type StartPayload = Point & { eventName: string, pulsate: boolean, cb?: () => void }
export type StopPayload = { persist: () => void, eventName: string, cb?: EmptyCallBackFunction };
export const startAction = createAction<StartPayload>('StartRipper');
export const stopAction = createAction<StopPayload>('StopRipper');
export const pulsateAction = createAction<StopPayload>('PulsateRipper');
const DURATION = 550;
export const DELAY_RIPPLE = 80;

export type Props = { center?: boolean; className?: string };
class PureTouchRipple extends React.Component<Props, { nextKey: number, ripples: any[] }> {
  static displayName = 'TouchRipple';
  static defaultProps = { center: false };
  dispatch = (action: Action<any>) => {
    pipe(
      startAction.getOption(action),
      O.map(this.start)
    )
    pipe(
      stopAction.getOption(action),
      O.map(this.stop)
    )
    pipe(
      pulsateAction.getOption(action),
      O.map(this.pulsate)
    )

  }
  componentDidMount() {
    this.element = pipe(
      ReactDOM.findDOMNode(this),
      fromPredicate(not(or(isNull, isString))),
      O.map(a => a as Element)
    )
  }
  componentWillUnmount() {
    pipe(
      this.startTimer,
      O.map(clearTimeout)
    )

  }
  // Used to filter out mouse emulated events on mobile.
  ignoringMouseDown = false;
  private pulsate = () => {
    this.start({ eventName: '', x: 0, y: 0, pulsate: true });
  };


  // We use a timer in order to only show the ripples for touch "click" like events.
  // We don't want to display the ripple for touch scroll events.
  private startTimer: Option<TimeOut> = none;

  // This is the hook called once the previous timeout is ready.
  private startTimerCommit: Option<() => void> = none;
  private element: Option<Element> = none;
  state = {
    nextKey: 0,
    ripples: [],
  };


  private getRect = (): Rect => pipe(
    this.element,
    O.map(e => e.getBoundingClientRect() as Rect),
    O.getOrElse(() => defaultRect)
  )

  private start = ({ eventName, pulsate, x, y, cb }: StartPayload) => {

    const center = this.props.center || pulsate;
    if (eventName === 'mousedown' && this.ignoringMouseDown) {
      this.ignoringMouseDown = false;
      return;
    }
    const circle = calCircle(center)({ point: { x, y }, rect: this.getRect() });
    const io = () => this.startCommit({ pulsate: pulsate!, circle, cb })
    if (eventName === 'touchstart') {
      this.ignoringMouseDown = true;
      // Prepare the ripple effect.
      this.startTimerCommit = some(io);
      // Deplay the execution of the ripple effect.
      this.startTimer = some(
        delayTimer(DELAY_RIPPLE)(
          () => {
            if (O.isSome(this.startTimerCommit)) {
              pipe(
                this.startTimerCommit,
                O.map(a => a())
              )
              this.startTimerCommit = none;
            }
          },

        ))
    }
    else {
      io();
    }

  };

  private startCommit = ({ pulsate, circle, cb }: RippleProps & { cb?: EmptyCallBackFunction }) => {

    this.setState(state => {
      return {
        nextKey: state.nextKey + 1,
        ripples: [
          ...state.ripples,
          <Ripple
            key={state.nextKey}
            timeout={{
              exit: DURATION,
              enter: DURATION,
            }}
            pulsate={pulsate}
            circle={circle}
          />,
        ],
      };
    }, cb);

  };

  private stop = ({ eventName, persist, cb }: { persist: () => void, eventName: string, cb?: EmptyCallBackFunction }) => {

    pipe(
      this.startTimer,
      O.map(clearTimeout)
    )
    // The touch interaction occures to quickly.
    // We still want to show ripple effect.
    if (eventName === 'touchstop' && O.isSome(this.startTimerCommit)) {
      persist();
      pipe(
        this.startTimerCommit,
        O.map(a => a())
      )
      this.startTimerCommit = none;
      this.startTimer = some(delayTimer(0)(() => {
        this.stop({ eventName, persist, cb });
      }));
    } else {
      const { ripples } = this.state;
      this.startTimerCommit = none;
      if (ripples && ripples.length) {
        this.setState(
          {
            ripples: ripples.slice(1),
          },
          cb,
        );
      }
    }

  };

  render() {
    const { center, className, ...other } = this.props;
    const cOther = omit(other, ['children', 'ref']);
    return (

      <TransitionGroup
        className={className}
        component="span"
        enter
        exit
        {...cOther}
      >
        {this.state.ripples}
      </TransitionGroup>

    );
  }
}

export default PureTouchRipple;
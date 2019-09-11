
import * as O from 'fp-ts/lib/Option';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import keycode from 'keycode';
import { ownerDocument, ownerWindow } from '../utils';
import { delayTimerFunction } from '../Delay';
import { pipe } from 'fp-ts/lib/pipeable'
import { getWrapDisplayName } from '../reactHelper';
import {omit} from 'macoolka-object'
import {TimeOut} from '../Delay'
const internal: { focusKeyPressed: boolean, keyUpEventTimeout: O.Option<TimeOut> } = {
  focusKeyPressed: false,
  keyUpEventTimeout: O.none,
};
export function detectFocusVisible(instance: {
  focusVisibleCheckTime: number,
  focusVisibleMaxCheckTimes: number,
  focusVisibleTimeout: O.Option<TimeOut>,

}, element: any, callback: () => void, attempt = 1) {

  instance.focusVisibleTimeout = O.some(setTimeout(() => {
    const doc = ownerDocument(element);
    if (
      internal.focusKeyPressed &&
      (doc.activeElement === element || element.contains(doc.activeElement))
    ) {
      callback();
    } else if (attempt < instance.focusVisibleMaxCheckTimes) {
      detectFocusVisible(instance, element, callback, attempt + 1);
    }
  }, instance.focusVisibleCheckTime));
}
export interface ButtonBaseActions {
  focusVisible(): void;
}
const FOCUS_KEYS = ['tab', 'enter', 'space', 'esc', 'up', 'down', 'left', 'right'];

const isFocusKey = (event: Event) => {
  return FOCUS_KEYS.indexOf(keycode(event)) > -1;
}

const handleKeyUpEvent = (event: Event) => {
  if (isFocusKey(event)) {
    internal.focusKeyPressed = true;

    // Let's consider that the user is using a keyboard during a window frame of 1s.
    pipe(
      internal.keyUpEventTimeout,
      O.map(clearTimeout)
    )

    internal.keyUpEventTimeout = O.some(delayTimerFunction(1e3)(() => {
      internal.focusKeyPressed = false;
    }));
  }
};
export function listenForFocusKeys(win: any) {
  // The event listener will only be added once per window.
  // Duplicate event listeners will be ignored by addEventListener.
  // Also, this logic is client side only, we don't need a teardown.
  win.addEventListener('keyup', handleKeyUpEvent);
}
export type Props = {
  /**
* Callback fired when the component mounts.
* This is useful when you want to trigger an action programmatically.
* It currently only supports `focusVisible()` action.
*
* @param {object} actions This object contains all possible actions
* that can be triggered programmatically.
*/
  action?: (actions: ButtonBaseActions) => void;
  onFocus?: React.FocusEventHandler;
  /**
   * Callback fired when the component is focused with a keyboard.
   * We trigger a `onFocus` callback too.
   */
  onFocusVisible?: React.FocusEventHandler<any>;
  disabled?: boolean
};
type State = {
  focusVisible: boolean
}
const withFocus = <P extends any>(C: React.ComponentType<P>) => {
  return class FocusElement extends React.Component<P & Props, State> {
    static displayName = getWrapDisplayName('withFocus')(C);
    static defaultProps: Props = {
    };
    focusVisibleTimeout: O.Option<NodeJS.Timeout> = O.none;

    focusVisibleCheckTime = 50;

    focusVisibleMaxCheckTimes = 5;
    keyDown = false;
    button: O.Option<React.AnchorHTMLAttributes<HTMLElement> & React.ButtonHTMLAttributes<HTMLElement>> = O.none;
    handleMouseDown = (event: React.MouseEvent) => {
      pipe(
        this.focusVisibleTimeout,
        O.map(clearTimeout)
      )

      if (this.state.focusVisible) {
        this.setState({ focusVisible: false });
      }
      if (this.props.onMouseDown)
        this.props.onMouseDown(event)
    };
    handleMouseLeave = (event: React.MouseEvent) => {
      if (this.state.focusVisible) {
        event.preventDefault();
      }
      if (this.props.onMouseLeave)
        this.props.onMouseLeave(event)
    }

    handleBlur = (event: React.FocusEvent) => {
      pipe(
        this.focusVisibleTimeout,
        O.map(clearTimeout)
      )

      if (this.state.focusVisible) {
        this.setState({ focusVisible: false });
      }
      if (this.props.onBlur)
        this.props.onBlur(event)
    }

    state = {
      focusVisible: false
    };
    handleFocus = (event: React.FocusEvent) => {
      if (this.props.disabled) {
        return;
      }
      // Fix for https://github.com/facebook/react/issues/7769
      if (O.isSome(this.button)) {
        this.button = O.some(event.currentTarget) as any;
      }
      event.persist();
      pipe(
        this.button,
        O.map((a => {
          detectFocusVisible(this, a, () => {
            this.onFocusVisibleHandler(event);
          });
        }))
      )



      if (this.props.onFocus) {
        this.props.onFocus(event);
      }
    };

    componentDidMount() {
      this.button = O.some(ReactDOM.findDOMNode(this) as any);
      pipe(
        this.button,
        O.map(a => listenForFocusKeys(ownerWindow(a)))
      )

      if (this.props.action) {
        this.props.action({
          focusVisible: () => {
            this.setState({ focusVisible: true });
            pipe(
              this.button,
              O.map((a: any) => a.focus())
            )

          },
        });
      }
    }


    componentWillUnmount() {
      this.button = O.none;
      pipe(
        this.focusVisibleTimeout,
        O.map(clearTimeout)
      )

    }


    onFocusVisibleHandler = (event: React.FocusEvent) => {
      this.keyDown = false;
      this.setState({ focusVisible: true });

      if (this.props.onFocusVisible) {
        this.props.onFocusVisible(event);
      }
    };

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
      if (typeof prevState.focusVisible === 'undefined') {
        return {
          focusVisible: false,
          lastDisabled: nextProps.disabled,
        };
      }

      // The blur won't fire when the disabled state is set on a focused input.
      // We need to book keep the focused state manually.
      if (nextProps.disabled && prevState.focusVisible) {
        return {
          focusVisible: false,
          lastDisabled: nextProps.disabled,
        };
      }

      return {
        lastDisabled: nextProps.disabled,
      };
    }



    render() {

      return (
        <C
          {...omit(this.props,'onFocusVisible') as any}
        

          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onMouseDown={this.handleMouseDown}
          onMouseLeave={this.handleMouseLeave}

        />
      );
    }
  }

}
export default withFocus;
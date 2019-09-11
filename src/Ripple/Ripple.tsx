import * as React from 'react';
import Transition, { TransitionProps } from 'react-transition-group/Transition';
import { RippleRoot, RippleChild } from './BaseRipple';
import { Circle, circleToRect } from './circleUtils';
export type RippleProps = {

  /**
   * If `true`, the ripple pulsates, typically indicating the keyboard focus state of an element.
   */
  pulsate?: boolean,
  /**
   * Circle of the ripple
   */
  circle: Circle;

}

/**
 * @ignore - internal component.
 */
class Ripple extends React.Component<
  RippleProps & TransitionProps,
  { visible?: boolean, leaving?: boolean }>
{
  state = {
    visible: false,
    leaving: false,
  };

  handleEnter = (node: HTMLElement, isAppearing: boolean) => {
    this.setState({
      visible: true,
    });
    this.props.onEnter ? this.props.onEnter(node, isAppearing) : null;
  };

  handleExit = (node: HTMLElement, ) => {
    this.setState({
      leaving: true,
    });
    this.props.onExit ? this.props.onExit(node) : null;
  };

  render() {
    const {
      pulsate = false,
      circle,
      onEnter,
      onExit,
      ...other
    } = this.props;
    const { visible, leaving } = this.state;
    return (
      <Transition onEnter={this.handleEnter} onExit={this.handleExit} {...other}>
        <RippleRoot pulsate={pulsate} visible={visible} style={circleToRect(circle)}>
          <RippleChild pulsate={pulsate} visible={leaving} />
        </RippleRoot>
      </Transition>
    );
  }
}
export default Ripple;

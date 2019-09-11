import * as React from 'react';
import { NoSSR } from '../NoSSR';
import Modal from './Portal';

import { merge } from 'macoolka-object';
import { delayFunction } from '../Delay'

const SCROLL_THROTTLE_DELAY = 20;

export type slidePriorityType =
  'slideOnCurrentEdge' |
  'slideOnOppositeEdge' |
  'slideOnAdjacentEdge' |
  'changeType';

export interface AutoPositionProps {
  /**
   * Define the element to which the component will be positioned
   */
  container?: Element;
  /**
   * Define boundaries to which the component will be positioned
   */
  wrapper?: Element;
  /**
   * Determines css position property. We recommend to use 'absolute'
   * positioning as it requires less calculations and is more effective.
   */
  positionStyle?: 'fixed' | 'absolute';
  /**
   * Determines whether AutoPosition component visible or not
   */
  opened?: boolean;
  /**
   * Determines x axis position
   */
  positionX?: 'left' | 'right';
  /**
   * Determines y axis position
   */
  positionY?: 'top' | 'bottom';
  /**
   * Set the bypass curcuit: along the outer or inner border of the component
   */
  type?: 'outer' | 'inner';
  /**
   * Set priority direction. The positioned component doesn't fit boundaries
   * in default direction this defines which side this component will try to
   * occupy first: opposite horizontal or opposite vertical.
   */
  direction?: 'vertical' | 'horizontal';
  /**
   * Set the tolerance for verifying that the positioned component fits its
   * boundaries
   */
  overflowMargin?: number;
  /**
   * When AutoPosition component dont fit in window, display it in center
   */
  allowedShowByCenter?: boolean;
  /**
   * Allow the component to change its position along the current edge
   */
  allowedSlideOnCurrentEdge?: boolean;
  /**
   * Allow the component to jump to the opposite edge if necessary
   */
  allowedSlideOnOppositeEdge?: boolean;
  /**
   * Allow the component to jump to the adjacent edge if necessary
   */
  allowedSlideOnAdjacentEdge?: boolean;
  /**
   * Allow the component to change bypass circuit if necessary
   */
  allowedChangeType?: boolean;
  /**
   * Set positioning priority template
   */
  slidePriority?: slidePriorityType[];
  /**
   * Specify function to call on overflow
   */
  onOverflow?: (a: any) => void;
  onOpen?: () => void;
}
const defaultProps = {
  // parent: window,
  // wrapper: window,
  positionStyle: 'absolute',
  visible: false,
  positionX: 'left',
  positionY: 'top',
  type: 'inner',
  direction: 'horizontal',
  overflowMargin: -5,
  allowedShowByCenter: false,
  slidePriority: [
    'slideOnAdjacentEdge',
    'changeType',
    'slideOnOppositeEdge',
    'slideOnCurrentEdge',
  ],
  allowedSlideOnCurrentEdge: true,
  allowedSlideOnOppositeEdge: true,
  allowedSlideOnAdjacentEdge: false,
  allowedChangeType: false,
  onOverflow: null,
  onOpen: null,
};
export interface AutoPositionState {
  currentDirection: 'vertical' | 'horizontal';
  currentPositionX: 'left' | 'right';
  currentPositionY: 'top' | 'bottom';
  currentType: 'outer' | 'inner';
  currentPosition: any;
}
let autoPositionInstances: any[] = [];
class AutoPosition extends React.Component<AutoPositionProps, AutoPositionState> {
  currentPosition: any = {
    top: null,
    left: null,
  };
  _domNode?: Element;
  visible: boolean;
  _handleScrollThrottled = () => delayFunction(SCROLL_THROTTLE_DELAY)(this._handleScroll.bind(this))()
 
  constructor(props: AutoPositionProps) {

    super(props);
    props = merge({}, defaultProps, props);
    this.state = {
      currentDirection: 'vertical',
      currentPositionX: 'left',
      currentPositionY: 'top',
      currentType: 'outer',
      currentPosition: {
        top: null,
        left: null,
      },
    };
    this.visible = props.opened ? props.opened : false;
    this._saveRef = this._saveRef.bind(this);
    this._handleResize = this._handleResize.bind(this);
  }

  componentDidMount() {
    autoPositionInstances.push(this);

    window.addEventListener('resize', this._handleResize);

    window.addEventListener('scroll', this._handleScrollThrottled, true);
  }

  componentWillReceiveProps(nextProps: AutoPositionProps) {
    const { positionX, positionY, type, direction, container } = nextProps;
    if (
      positionX !== this.props.positionX ||
      positionY !== this.props.positionY ||
      type !== this.props.type ||
      direction !== this.props.direction ||
      container !== this.props.container
    ) {
      this._recalculatePosition(nextProps);
    }
  }

  componentWillUnmount() {
    const index = autoPositionInstances.indexOf(this);

    if (index + 1) {
      autoPositionInstances = [
        ...autoPositionInstances.slice(0, index),
        ...autoPositionInstances.slice(index + 1),
      ];
    }

    window.removeEventListener('resize', this._handleResize);

    window.removeEventListener('scroll', this._handleScrollThrottled, true);
  }

  recalculatePosition() {
    this._recalculatePosition(this.props);
  }

  _handleResize = () => {
    if (!this.props.opened) { return; }
    this._recalculatePosition(this.props);
  }

  _handleScroll = () => {
    if (!this.props.opened) { return; }

    const forceRecalculate = this.props.positionStyle === 'fixed';
    this._recalculatePosition(this.props, forceRecalculate);
  }

  _recalculatePosition = (props: any, forceRecalculate?: boolean) => {
    const {
      direction: initDirection,
      positionY,
      positionX,
      type,
      allowedShowByCenter,
      parent,
      slidePriority,
      allowedSlideOnCurrentEdge,
      allowedSlideOnOppositeEdge,
      allowedSlideOnAdjacentEdge,
      allowedChangeType,
    } = props;

    const {
      currentDirection,
      currentPositionY,
      currentPositionX,
      currentType,
    } = this.state;

    const initPosition = this._getPositions({
      positionY,
      positionX,
      type,
      direction: initDirection,
      parent,
    });

    const currentPosition = this._getPositions({
      positionY: currentPositionY,
      positionX: currentPositionX,
      type: currentType,
      direction: currentDirection,
      parent,
    });

    const overflowByCurrentPosition = this._overflowCheck(currentPosition),
      overflowByInitPosition = this._overflowCheck(initPosition);

    let newPosition = currentPosition,
      newDirection = currentDirection,
      newPositionY = currentPositionY,
      newPositionX = currentPositionX,
      newType = currentType;

    if (!overflowByInitPosition.length) {
      newPosition = initPosition;
      newDirection = initDirection;
      newPositionX = positionX;
      newPositionY = positionY;
      newType = type;
    }

    if (overflowByInitPosition.length) {
      const availablePropArrays: any[] = [];
      const idxAllow: any = {};

      const sortItems = (firstItem: any, items: any[]) => {
        items.splice(items.indexOf(firstItem), 1);
        return [firstItem].concat(items);
      };

      slidePriority.forEach((priority: slidePriorityType, idx: number) => {
        if (priority === 'slideOnCurrentEdge') {
          if (currentDirection === 'horizontal') {
            idxAllow.positionY = idx;

            if (allowedSlideOnCurrentEdge) {
              availablePropArrays.push(sortItems(positionY, ['top', 'bottom']));
            } else { availablePropArrays.push([positionY]); }
          } else {
            idxAllow.positionX = idx;

            if (allowedSlideOnCurrentEdge) {
              availablePropArrays.push(sortItems(positionX, ['left', 'right']));
            } else { availablePropArrays.push([positionX]); }
          }
        }

        if (priority === 'slideOnOppositeEdge') {
          if (currentDirection === 'horizontal') {
            idxAllow.positionX = idx;

            if (
              allowedSlideOnOppositeEdge &&
              currentDirection === initDirection
            ) {
              availablePropArrays.push(sortItems(positionX, ['left', 'right']));
            } else { availablePropArrays.push([positionX]); }
          } else {
            idxAllow.positionY = idx;

            if (
              allowedSlideOnOppositeEdge &&
              currentDirection === initDirection
            ) {
              availablePropArrays.push(sortItems(positionY, ['top', 'bottom']));
            } else { availablePropArrays.push([positionY]); }
          }
        }

        if (priority === 'slideOnAdjacentEdge') {
          idxAllow.direction = idx;

          if (
            allowedSlideOnAdjacentEdge &&
            currentDirection === initDirection
          ) {
            availablePropArrays.push(
              sortItems(initDirection, ['horizontal', 'vertical'])
            );
          } else {
            availablePropArrays.push([currentDirection]);
          }
        }

        if (priority === 'changeType') {
          idxAllow.type = idx;

          if (allowedChangeType) {
            availablePropArrays.push(sortItems(type, ['outer', 'inner']));
          } else { availablePropArrays.push([type]); }
        }
      });

      const propCombinations = availablePropArrays.reduce(
        (acc, cur) => {
          const ret: any[] = [];
          acc.forEach((_acc: any) => cur.forEach((_cur: any) => ret.push(_acc.concat([_cur]))));
          return ret;
        },
        [[]]
      );

      let lastCheckPosition = newPosition;

      const newProps = propCombinations.find((combination: any) => {
        lastCheckPosition = this._getPositions({
          positionY: combination[idxAllow.positionY] || positionY,
          positionX: combination[idxAllow.positionX] || positionX,
          type: combination[idxAllow.type] || type,
          direction: combination[idxAllow.direction],
          parent,
        });

        const overflow = this._overflowCheck(lastCheckPosition);
        return !overflow.length;
      });

      if (newProps) {
        newPosition = lastCheckPosition;
        newDirection = newProps[idxAllow.direction];
        newPositionY = newProps[idxAllow.positionY];
        newPositionX = newProps[idxAllow.positionX];
        newType = newProps[idxAllow.type];
      } else if (allowedShowByCenter) {
        newPosition = this._getCenterPosition();
      }
      if (typeof this.props.onOverflow !== 'undefined') {
        this.props.onOverflow(overflowByCurrentPosition);
      }

    }

    this.setState({
      currentPosition: newPosition,
      currentDirection: newDirection,
      currentPositionX: newPositionX,
      currentPositionY: newPositionY,
      currentType: newType,
    });
  }

  _handleContentMounted = () => {
    this.recalculatePosition();
    if (typeof this.props.onOpen !== 'undefined') {
      this.props.onOpen();
    }

  }

  _saveRef = (ref?: any) => {
    this._domNode = ref;
    if (ref) { this._handleContentMounted(); }
  }

  _overflowCheck = ({ top, left }: any) => {
    const overflow: any = [];

    if (!this._domNode) { return overflow; }

    const { wrapper } = this.props;
    const contentSize = (this._domNode as any).getBoundingClientRect();

    let wrapperTop = 0,
      wrapperLeft = 0,
      wrapperBottom = 0,
      wrapperRight = 0;

    if (wrapper instanceof Window) {
      wrapperBottom = window.innerHeight;
      wrapperRight = window.innerWidth;
    } else if (wrapper instanceof HTMLElement) {
      const wrapperSize = wrapper.getBoundingClientRect();

      wrapperTop = wrapperSize.top;
      wrapperLeft = wrapperSize.left;
      wrapperBottom = wrapperSize.bottom;
      wrapperRight = wrapperSize.right;
    }

    if (
      left + contentSize.width > wrapperRight - (this.props.overflowMargin as any) ||
      left < wrapperLeft + (this.props.overflowMargin as any)
    ) {
      overflow.push('horizontal');
    }

    if (
      top + contentSize.height > wrapperBottom - (this.props.overflowMargin as any) ||
      top < wrapperTop + (this.props.overflowMargin as any)
    ) {
      overflow.push('vertical');
    }

    return overflow;
  }

  _getCenterPosition = () => {
    const viewportWidth = window.innerWidth,
      viewportHeight = window.innerHeight,
      contentSize = (this._domNode as any).getBoundingClientRect();

    return {
      left: viewportWidth / 2 - contentSize.width / 2,
      top: viewportHeight / 2 - contentSize.height / 2,
    };
  }

  _getPositions = ({ positionX, positionY, type, direction, parent }: any) => {
    if (this._domNode && parent) {
      const parentRect = parent.getBoundingClientRect(),
        contentRect = (this._domNode as any).getBoundingClientRect();

      if (positionX === 'left' && positionY === 'bottom') {
        if (type === 'outer') {
          if (direction === 'horizontal') {
            return {
              top: parentRect.top - (contentRect.height - parentRect.height),
              left: parentRect.left - contentRect.width,
            };
          } else {
            return {
              top: parentRect.bottom,
              left: parentRect.left,
            };
          }
        } else {
          return {
            top: parentRect.top - (contentRect.height - parentRect.height),
            left: parentRect.left,
          };
        }
      } else if (positionX === 'left' && positionY === 'top') {
        if (type === 'outer') {
          if (direction === 'horizontal') {
            return {
              top: parentRect.top,
              left: parentRect.left - contentRect.width,
            };
          } else {
            return {
              top: parentRect.top - contentRect.height,
              left: parentRect.left,
            };
          }
        } else {
          return {
            top: parentRect.top,
            left: parentRect.left,
          };
        }
      } else if (positionX === 'right' && positionY === 'top') {
        if (type === 'outer') {
          if (direction === 'horizontal') {
            return {
              top: parentRect.top,
              left: parentRect.right,
            };
          } else {
            return {
              top: parentRect.top - contentRect.height,
              left: parentRect.right - contentRect.width,
            };
          }
        } else {
          return {
            top: parentRect.top,
            left: parentRect.right - contentRect.width,
          };
        }
      } else if (positionX === 'right' && positionY === 'bottom') {
        if (type === 'outer') {
          if (direction === 'horizontal') {
            return {
              top: parentRect.bottom - contentRect.height,
              left: parentRect.right,
            };
          } else {
            return {
              top: parentRect.bottom,
              left: parentRect.right - contentRect.width,
            };
          }
        } else {
          return {
            top: parentRect.bottom - contentRect.height,
            left: parentRect.right - contentRect.width,
          };
        }
      }
    }

    return {
      top: 0,
      left: 0,
    };
  }

  render() {
    const style = {
      position: 'fixed',
      zIndex: 9000,
      ...this.state.currentPosition,
    };
    return !this.props.opened ? null : (
      <NoSSR>
        <Modal container={this.props.container} >
          <div style={style} ref={this._saveRef} >
            {this.props.children}
          </div>
        </Modal>
      </NoSSR>
    );
  }

}
export default AutoPosition
export const recalculateAllAutoPosition = () => {
  autoPositionInstances.forEach(instance => instance.recalculatePosition());
};

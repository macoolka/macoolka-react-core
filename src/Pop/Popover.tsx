// @inheritedComponent Modal

import React from 'react';
import { Props } from '../css';
import { ownerWindow, ownerDocumentBody } from '../utils';
import { NoSSR } from '../NoSSR';
import Modal, { ModalProps } from './Modal';
import { Option, some, none } from 'fp-ts/lib/Option';

import { PopContent } from './Element'
import Transition, { TransitionProps as _TransitionProps } from 'react-transition-group/Transition';
import { omit } from 'macoolka-object'
import { pipe } from 'fp-ts/lib/pipeable'
import * as O from 'fp-ts/lib/Option';
type TransitionProps = Partial<_TransitionProps>
export {
    TransitionProps
}
function getOffsetTop(rect, vertical) {
    let offset = 0;

    if (typeof vertical === 'number') {
        offset = vertical;
    } else if (vertical === 'center') {
        offset = rect.height / 2;
    } else if (vertical === 'bottom') {
        offset = rect.height;
    }

    return offset;
}

function getOffsetLeft(rect, horizontal) {
    let offset = 0;

    if (typeof horizontal === 'number') {
        offset = horizontal;
    } else if (horizontal === 'center') {
        offset = rect.width / 2;
    } else if (horizontal === 'right') {
        offset = rect.width;
    }

    return offset;
}

function getTransformOriginValue(transformOrigin) {
    return [transformOrigin.horizontal, transformOrigin.vertical]
        .map(n => {
            return typeof n === 'number' ? `${n}px` : n;
        })
        .join(' ');
}

// Sum the scrollTop between two elements.
function getScrollParent(parent, child) {
    let element = child;
    let scrollTop = 0;

    while (element && element !== parent) {
        element = element.parentNode;
        scrollTop += element.scrollTop;
    }
    return scrollTop;
}


export interface PopoverOrigin {
    horizontal: 'left' | 'center' | 'right' | number;
    vertical: 'top' | 'center' | 'bottom' | number;
}

export interface PopoverPosition {
    top: number;
    left: number;
}

export type PopoverReference = 'anchorEl' | 'anchorPosition' | 'none';
export type ContentProps = Props;
export interface PopoverProps
    extends ModalProps {
    /**
* This is callback property. It's called by the component on mount.
* This is useful when you want to trigger an action programmatically.
* It currently only supports updatePosition() action.
*
* @param {object} actions This object contains all posible actions
* that can be triggered programmatically.
*/
    action?: (actions: PopoverActions) => void;
    /**
 * This is the DOM element
 * that may be used to set the position of the popover.
 */
    anchorEl?: HTMLElement;
    /**
 * This is the point on the anchor where the popover's
 * `anchorEl` will attach to. This is not used when the
 * anchorReference is 'anchorPosition'.
 *
 * Options:
 * vertical: [top, center, bottom];
 * horizontal: [left, center, right].
 */
    anchorOrigin?: PopoverOrigin;
    /**
 * This is the position that may be used
 * to set the position of the popover.
 * The coordinates are relative to
 * the application's client area.
 */
    anchorPosition?: PopoverPosition;
    /*
 * This determines which anchor prop to refer to to set
 * the position of the popover.
 */
    anchorReference?: PopoverReference;
    /**
 * The elevation of the popover.
 */
    elevation?: number;
    /**
 * This function is called in order to retrieve the content anchor element.
 * It's the opposite of the `anchorEl` property.
 * The content anchor element should be an element inside the popover.
 * It's used to correctly scroll and set the position of the popover.
 * The positioning strategy tries to make the content anchor element just above the
 * anchor element.
 */
    getContentAnchorEl?: (element: HTMLElement) => HTMLElement | undefined;
    marginThreshold?: number;
    modal?: boolean;
    /**
 * This is the point on the popover which
 * will attach to the anchor's origin.
 *
 * Options:
 * vertical: [top, center, bottom, x(px)];
 * horizontal: [left, center, right, x(px)].
 */
    transformOrigin?: PopoverOrigin;
    contentProps?: ContentProps,
    transitionProps?: TransitionProps,
}

export type PopoverClassKey = 'paper';

export interface PopoverActions {
    updatePosition(): void;
}
class Popover extends React.Component<PopoverProps> {
    static defaultProps = {
        anchorReference: 'anchorEl',
        anchorOrigin: {
            vertical: 'top',
            horizontal: 'left',
        },
        elevation: 8,
        marginThreshold: 16,
        transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
        },
    };
    contentEl: Option<HTMLElement> = none;

    handleGetOffsetTop = getOffsetTop;

    handleGetOffsetLeft = getOffsetLeft;

    _handleResize = () => {
        this.setPositioningStyles();
    }; // Corresponds to 10 frames at 60 Hz.

    componentDidMount() {
        if (this.props.action) {
            this.props.action({
                updatePosition: this._handleResize,
            });
        }
        window.addEventListener('resize', this._handleResize);

    }

    componentWillUnmount = () => {
        window.removeEventListener('resize', this._handleResize);
    };

    setPositioningStyles = () => {
        pipe(
            this.contentEl,
            O.map(
                a => {
                    const element: any = a;
                    if (element && element.style) {
                        const positioning = this.getPositioningStyle(element);
                        if (positioning.top !== null) {
                            element.style.top = positioning.top;
                        }
                        if (positioning.left !== null) {
                            element.style.left = positioning.left;
                        }
                        element.style.transformOrigin = positioning.transformOrigin;
                    }
                }
            )
        )


    };

    getPositioningStyle = element => {
        const { anchorEl, anchorReference, marginThreshold } = this.props;

        // Check if the parent has requested anchoring on an inner content node
        const contentAnchorOffset = this.getContentAnchorOffset(element);
        const elemRect = {
            width: element.clientWidth,
            height: element.clientHeight,
        };

        // Get the transform origin point on the element itself
        const transformOrigin = this.getTransformOrigin(elemRect, contentAnchorOffset);

        if (anchorReference === 'none') {
            return {
                top: null,
                left: null,
                transformOrigin: getTransformOriginValue(transformOrigin),
            };
        }

        // Get the offset of of the anchoring element
        const anchorOffset = this.getAnchorOffset(contentAnchorOffset);

        // Calculate element positioning
        let top = anchorOffset!.top - transformOrigin.vertical;
        let left = anchorOffset!.left - transformOrigin.horizontal;
        const bottom = top + elemRect.height;
        const right = left + elemRect.width;

        // Use the parent window of the anchorEl if provided
        const containerWindow = ownerWindow(anchorEl);

        // Window thresholds taking required margin into account
        const heightThreshold = containerWindow.innerHeight - marginThreshold!;
        const widthThreshold = containerWindow.innerWidth - marginThreshold!;

        // Check if the vertical axis needs shifting
        if (top < marginThreshold!) {
            const diff = top - marginThreshold!;
            top -= diff;
            transformOrigin.vertical += diff;
        } else if (bottom > heightThreshold) {
            const diff = bottom - heightThreshold;
            top -= diff;
            transformOrigin.vertical += diff;
        }


        // Check if the horizontal axis needs shifting
        if (left < marginThreshold!) {
            const diff = left - marginThreshold!;
            left -= diff;
            transformOrigin.horizontal += diff;
        } else if (right > widthThreshold) {
            const diff = right - widthThreshold;
            left -= diff;
            transformOrigin.horizontal += diff;
        }

        return {
            top: `${top}px`,
            left: `${left}px`,
            transformOrigin: getTransformOriginValue(transformOrigin),
        };
    };

    // Returns the top/left offset of the position
    // to attach to on the anchor element (or body if none is provided)
    getAnchorOffset(contentAnchorOffset) {
        const { anchorEl, anchorOrigin, anchorReference, anchorPosition } = this.props;

        if (anchorReference === 'anchorPosition') {
            return anchorPosition;
        }

        // If an anchor element wasn't provided, just use the parent body element of this Popover
        const anchorElement: any =
            anchorEl || pipe(
                this.contentEl,
                O.map(a => ownerDocumentBody(a)),
                O.getOrElse(()=>ownerDocumentBody())
            );
        const anchorRect = anchorElement.getBoundingClientRect();
        const anchorVertical = contentAnchorOffset === 0 ? anchorOrigin!.vertical : 'center';

        return {
            top: anchorRect.top + this.handleGetOffsetTop(anchorRect, anchorVertical),
            left: anchorRect.left + this.handleGetOffsetLeft(anchorRect, anchorOrigin!.horizontal),
        };
    }

    // Returns the vertical offset of inner content to anchor the transform on if provided
    getContentAnchorOffset(element) {
        const { getContentAnchorEl, anchorReference } = this.props;
        let contentAnchorOffset = 0;

        if (getContentAnchorEl && anchorReference === 'anchorEl') {
            const contentAnchorEl = getContentAnchorEl(element);

            if (contentAnchorEl && element.contains(contentAnchorEl)) {
                const scrollTop = getScrollParent(element, contentAnchorEl);
                contentAnchorOffset =
                    contentAnchorEl.offsetTop + contentAnchorEl.clientHeight / 2 - scrollTop || 0;
            }
        }

        return contentAnchorOffset;
    }

    // Return the base transform origin using the element
    // and taking the content anchor offset into account if in use
    getTransformOrigin(elemRect, contentAnchorOffset = 0) {
        const { transformOrigin } = this.props;
        return {
            vertical: this.handleGetOffsetTop(elemRect, transformOrigin!.vertical) + contentAnchorOffset,
            horizontal: this.handleGetOffsetLeft(elemRect, transformOrigin!.horizontal),
        };
    }

    handleEnter = () => {
        this.setPositioningStyles();
    };
    handleEntering = (node: HTMLElement, isAppearing: boolean) => {
        if (this.props.transitionProps && this.props.transitionProps.onEntering) {
            this.props.transitionProps.onEntering(node, isAppearing);
        }

        this.setPositioningStyles();
    };
    render() {
        const {
            action,
            anchorEl,
            anchorOrigin,
            anchorPosition,
            anchorReference,
            children,
            container: containerProp,
            elevation,
            getContentAnchorEl,
            marginThreshold,

            opened,
            role,
            transformOrigin,
            transitionProps = {},
            contentProps,
            ...other
        } = this.props;


        return (
            <NoSSR>
                <Modal container={containerProp || ownerDocumentBody(anchorEl)} opened={opened}  {...other} onRendered={this.handleEnter}>
                    <Transition timeout={1000} {...omit(transitionProps, 'onEntering')} onEntering={this.handleEntering} in={opened} appear>
                        {() => (
                            <PopContent
                                ref={node => {
                                    this.contentEl = node ? some(node) : none;
                                }}
                                {...contentProps}
                            >
                                {children}
                            </PopContent>
                        )}

                    </Transition>
                </Modal>
            </NoSSR>
        );
    }
}


export default Popover;

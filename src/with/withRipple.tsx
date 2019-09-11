import TouchRipple from '../Ripple/TouchRipple';
import PureTouchRipple, { Props as TouchRippleProps, startAction, stopAction } from '../Ripple/PureTouchRipple';
import { Action } from '../actions';
import * as O from 'fp-ts/lib/Option';
import { getWrapDisplayName, getWrapedDefaultProps } from '../reactHelper';
import * as React from 'react';
import { pipe } from 'fp-ts/lib/pipeable'
export type Props = {

    /**
     * If `true`, the ripples will be centered.
     * They won't start at the cursor interaction position.
     */
    centerRipple?: boolean;
    /**
     * If `true`, the ripple effect will be disabled.
     */
    disableRipple?: boolean;
    /**
     * If `true`, the touch ripple effect will be disabled.
     */
    disableTouchRipple?: boolean;
    /**
     * If `true`, the base button will have a keyboard focus ripple.
     * `disableRipple` must also be `false`.
     */
    focusRipple?: boolean;
    /**
     * Callback fired when the component is focused with a keyboard.
     * We trigger a `onFocus` callback too.
     */
    onFocusVisible?: React.FocusEventHandler<any>;
    /**
     * Properties applied to the `TouchRipple` element.
     */
    TouchRippleProps?: Partial<TouchRippleProps>;

    disabled?: boolean;
} & React.HTMLAttributes<any>;

const withRipple = <P extends React.HTMLAttributes<any>>(WrapedComponent: React.ComponentType<P>) => {

    return class ButtonBase extends React.Component<P & Props> {
        static displayName = getWrapDisplayName('withRipple')(WrapedComponent);
        static defaultProps: Props = getWrapedDefaultProps(WrapedComponent)({
            ...(WrapedComponent.defaultProps ? WrapedComponent.defaultProps : {}) as any,
            centerRipple: false,
            disableRipple: false,
            disableTouchRipple: false,
            focusRipple: false,
        });
        execute = (a: Action<any>) => {
            pipe(
                this.ripple,
                O.map(r => r.dispatch(a))
            )

        }
        keyDown = false;
        ripple: O.Option<PureTouchRipple> = O.none;
        eventHandler = <P extends {}>(event: React.SyntheticEvent<P>) =>
            (event.defaultPrevented || this.props.disableRipple === true ||
                (this.props.disableTouchRipple === true && event.type !== 'Blur')) ? O.none : O.some(event);
        handleMouseDown = (event: React.MouseEvent) => {
            pipe(
                this.eventHandler(event),
                O.map(() => (
                    this.execute(startAction.reverseGet({
                        x: event.clientX,
                        y: event.clientY,
                        eventName: event.type,
                        pulsate: false,
                    }))))
            )

            if (this.props.onMouseDown)
                this.props.onMouseDown(event)

        };
        handleTouchStart = (event: React.TouchEvent) => {
            pipe(
                this.eventHandler(event),
                O.map(() => (
                    this.execute(startAction.reverseGet({
                        x: event.touches[0].clientX,
                        y: event.touches[0].clientY,
                        eventName: event.type,
                        pulsate: false,
                    }))))
            )

            if (this.props.onTouchStart)
                this.props.onTouchStart(event)
        }

        handleMouseUp = (event: React.MouseEvent) => {
            pipe(
                this.eventHandler(event),
                O.map(() => (
                    this.execute(stopAction.reverseGet({
                        eventName: event.type,
                        persist: event.persist,
                    }))))
            )

            if (this.props.onMouseUp)
                this.props.onMouseUp(event)
        }

        handleMouseLeave = (event: React.MouseEvent) => {
            pipe(
                this.eventHandler(event),
                O.map(() => (
                    this.execute(stopAction.reverseGet({
                        eventName: event.type,
                        persist: event.persist,
                    }))))
            )

            if (this.props.onMouseLeave)
                this.props.onMouseLeave(event)
        }

        handleTouchEnd = (event: React.TouchEvent) => {
            pipe(
                this.eventHandler(event),
                O.map(() => (
                    this.execute(stopAction.reverseGet({
                        eventName: event.type,
                        persist: event.persist,
                    }))))
            )

            if (this.props.onTouchEnd)
                this.props.onTouchEnd(event)
        }

        handleTouchMove = (event: React.TouchEvent) => {

            pipe(
                this.eventHandler(event),
                O.map(() => (
                    this.execute(stopAction.reverseGet({
                        eventName: event.type,
                        persist: event.persist,
                    }))))
            )
            if (this.props.onTouchMove)
                this.props.onTouchMove(event)
        }

        handleBlur = (event: React.FocusEvent) => {
            if (!event.preventDefault) {
                this.execute(stopAction.reverseGet({
                    eventName: event.type,
                    persist: event.persist,
                }))
            }
            if (this.props.onBlur)
                this.props.onBlur(event)
        }


        onRippleRef = (node: PureTouchRipple) => {

            this.ripple = O.some(node);
        };


        render() {
            const {
                centerRipple,
                children,
                disableRipple,
                TouchRippleProps,
                disabled,
                focusRipple,
                disableTouchRipple,
                ...others
            } = this.props as any;
            return (
                <WrapedComponent
                    {...others}
                    disabled={disabled}
                    onBlur={this.handleBlur}
                    onMouseDown={this.handleMouseDown}
                    onMouseLeave={this.handleMouseLeave}
                    onMouseUp={this.handleMouseUp}
                    onTouchEnd={this.handleTouchEnd}
                    onTouchMove={this.handleTouchMove}
                    onTouchStart={this.handleTouchStart}

                >

                    {children}
                    {!disableRipple && !disabled ? (
                        <TouchRipple ref={this.onRippleRef} center={centerRipple} {...TouchRippleProps} />
                    ) : null}
                </WrapedComponent>
            );
        }
    }


}
export default withRipple;
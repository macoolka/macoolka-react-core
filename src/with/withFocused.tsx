

import * as React from 'react';
import { getWrapDisplayName } from '../reactHelper';

export type WithFocusedProps = {
    onFocused?: (value: boolean) => void;
};
type State = {
    focused: boolean
}
const withFocused = <P extends {
    focused?: boolean,
    onFocus?: React.FocusEventHandler;
    onBlur?: React.FocusEventHandler;
    disabled?: boolean
}>(C: React.ComponentType<P>) => {
    return class FocusElement extends React.Component<WithFocusedProps & P, State> {
        static displayName = getWrapDisplayName('withFocused')(C);
        static defaultProps = {
            disabled: false,
        };
        state: State = {
            focused: false,
        };
        handleFocus = (event: React.FocusEvent<any>) => {
            // Fix a bug with IE11 where the focus/blur events are triggered
            // while the input is disabled.

            if (this.props.disabled) {
                event.stopPropagation();
                return;
            }
            if (!this.state.focused) {
                this.setState({ focused: true });
                if (this.props.onFocused) {
                    this.props.onFocused(true)
                }

            }

            if (this.props.onFocus) {
                this.props.onFocus(event);
            }

        };

        handleBlur = (event: React.FocusEvent<any>) => {
            if (this.state.focused) {
                this.setState({ focused: false });
                if (this.props.onFocused) {
                    this.props.onFocused(false)
                }

            }

            if (this.props.onBlur) {
                this.props.onBlur(event);
            }
        };

        componentWillReceiveProps = (nextProps: WithFocusedProps & P) => {
            if (
                !this.props.disabled && nextProps.disabled
            ) {
                if (this.state.focused) {
                    this.setState({ focused: false });
                    if (this.props.onFocused) {
                        this.props.onFocused(false)
                    }

                }
            }
        };
        componentWillUpdate = (nextProps: WithFocusedProps & P) => {
            // Book keep the focused state.
            if (
                !this.props.disabled && nextProps.disabled
            ) {

                if (this.props.onBlur) {
                    const a: any = this.props.onBlur;
                    a();
                }
            }
        };
        render() {
            const { onBlur, onFocus, ...others } = this.props as any;
            return (
                <C
                    {...others}
                    focused={this.state.focused}
                    onBlur={this.handleBlur}
                    onFocus={this.handleFocus}

                />
            );
        }
    }

}
export default withFocused;
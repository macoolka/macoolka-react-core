import * as React from 'react';
import withRipple, { Props as RippleProps } from '../with/withRipple';
export type Props = React.AnchorHTMLAttributes<HTMLElement> & React.ButtonHTMLAttributes<HTMLElement> & RippleProps &
{
  className?: string;
}
const Button: React.ComponentType<Props> =
  ({

    disabled,
    tabIndex,
    onClick,
    className,
    href,
    children,
    ...others


  }) => {


    const buttonProps: React.AnchorHTMLAttributes<HTMLElement> & React.ButtonHTMLAttributes<HTMLElement> = { ...others };

    if (disabled) {
      buttonProps.disabled = disabled;
      buttonProps.tabIndex = -1;
    } else {
      buttonProps.tabIndex = tabIndex;
    }


    if (onClick && !disabled) {
      buttonProps.onClick = onClick
    }
    if (className) {
      buttonProps.className = className;
    }

    if (href) {
      return (<a

        {...buttonProps}
      >
        {children}
      </a>)
    } else {
      return (<button

        {...buttonProps}

      > {children}</button>
      )
    }

  };


Button.defaultProps = {
  tabIndex: 0,
};
export default withRipple(Button);

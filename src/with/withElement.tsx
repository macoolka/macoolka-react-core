import * as React from 'react';
import { ElementProps } from '../types';
import { Props } from '../css'
import { getWrapDisplayName, getWrapedDefaultProps } from '../reactHelper';
import { omit } from 'macoolka-object'
const withElement = <P extends React.HTMLAttributes<any> & Props>
    (WrapedComponent: React.ComponentType<P &{ref?:any}>) => {
    const C = React.forwardRef((props: P & ElementProps,ref:any) => {

        return (
            <WrapedComponent
                ref={ref}
                {...omit(props, ['tabIndex', 'onClick']) as any}
                tabIndex={props.disabled ? -1 : props.tabIndex}
                onClick={props.disabled ? undefined : props.onClick}
                mkTextColor={props.disabled ? 'disabled' : props.mkTextColor}
                mkHoverTextColor={props.disabled ? undefined : props.mkHoverTextColor}
                mkHoverColor={props.disabled ? undefined : props.mkHoverColor}
                mkColor={props.disabled ? undefined : props.mkColor}
            />
        );

    })
    C.displayName = getWrapDisplayName('withElement')(WrapedComponent)
    // const originDefaultProps:{}= WrapedComponent.defaultProps? WrapedComponent.defaultProps:{};
    C.defaultProps = getWrapedDefaultProps(WrapedComponent)({ tabIndex: 0 } as any)
    /*   
        C.defaultProps = {
            tabIndex: 0,
            ...originDefaultProps
        } as ElementProps & P */
    return C;
}
export default withElement;

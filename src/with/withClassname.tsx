import * as React from 'react';
export type Props = {
    disabled?: boolean;
    className?: string
    tabIndex?:number
    onClick?:any;
};
import { getWrapDisplayName } from '../reactHelper';
const withElement = <P extends Props>
    (WrapedComponent: React.ComponentType<P>) => {
    const C: React.SFC<P> = prop => {
        return (
            <WrapedComponent
                {...prop}
  
               tabIndex={prop.disabled ? -1 : prop.tabIndex}
               className={prop.className}
               onClick={prop.disabled ? () => void 0 : prop.onClick}

            />
        );

    }
    C.displayName = getWrapDisplayName('withElement')(WrapedComponent)
    C.defaultProps = {
        tabIndex: 0,
    } as Props & P
    return C;
}
export default withElement;


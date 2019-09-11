import * as React from 'react';
export type FormChangeEvent = (a: { name: string, value: any, isFinish: boolean }) => void
export interface InputProps extends ElementProps {
    /**
   * The id of the `input` element.
   */

    /**
   * Use that property to pass a ref callback to the native input component.
   */
    inputRef?: (
        ref: HTMLInputElement
    ) => void;
    /**
    * Name attribute of the `select` or hidden `input` element.
    */
    name?: string;
    readOnly?: boolean;
    type?: string,
    mkChange?: FormChangeEvent,

    'aria-invalid'?: boolean | 'false' | 'true' | 'grammar' | 'spelling';
    defaultValue?: string | string[] | boolean | number;
    value?: string | string[] | boolean | number;
    rows?: number;
    required?: boolean
    checked?: boolean
}
export interface ElementProps {
    onBlur?: React.FocusEventHandler<any>;
    onChange?: React.ChangeEventHandler<any>;
    onFocus?: React.FocusEventHandler<any>;
    autoFocus?: boolean;
    onClick?: React.MouseEventHandler<any>
    tabIndex?: number;
    disabled?: boolean;
    focus?: () => void;
    id?: string;
}
export type GetProps<C> = C extends React.ComponentType<infer P> ? P : never;